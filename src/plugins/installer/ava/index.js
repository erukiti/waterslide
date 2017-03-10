'use strict'

const {utils} = require('../../../waterslider')

const fs = require('fs')

class AvaInstaller {
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
        const testJs = fs.readFileSync(require.resolve('./sample.test.js'))

        const jsInstaller = await this.operator.getInstaller('js')
        jsInstaller.addDevPackage('ava')
        this.operator.addTester('ava')
        await this.operator.writeFile('src/sample.test.js', testJs)
    }
}

module.exports = AvaInstaller
