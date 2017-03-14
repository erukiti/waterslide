'use strict'

const fs = require('fs')
const path = require('path')
const process = require('process')
const Mustache = require('mustache')

class ReactReduxGenerator {
    constructor(operator) {
        this.operator = operator
    }

    async generate(name, opts = {}) {
        // FIXME: 'foo-bar'

        const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1)
        const basename = capitalize(path.basename(name))

        const obj = {
            action: `${basename}Action`,
            component: `${basename}Component`,
            reducer: `${path.basename(name)}Reducer`,
            name: path.basename(name)
        }

        const render = async (inFile, outFile) => {
            const templ = fs.readFileSync(path.join(__dirname, `${inFile}.mst`)).toString()
            const content = Mustache.render(templ, obj)
            await this.operator.writeFile(path.join(name, `${outFile}`), content)
        }

        await render('action.js', 'action.js')
        await render('component.jsx', 'component.jsx')
        await render('container.js', 'index.js')
        await render('reducer.js', 'reducer.js')
    }
}

module.exports = ReactReduxGenerator
