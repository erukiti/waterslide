'use strict'

class SassGenerator {
    constructor(operator) {
        this.operator = operator
    }

    async install() {
        const jsGenerator = this.operator.getGenerator('js')
        jsGenerator.addDevPackage('css-loader')
        jsGenerator.addDevPackage('sass-loader')
        jsGenerator.addDevPackage('style-loader')
        jsGenerator.addDevPackage('node-sass')
        jsGenerator.addDevPackage('url-loader')
        jsGenerator.addDevPackage('file-loader')

        const webpackGenerator = this.operator.getGenerator('webpack')
        webpackGenerator.addLoader('\\.scss$', [
            { loader: 'style-loader' },
            { loader: 'css-loader' },
            { loader: 'sass-loader' },
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
