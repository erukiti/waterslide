'use strict'

const path = require('path')
const process = require('process')

const { getConfig } = require('../../../waterslider')

const config = getConfig()

class WebpackBuilder {
    constructor(builder) {
        this.builder = builder

        this.flags = {}

        this.isCompiled = false

        const webpackPath = path.join(process.cwd(), 'node_modules', 'webpack')
        this.webpack = require(webpackPath)
    }

    getTypes() {
        return ['node', 'web', 'electron', 'electron-renderer']
    }

    _createConfig(filename, target) {
        const { rules } = config.getLocal('webpack')
        console.dir(rules)
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
            ]
        }
    }

    _compiled(entry, err, stats) {
        if (err) {
            this.builder.error(err)
            return
        }

        if (stats.hasWarnings()) {
            stats.compilation.warnings.forEach(warning => {
                this.builder.warning(warning.details)
            })
        }
        if (stats.hasErrors()) {
            stats.compilation.errors.forEach(error => {
                this.builder.compileError(error.error)
            })
            return
        }

        this.flags[entry.path] = false
        if (Object.keys(this.flags).filter(key => this.flags[key]).length === 0) {
            this.isCompiled = true
            this.builder.compiled()
        }
    }

    _compile(isWatch, entry) {
        const compiler = this.webpack(this._createConfig(entry.path, entry.opts.type))
        if (isWatch) {
            compiler.watch({}, (err, stats) => this._compiled(entry, err, stats))
        } else {
            compiler.run((err, stats) => this._compiled(entry, err, stats))
        }
    }

    watch(entries) {
        entries.forEach(entry => {
            this.flags[entry.path] = true
            this._compile(true, entry)
        })
    }

    run(entries) {
        entries.forEach(entry => {
            this.builder.verbose(`webpack: ${entry.path} (${entry.opts.type})`)

            this.flags[entry.path] = true
            this._compile(false, entry)
        })
    }

}

module.exports = WebpackBuilder
