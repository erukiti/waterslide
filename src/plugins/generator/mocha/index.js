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

    process() {
        this.operator.getGenerator('power-assert')

        const jsGenerator = this.operator.getGenerator('js')
        jsGenerator.addDevPackage('mocha')
    }
    output() {
        return [
            {path: 'test/mocha.opts', text: mochaOptsText},
            {path: 'test/test-helper.js', text: testHelperJs},
            {path: 'test/test.js', text: testJs}
        ]
    }
}

module.exports = MochaGenerator
