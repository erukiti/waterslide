'use strict'

const path = require('path')

const createHtml = prefix => `<!DOCTYPE html>
<html lang="ja">
<meta charset="utf-8">

<body>
    <div id="root"></div>

    <script src="./${prefix}.js"></script>
</body>

</html>
`

const createJS = () =>
`'use strict'

import React from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'

import reducers from './reducers'
import App from './containers/app'

const store = createStore(reducers)

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
)
`

const createReducersJS = (dirname) => {
    const relpath = Array(dirname.replace(/\/$/, '').split('/').length).fill('..').join('/')
    return `' use strict'

import actions from './actions'

const conf = require('${relpath}/package.json')

const initialState = {
    title: conf.name,
    counter: {
        count: 1
    }
}

export default function reducers(state = initialState, action) {
    switch (action.type) {
        case actions.ADD_COUNT:
            {
                return {
                    title: state.title,
                    counter: {
                        count: state.counter.count + 1
                    }
                }
            }
        case actions.SET_TITLE:
            {
                return {
                    title: action.title,
                    counter: state.counter
                }
            }
        default:
            {
                return state
            }
    }
}
`
}

const createActionsJs = () =>
`'use strict'
export default {
    ADD_COUNT: 'ADD_COUNT',
    SET_TITLE: 'SET_TITLE'
}
`

const createActionsAppJs = () =>
`'use strict'
import actions from '../actions'

export default {
    addCount: () => {
        return {
            type: actions.ADD_COUNT
        }
    },
    setTitle: title => {
        return {
            type: actions.SET_TITLE,
            title
        }
    }
}
`

const createComponentsAppJs = () =>
`'use strict'
import React from 'react'

export default class App extends React.Component {
    render() {
        return <div>
            <span>{this.props.count}</span>
            <button onClick={this.props.handleAdd}>ADD</button>
        </div>
    }
}
`

const createContainersAppJs = () =>
`'use strict'
import { connect } from 'react-redux'
import act from '../actions/app'
import App from '../components/app'

function mapStateToProps(state) {
    document.title = state.title
    return {
        count: state.counter.count
    }
}

function mapDispatchToProps(dispatch) {
    return {
        handleAdd: () => {
            dispatch(act.addCount())
        },
        setTitle: title => {
            dispatch(act.setTitle(title))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
`


class ReactReduxGenerator {
    constructor(operator) {
        this.operator = operator
        this.sources = []
        this.isGenerated = false
    }

    static replace() {
        return 'browser'
    }

    generate(name, opts = {}) {
        this.isGenerated = true

        const dirname = path.dirname(name)
        const prefix = path.basename(name, '.js')

        this.sources.push({
            path: path.join(dirname, `${prefix}.html`),
            text: createHtml(prefix),
            opts: {type: 'copy'}
        })
        this.sources.push({
            path: path.join(dirname, `${prefix}.jsx`),
            text: createJS(),
            opts
        })

        // 一回きりにする
        this.sources.push({
            path: path.join(dirname, 'reducers.js'),
            text: createReducersJS(dirname)
        })
        this.sources.push({
            path: path.join(dirname, 'actions.js'),
            text: createActionsJs()
        })
        this.sources.push({
            path: path.join(dirname, 'actions', 'app.js'),
            text: createActionsAppJs()
        })
        this.sources.push({
            path: path.join(dirname, 'components', 'app.js'),
            text: createComponentsAppJs()
        })
        this.sources.push({
            path: path.join(dirname, 'containers', 'app.js'),
            text: createContainersAppJs()
        })
    }

    process() {
/*
        // FIXME: not works for timing
        if (!this.isGenerated) {
            this.operator.verbose('React-Redux is not generated.')
            return
        }
*/
        const babelGenerator = this.operator.getGenerator('babel')
        babelGenerator.addPreset('react')
        babelGenerator.addPlugin('babel-plugin-syntax-jsx')

        const jsGenerator = this.operator.getGenerator('js')
        jsGenerator.addDevPackage('babel-preset-react')
        jsGenerator.addDevPackage('babel-plugin-syntax-jsx')
        jsGenerator.addPackage('react')
        jsGenerator.addPackage('react-dom')
        jsGenerator.addPackage('react-redux')
        jsGenerator.addPackage('redux')
    }
    output() {
        return this.sources
    }
}

module.exports = ReactReduxGenerator
