'use strict'

class PowerAssertEnv {
    constructor(operator) {
        this.operator = operator
        this.operator.requireProvider('js')
        this.operator.requireProvider('babel')
    }

    process() {
        const babelProvider = this.operator.getProvider('babel')
        babelProvider.addPlugin('babel-plugin-espower')

        const jsProvider = this.operator.getProvider('js')
        jsProvider.addDevPackage('babel-plugin-espower')
        jsProvider.addDevPackage('espower-babel')
        jsProvider.addDevPackage('power-assert')
    }
}

module.exports = PowerAssertEnv
