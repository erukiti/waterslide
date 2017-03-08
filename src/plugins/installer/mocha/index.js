'use strict'

const { utils } = require('../../../waterslider')

const mochaOptsText =
`--compilers js:espower-babel/guess
--ui bdd
--reporter dot
--timeout 5000
--recursive
`

const testHelperJs = "global.assert = require('power-assert')\n"

const testJs =
`describe('test', () => {
    it('hoge', () => {
        assert(1 + 1 === 2)
    })
})
`

class MochaGenerator {
    constructor(operator) {
        this.operator = operator
    }

    static async getInstaller(operator) {
        if (utils.checkExistsNpm('mocha')
            || await this.operator.checkExists('test/mocha.opts')
            || await this.operator.checkExists('test/test-helper.js')
            || await this.operator.checkExists('test/test.js')
        )

        return new this(operator)
    }

    async install() {
        this.operator.getInstaller('power-assert')

        const jsGenerator = await this.operator.getInstaller('js')
        jsGenerator.addDevPackage('mocha')
        this.operator.addTester('mocha')

        await this.operator.writeFile('test/mocha.opts', mochaOptsText)
        await this.operator.writeFile('test/test-helper.js', testHelperJs)
        await this.operator.writeFile('test/test.js', testJs)
        ]
    }
}

module.exports = MochaGenerator
