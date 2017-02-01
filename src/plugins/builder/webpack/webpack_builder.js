'use strict'

const path = require('path')
const process = require('process')

const createConfig = filename => {
    return {
        entry: `./${filename}`,
        output: {
            path: path.dirname(filename.replace(/^src\//, './build/')),
            filename: path.basename(filename.replace(/\.[a-z]+$/, '.js'))
        },
        resolve: {
            extensions: ['.js', '.jsx']
        },
        module: {
            loaders: [{
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader?sourceMap'
            }]
        },
        devtool: '#source-map',
        target: 'electron-renderer'
    }
}

class WebpackBuilder {
    constructor(ev) {
        this.ev = ev

        this.flags = {}

        const webpackPath = path.join(process.cwd(), 'node_modules', 'webpack')
        this.webpack = require(webpackPath)
    }

    getTypes() {
        return ['node', 'browser', 'electron', 'electron-renderer']
    }

    _compile(entry) {
        const compiler = this.webpack(createConfig(entry.path))
        this.flags[entry.path] = true
        compiler.watch({}, (err, stats) => {
            if (err) {
                this.ev.emit('error', err)
                return
            }

            if (stats.hasWarnings()) {
                stats.compilation.warnings.forEach(warning => {
                    console.dir(Object.keys(warning))
                    console.log(warning.details)
                    // this.ev.emit('warning', warning)
                })
            }
            if (stats.hasErrors()) {
                stats.compilation.errors.forEach(error => {
                    this.ev.emit('compile error', error.error.error)
                })
                return
            }

            this.flags[entry.path] = false
            if (Object.keys(this.flags).filter(key => {
                return this.flags[key]
            }).length === 0) {
                this.ev.emit('compiled', 'webpack')
            }

        })
    }

    watch(entries) {
        entries.forEach(entry => this._compile(entry))
    }
}

module.exports = WebpackBuilder
