'use strict'

class WebpackGenerator {
    constructor(operator) {
        this.operator = operator
        this.rules = []
        operator.addBuilder('webpack')
    }
    addLoader(test, use) {
        this.rules.push({test, use})
    }

    process() {
        const jsGenerator = this.operator.getGenerator('js')
        jsGenerator.addDevPackage('webpack')
        // jsProvider.addDevPackage('file-loader')
        // jsProvider.addDevPackage('webpack-unassert-loader')
        // jsProvider.addDevPackage('url-loader')
        // jsProvider.addDevPackage('style-loader')
        // jsProvider.addDevPackage('strip-loader')
        // jsProvider.addDevPackage('sass-loader')
        // jsProvider.addDevPackage('file-loader')
        // jsProvider.addDevPackage('json-loader')
        // jsProvider.addDevPackage('')
        // jsProvider.addDevPackage('')
        jsGenerator.addDevPackage('babel-loader')
        this.operator.getConfig().writeLocal('webpack', { rules: this.rules })
    }

    output() {
        return []
    }
}

module.exports = WebpackGenerator
