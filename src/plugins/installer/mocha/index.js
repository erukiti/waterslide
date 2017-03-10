'use strict'

const fs = require('fs')

const {utils} = require('../../../waterslider')

class MochaInstaller {
    constructor(operator) {
        this.operator = operator
    }

    static async getInstaller(operator) {
        if (utils.checkExistsNpm('mocha')
            || await this.operator.checkExists('test/mocha.opts')
            || await this.operator.checkExists('test/test-helper.js')
            || await this.operator.checkExists('test/test.js')
        ) {
            return null
        }

        return new this(operator)
    }

    async install() {
        const mochaOptsText = fs.readFileSync(require.resolve('./mocha.opts'))
        const testJs = fs.readFileSync(require.resolve('./sample.js'))

        await this.operator.getInstaller('power-assert')

        const jsInstaller = await this.operator.getInstaller('js')
        jsInstaller.addDevPackage('mocha')
        this.operator.addTester('mocha')

        await this.operator.writeFile('test/mocha.opts', mochaOptsText)
        await this.operator.writeFile('test/test.js', testJs)
    }
}

module.exports = MochaInstaller
