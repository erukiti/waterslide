'use strict'

class PowerAssertGenerator {
    constructor(operator) {
        this.operator = operator
    }

    static getInstaller(operator) {
        return new this(operator)
    }

    async install() {
        const babelGenerator = this.operator.getGenerator('babel')
        babelGenerator.addPlugin('babel-plugin-espower')

        const jsGenerator = this.operator.getGenerator('js')
        jsGenerator.addDevPackage('babel-plugin-espower')
        jsGenerator.addDevPackage('espower-babel')
        jsGenerator.addDevPackage('power-assert')
    }
}

module.exports = PowerAssertGenerator
