'use strict'

const path = require('path')
const process = require('process')

const config = {
    entry: './src/renderer/index.js',
    output: {
        path: './build/renderer/',
        filename: 'index.js'
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    module: {
        loaders: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel?sourceMap'
        }]
    },
    devtool: '#source-map',
    target: 'electron'
}

class WebpackBuilder {
    constructor(ev) {
        this.ev = ev

        const webpackPath = path.join(process.cwd(), 'node_modules', 'webpack')
        this.webpack = require(webpackPath)
    }

    watch(opts) {
        const compiler = this.webpack(config)
        compiler.watch({}, (err, stats) => {
            if (err) {
                this.ev.emit('error', err)
                return
            }

            if (stats.hasWarnings()) {
                stats.compiler.warnings.forEach(warning => {
                    this.ev.emit('warning', warning)
                })
            }
            if (stats.hasErrors()) {
                stats.compilation.errors.forEach(error => {
                    this.ev.emit('compile error', {
                        string: error.error.toString(),
                        codeFrame: error.error.codeFrame
                    })
                })
                return
            }

            this.ev.emit('compiled', this)
        })
    }
}

module.exports = WebpackBuilder
