'use strict'

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

    async install() {
        this.operator.getGenerator('power-assert')

        const jsGenerator = this.operator.getGenerator('js')
        jsGenerator.addDevPackage('mocha')
        this.operator.addTester('mocha')

        await this.operator.writeFile('test/mocha.opts', mochaOptsText)
        await this.operator.writeFile('test/test-helper.js', testHelperJs)
        await this.operator.writeFile('test/test.js', testJs)
        ]
    }
}

module.exports = MochaGenerator
