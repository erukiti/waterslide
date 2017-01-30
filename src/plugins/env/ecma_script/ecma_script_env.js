'use strict'

class EcmaScriptProvider {
    constructor(operator) {
        this.operator = operator
        operator.requireProvider('js')
        operator.requireProvider('babel')
    }
    process() {
        const jsProvider = this.operator.getProvider('js')
        jsProvider.addDevPackage('babel-core')
        jsProvider.addDevPackage('babel-loader')
        jsProvider.addDevPackage('babel-preset-es2016')
        this.operator.getProvider('babel').addPreset('es2016')
    }
}

module.exports = EcmaScriptProvider
