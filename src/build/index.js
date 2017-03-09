'use strict'

const {EventEmitter} = require('events')

const config = require('../config')
const Plugin = require('../plugin')
const plugin = new Plugin()

class Build {
    constructor(cliUtils, opts) {
        config.startLocal()

        this._createBuilder()
        this.cliUtils = cliUtils

        this.isBuild = opts.build
        this.isRun = opts.run
        this.isTest = opts.test
        this.isWatch = opts.watch
        this.env = opts.env || 'development'

        this.entries = config.getLocal('entries')
        this.testers = []
        this.builders = config.getLocal('builders').map(name => {
            const klass = plugin.requireBuilder(name)
            return new klass(this.builder)
        })
    }

    _createBuilder() {
        this.builder = {}
        this.builder.verbose = mesg => this.cliUtils.verbose(mesg, 1)
        this.builder.debug = mesg => this.cliUtils.debug(mesg, 1)
        this.builder.error = err => this.cliUtils.error(err, 1)
        this.builder.compileError = details => {
            this.cliUtils.message('compile error')
            this.cliUtils.error(details, 1)
        }
        this.builder.warning = details => {
            this.cliUtils.message('compile warning')
            this.cliUtils.error(details, 1)
        }
        this.builder.getDirectory = type => config.getLocal('directories')[type]
        this.builder.compiled = () => {
            if (this.builders.find(builder => !builder.isCompiled)) {
                return
            }

            this._test()

            if (this.isBuild || this.isRun) {
                // assert if (config.getLocal('finalizer')) {

                if (!config.getLocal('finalizer')) {
                    this.cliUtils.error('build complete.')
                    return
                }

                if (!this.finalizer) {
                    const klass = plugin.requireFinalizer(config.getLocal('finalizer'))
                    this.finalizer = new klass(this.builder)
                }
                // assertFalse(this.isBuild && this.isRun)

                if (this.isBuild) {
                    this.finalizer.build()
                } else if (this.isRun) {
                    this.finalizer.run()
                }
            }
        }

    }

    _test() {
        if (this.isTest && this.testers.length > 0) {
            this.testers.forEach(tester => {
                const result = tester.test()
                const className = tester.constructor.name
                if (result.isError) {
                    this.error(className)
                    if (result.stdout) {
                        this.error(result.stdout)
                    }
                    if (result.stderr) {
                        this.error(result.stderr)
                    }
                } else {
                    this.builder.verbose(`${className}: no error`)
                }
            })
        }
    }

    process() {
        if (this.isTest) {
            const testers = config.getLocal('testers') || []

            testers.forEach(name => {
                const klass = plugin.requireTester(name)
                const tester = new klass(this.builder)
                // if (this.isWatch) {
                //     tester.watch()
                // } else {
                    this.testers.push(tester)
                // }
            })

            if (!this.isRun && !this.isBuild) {
                this._test()
                return
            }
        }

        this.builders.forEach(builder => {
            const entries = this.entries.filter(entry =>
                entry.opts && builder.getTypes().includes(entry.opts.type)
            )

            if (this.isWatch) {
                builder.watch(entries)
            } else {
                builder.run(entries)
            }
        })
    }
}

module.exports = Build
