'use strict'

const ReactReduxGenerator = require('./react_redux_generator')

class ReactReduxEnv {
    constructor(operator) {
        this.operator = operator
        operator.requireEnv('js')
        operator.requireProvider('js')
        operator.requireProvider('babel')

        operator.replaceGenerator('browser', new ReactReduxGenerator(operator))
    }
    process() {
        const babelProvider = this.operator.getProvider('babel')
        babelProvider.addPreset('react')
        babelProvider.addPlugin('babel-plugin-syntax-jsx')

        const jsProvider = this.operator.getProvider('js')
        jsProvider.addDevPackage('babel-preset-react')
        jsProvider.addDevPackage('babel-plugin-syntax-jsx')
        jsProvider.addPackage('react')
        jsProvider.addPackage('react-dom')
        jsProvider.addPackage('react-redux')
        jsProvider.addPackage('redux')
    }
}

module.exports = ReactReduxEnv
