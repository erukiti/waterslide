'use strict'

const {utils} = require('../../../waterslide')

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
        babelInstaller.addPreset('babel-preset-power-assert')

        const jsInstaller = await this.operator.getInstaller('js')
        jsInstaller.addDevPackage('babel-preset-power-assert')
        jsInstaller.addDevPackage('power-assert')
    }
}

module.exports = PowerAssertInstaller
