'use strict'

const { utils } = require('../../../waterslider')

class SassGenerator {
    constructor(operator) {
        this.operator = operator
    }

    static getInstaller(operator) {
        if (utils.checkExistsNpm('sass-loader')) {
            return
        }
        return new this(operator)
    }

    async install() {
        await this.operator.getInstaller('css')

        const jsGenerator = await this.operator.getInstaller('js')
        jsGenerator.addDevPackage('sass-loader')
        jsGenerator.addDevPackage('node-sass')

        const webpackGenerator = await this.operator.getInstaller('webpack')
        webpackGenerator.addLoader('\\.scss$', [
            { loader: 'style-loader' },
            { loader: 'css-loader' },
            { loader: 'sass-loader' },
        ])
    }
}

module.exports = SassGenerator
