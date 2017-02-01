'use strict'

class WebpackEnv {
    constructor(operator) {
        this.operator = operator
        operator.requireEnv('js')
    }
    process() {
        const jsProvider = this.operator.getProvider('js')
        jsProvider.addDevPackage('webpack')
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
        if (this.operator.isRequiredProvider('babel')) {
            jsProvider.addDevPackage('babel-loader')
        }
    }
}

module.exports = WebpackEnv
