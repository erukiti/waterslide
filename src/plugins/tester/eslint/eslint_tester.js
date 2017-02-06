'use strict'

const { utils } = require('../../../waterslider')

class EslintTester {
    constructor () {
    }

    test() {
        return utils.execSync('./node_modules/.bin/eslint --color --max-warnings 0 src')
    }

}

module.exports = EslintTester
