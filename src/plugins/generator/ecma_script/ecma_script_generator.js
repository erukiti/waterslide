'use strict'

class EcmaScriptGenerator {
    constructor(operator) {
        this.operator = operator
    }
    process() {
        const jsGenerator = this.operator.getGenerator('js')
        jsGenerator.addDevPackage('babel-core')
        jsGenerator.addDevPackage('babel-loader')
        jsGenerator.addDevPackage('babel-preset-es2016')
        this.operator.getGenerator('babel').addPreset('es2016')
    }
    output() {
        return []
    }
}

module.exports = EcmaScriptGenerator
