'use strict'

const { utils } = require('../../../waterslider')

const fs = require('fs')

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
        const eslintignore = fs.readFileSync(require.resolve('./.eslintignore'))
        const eslintrc = fs.readFileSync(require.resolve('./.eslintrc.json'))

        const jsInstaller = await this.operator.getInstaller('js')
        jsInstaller.addDevPackage('eslint')
        jsInstaller.addDevPackage('babel-eslint')
        this.operator.addTester('eslint')

        await this.operator.writeFile('.eslintignore', eslintignore)
        await this.operator.writeFile('.eslintrc.json', eslintrc)
    }
}

module.exports = EslintInstaller
