'use strict'

const path = require('path')
const process = require('process')

const { getConfig } = require('../../../waterslider')

const config = getConfig()

class WebpackBuilder {
    constructor(builder) {
        this.builder = builder

        this.isCompiled = false

        const webpackPath = path.join(process.cwd(), 'node_modules', 'webpack')
        this.webpack = require(webpackPath)
    }

    getTypes() {
        return ['node', 'web', 'electron', 'electron-renderer']
    }

    _createConfig(filename, target) {
        const rules = config.getLocal('webpack').rules.map(rule => {
            return { test: new RegExp(rule.test), use: rule.use }
        })
        return {
            entry: `./${filename}`,
            output: {
                path: path.dirname(filename.replace(/^src\//, './build/')),
                filename: path.basename(filename.replace(/\.[a-z]+$/, '.js'))
            },
            resolve: {
                extensions: ['.js', '.jsx']
            },
            module: { rules },
            devtool: '#source-map',
            target,
            plugins: [
                new this.webpack.DefinePlugin({
                    'process.env.NODE_ENV': JSON.stringify('production')
                })
            ],
            stats: {
                warnings: true,
                errors: true,
                errorDetails: true,
            }
        }
    }

    _compiled(err, stats) {
        if (err) {
            console.dir(err)
            return
        }

        // see. https://webpack.js.org/api/node/#error-handling
        console.log(stats.toString({colors: true}))
        if (stats.hasErrors()) {
            return
        }

        this.isCompiled = true
        this.builder.compiled()
    }

    _compile(isWatch, entry) {
        const compiler = this.webpack(this._createConfig(entry.path, entry.opts.type))
        if (isWatch) {
            compiler.watch({}, (err, stats) => this._compiled(err, stats))
        } else {
            compiler.run((err, stats) => this._compiled(err, stats))
        }
    }

    watch(entries) {
        entries.forEach(entry => {
            this._compile(true, entry)
        })
    }

    run(entries) {
        const conf = entries.map(entry => {
            this.builder.verbose(`webpack: ${entry.path} (${entry.opts.type})`)
            return this._createConfig(entry.path, entry.opts.type)
        })

        const compiler = this.webpack(conf)
        compiler.run((err, stats) => this._compiled(err, stats))
    }

}

module.exports = WebpackBuilder
