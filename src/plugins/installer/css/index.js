'use strict'

const fs = require('fs')
const path = require('path')

const {utils} = require('../../../waterslide')

class CssInstaller {
    constructor(operator) {
        this.operator = operator
    }

    static getInstaller(operator) {
        if (utils.checkExistsNpm('css-loader')) {
            return null
        }
        return new this(operator)
    }

    async install() {
        const helpText = fs.readFileSync(path.join(__dirname, 'help.txt'))
        this.operator.setInfo('css', helpText)

        const jsInstaller = await this.operator.getInstaller('js')
        jsInstaller.addDevPackage('css-loader')
        jsInstaller.addDevPackage('style-loader')
        jsInstaller.addDevPackage('url-loader')
        jsInstaller.addDevPackage('file-loader')

        const webpackInstaller = await this.operator.getInstaller('webpack')
        webpackInstaller.addLoader('\\.css$', [
            {loader: 'style-loader'},
            {loader: 'css-loader'},
        ])
        webpackInstaller.addLoader('\\.woff2?(\\?v=\\d+\\.\\d+\\.\\d+)?$', [
            {
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    mimetype: 'application/font-woff',
                    name: '[name].[ext]'
                }
            }
        ])
        webpackInstaller.addLoader('\\.ttf(\\?v=\\d+\\.\\d+\\.\\d+)?$', [
            {
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    mimetype: 'application/octet-stream',
                    name: '[name].[ext]'
                }
            }
        ])
        webpackInstaller.addLoader('\\.eot(\\?v=\\d+\\.\\d+\\.\\d+)?$', [
            {
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]'
                }
            }
        ])
        webpackInstaller.addLoader('\\.svg(\\?v=\\d+\\.\\d+\\.\\d+)?$', [
            {
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    mimetype: 'image/svg+xml',
                    name: '[name].[ext]'
                }
            }
        ])
    }
}

module.exports = CssInstaller
