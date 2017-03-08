'use strict'

const { utils } = require('../../../waterslider')

const testJs =
`const test = require('ava')
const a = 1
const b = 2
const c = 3

test('foo', t => t.true(a + b === c))
`

class AvaGenerator {
    constructor(operator) {
        this.operator = operator
    }

    static async getInstaller(operator) {
        if (utils.checkExistsNpm('ava')
            || await operator.checkExists('src/hoge.test.js')
        ) {
            return null
        }

        return new this(operator)
    }

    async install() {
        const jsGenerator = await this.operator.getInstaller('js')
        jsGenerator.addDevPackage('ava')
        this.operator.addTester('ava')
        await this.operator.writeFile('src/hoge.test.js', testJs)
    }
}

module.exports = AvaGenerator
