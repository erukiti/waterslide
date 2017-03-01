'use strict'

class SassGenerator {
    constructor(operator) {
        this.operator = operator
    }

    process() {
        const jsGenerator = this.operator.getGenerator('js')
        jsGenerator.addDevPackage('css-loader')
        jsGenerator.addDevPackage('style-loader')

        const webpackGenerator = this.operator.getGenerator('webpack')
        webpackGenerator.addLoader('\\.css$', [
            { loader: 'style-loader' },
            { loader: 'css-loader' },
        ])
    }
    output() {
        return []
    }
}

module.exports = SassGenerator
