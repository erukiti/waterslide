'use strict'

const { utils } = require('../../../waterslider')

class PowerAssertGenerator {
    constructor(operator) {
        this.operator = operator
    }

    static getInstaller(operator) {
        if (utils.checkExistsNpm('power-assert')) {
            return null
        }
        return new this(operator)
    }

    async install() {
        const babelGenerator = await this.operator.getInstaller('babel')
        babelGenerator.addPlugin('babel-plugin-espower')

        const jsGenerator = await this.operator.getInstaller('js')
        jsGenerator.addDevPackage('babel-plugin-espower')
        jsGenerator.addDevPackage('espower-babel')
        jsGenerator.addDevPackage('power-assert')
    }
}

module.exports = PowerAssertGenerator
