'use strict'

const fs = require('fs')
const path = require('path')

const {utils} = require('../../waterslide')


class TypescriptInstaller {
    constructor(operator) {
        this.operator = operator
    }

    static async getInstaller(operator) {
        if (utils.checkExistsNpm('ts-loader') ||
            operator.checkExists('tsconfig.json')
        ) {
            return null
        }
        return new this(operator)
    }

    async install() {
        const jsInstaller = await this.operator.getInstaller('js')
        jsInstaller.addDevPackage('ts-loader')
        jsInstaller.addDevPackage('typescript')

        const webpackInstaller = await this.operator.getInstaller('webpack')
        webpackInstaller.addLoader('\\.tsx?$', [
            {loader: 'babel-loader'},
            {loader: 'ts-loader'},
        ])

        const content = fs.readFileSync(path.join(__dirname, 'tsconfig.json')).toString()
        this.operator.postInstall(async () => {
            await this.operator.writeFile('tsconfig.json', content)
        })

    }

}

module.exports = TypescriptInstaller
