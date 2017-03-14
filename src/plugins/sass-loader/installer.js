'use strict'

const {utils} = require('../../waterslide')

class SassloaderInstaller {
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

        const jsInstaller = await this.operator.getInstaller('js')
        jsInstaller.addDevPackage('sass-loader')
        jsInstaller.addDevPackage('node-sass')

        const webpackInstaller = await this.operator.getInstaller('webpack')
        webpackInstaller.addLoader('\\.scss$', [
            {loader: 'style-loader'},
            {loader: 'css-loader'},
            {loader: 'sass-loader'},
        ])
    }
}

module.exports = SassloaderInstaller
