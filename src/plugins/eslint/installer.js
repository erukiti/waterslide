'use strict'

const fs = require('fs')
const path = require('path')

const {utils} = require('../../waterslide')

class EslintInstaller {
    constructor(operator) {
        this.operator = operator
    }

    static async getInstaller(operator) {
        if (utils.checkExistsNpm('eslint')
            || await operator.checkExists('.eslintignore')
            || await operator.checkExists('.eslintrc.json')
        ) {
            return null
        }

        return new this(operator)
    }

    async install() {
        const eslintignore = fs.readFileSync(path.join(__dirname, 'eslintignore'))
        const eslintrc = fs.readFileSync(path.join(__dirname, 'eslintrc.json'))

        const jsInstaller = await this.operator.getInstaller('js')
        jsInstaller.addDevPackage('eslint')
        jsInstaller.addDevPackage('babel-eslint')
        this.operator.addTester('eslint', './node_modules/.bin/eslint --color --max-warnings 0 src')
        await this.operator.writeFile('.eslintignore', eslintignore)
        await this.operator.writeFile('.eslintrc.json', eslintrc)
    }
}

module.exports = EslintInstaller
