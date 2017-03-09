'use strict'

const { utils } = require('../../../waterslider')

class PowerAssertInstaller {
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
        const babelInstaller = await this.operator.getInstaller('babel')
        babelInstaller.addPlugin('babel-plugin-espower')

        const jsInstaller = await this.operator.getInstaller('js')
        jsInstaller.addDevPackage('babel-plugin-espower')
        jsInstaller.addDevPackage('espower-babel')
        jsInstaller.addDevPackage('power-assert')
    }
}

module.exports = PowerAssertInstaller
