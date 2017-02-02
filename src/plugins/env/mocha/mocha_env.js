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

class MochaEnv {
    constructor(operator) {
        this.operator = operator
        this.operator.requireProvider('js')
        this.operator.requireEnv('power-assert')
    }

    process() {
        const jsProvider = this.operator.getProvider('js')
        jsProvider.addDevPackage('mocha')

        this.operator.addSource('test/mocha.opts', mochaOptsText)
        this.operator.addSource('test/test-helper.js', testHelperJs)
        this.operator.addSource('test/test.js', testJs)
    }
}

module.exports = MochaEnv
