'use strict'

const { utils } = require('../../../waterslider')

class SassGenerator {
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
        const jsGenerator = await this.operator.getInstaller('js')
        jsGenerator.addDevPackage('css-loader')
        jsGenerator.addDevPackage('style-loader')
        jsGenerator.addDevPackage('url-loader')
        jsGenerator.addDevPackage('file-loader')

        const webpackGenerator = await this.operator.getInstaller('webpack')
        webpackGenerator.addLoader('\\.css$', [
            { loader: 'style-loader' },
            { loader: 'css-loader' },
        ])
        webpackGenerator.addLoader('\\.woff2?(\\?v=\\d+\\.\\d+\\.\\d+)?$', [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              mimetype: 'application/font-woff',
              name: '[name].[ext]'
            }
          }
        ])
        webpackGenerator.addLoader('\\.ttf(\\?v=\\d+\\.\\d+\\.\\d+)?$', [
            {
            loader: 'url-loader',
            options: {
              limit: 10000,
              mimetype: 'application/octet-stream',
              name: '[name].[ext]'
            }
          }
        ])
        webpackGenerator.addLoader('\\.eot(\\?v=\\d+\\.\\d+\\.\\d+)?$', [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]'
            }
          }
        ])
        webpackGenerator.addLoader('\\.svg(\\?v=\\d+\\.\\d+\\.\\d+)?$', [
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

module.exports = SassGenerator
