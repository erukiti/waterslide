'use strict'

class SassGenerator {
    constructor(operator) {
        this.operator = operator
    }

    static getInstaller(operator) {
        return new this(operator)
    }

    async install() {
        const jsGenerator = this.operator.getGenerator('js')
        jsGenerator.addDevPackage('css-loader')
        jsGenerator.addDevPackage('style-loader')

        const webpackGenerator = this.operator.getGenerator('webpack')
        webpackGenerator.addLoader('\\.css$', [
            { loader: 'style-loader' },
            { loader: 'css-loader' },
        ])
    }
}

module.exports = SassGenerator
