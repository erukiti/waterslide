'use strict'

const testJs =
`const test = require('ava')
const a = 1
const b = 2
const c = 3

test('foo', t => t.true(a + b === c))
`

class MochaGenerator {
    constructor(operator) {
        this.operator = operator
    }

    async install() {
        const jsGenerator = this.operator.getGenerator('js')
        jsGenerator.addDevPackage('ava')
        this.operator.addTester('ava')
        await this.operator.writeFile('src/hoge.test.js', testJs)
    }
}

module.exports = MochaGenerator
