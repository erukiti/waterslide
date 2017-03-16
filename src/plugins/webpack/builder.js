'use strict'

const path = require('path')
const process = require('process')

const {getConfig} = require('../../waterslide')

const config = getConfig()

class WebpackBuilder {
    constructor(builder) {
        this.builder = builder
        this.src = builder.getDirectory('source')
        this.dest = builder.getDirectory('destination')

        this.isCompiled = false

        const webpackPath = path.join(process.cwd(), 'node_modules', 'webpack')
        this.webpack = require(webpackPath)
    }

    getTypes() {
        return ['node', 'web', 'electron', 'electron-renderer']
    }

    _createConfig(filename, target) {
        const rules = config.getLocal('webpack').rules.map(rule => {
            return {test: new RegExp(rule.test), use: rule.use}
        })

        const reSrc = new RegExp(`^${this.src}/`)

        return {
            entry: `./${filename}`,
            output: {
                path: path.dirname(filename.replace(reSrc, `./${this.dest}/`)),
                filename: path.basename(filename.replace(/\.[a-z]+$/, '.js'))
            },
            resolve: {
                extensions: ['.js', '.jsx', 'ts', 'tsx']
            },
            module: {rules},
            devtool: '#source-map',
            target,
            plugins: [
                new this.webpack.DefinePlugin({
                    'process.env.NODE_ENV': JSON.stringify(this.builder.getEnv())
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

    _getCompiler(entries) {
        const conf = entries.map(entry => {
            this.builder.verbose(`webpack: ${entry.path} (${entry.opts.type})`)
            return this._createConfig(entry.path, entry.opts.type)
        })

        const fs = require('fs')
        fs.writeFileSync('webpack.config.json', JSON.stringify(conf[0], null, '  '))

        return this.webpack(conf)
    }

    watch(entries) {
        const compiler = this._getCompiler(entries)
        compiler.watch({}, (err, stats) => this._compiled(err, stats))
    }

    run(entries) {
        const compiler = this._getCompiler(entries)
        compiler.run((err, stats) => this._compiled(err, stats))
    }

}

module.exports = WebpackBuilder
