'use strict'

const fs = require('fs')
const path = require('path')

const {utils} = require('../../../waterslide')

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
        const testJs = fs.readFileSync(path.join(__dirname, 'sample.test.js'))

        const jsInstaller = await this.operator.getInstaller('js')
        jsInstaller.addDevPackage('ava')
        this.operator.addTester('ava')
        await this.operator.writeFile('src/sample.test.js', testJs)
    }
}

module.exports = AvaInstaller
