'use strict'

class SassGenerator {
    constructor(operator) {
        this.operator = operator
    }

    process() {
        const jsGenerator = this.operator.getGenerator('js')
        jsGenerator.addDevPackage('css-loader')
        jsGenerator.addDevPackage('sass-loader')
        jsGenerator.addDevPackage('style-loader')
        jsGenerator.addDevPackage('node-sass')

        const webpackGenerator = this.operator.getGenerator('webpack')
        webpackGenerator.addLoader('\\.scss$', [
            { loader: 'style-loader' },
            { loader: 'css-loader' },
            { loader: 'sass-loader' },
        ])
    }
    output() {
        return []
    }
}

module.exports = SassGenerator
