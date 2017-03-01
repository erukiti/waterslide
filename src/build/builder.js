'use strict'

const {EventEmitter} = require('events')

const config = require('../config')
const Plugin = require('../plugin')

class Builder {
    constructor(cliUtils) {
        config.startLocal()

        this.cliUtils = cliUtils
        this.plugin = new Plugin()
        this.entries = config.getLocal('entries')
        this.builders = []
        this.testers = []
        this.list = null
    }

    verbose(mesg) {
        this.cliUtils.verbose(mesg, 1)
    }

    debug(mesg) {
        this.cliUtils.debug(mesg, 1)
    }

    error(err) {
        this.cliUtils.error(err, 1)
    }

    compileError(details) {
        this.cliUtils.message('compile error')
        this.cliUtils.error(details)
    }
    warning(details) {
        this.cliUtils.message('compile warning')
        this.cliUtils.error(details)
    }

    _test() {
        // FIXME: 何回も呼ばれる問題?
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
                    this.verbose(`${className}: no error`)
                }
            })
        }
    }

    compiled() {
        if (this.builders.find(builder => !builder.isCompiled)) {
            return
        }

        this._test()

        if (this.isBuild || this.isRun) {
            // assert if (config.getLocal('finalizer')) {

            if (!config.getLocal('finalizer')) {
                this.cliUtils.error('build only.')
                return
            }

            const klass = this.plugin.requireFinalizer(config.getLocal('finalizer'))
            const finalizer = new klass(this)

            // assertFalse(this.isBuild && this.isRun)

            if (this.isBuild) {
                finalizer.build()
            } else if (this.isRun) {
                finalizer.run()
            }
        }
    }

    run(opts) {
        this.isBuild = opts.isBuild
        this.isRun = opts.isRun
        this.isTest = opts.isTest
        this.isWatch = opts.isWatch

        const testers = config.getLocal('testers') || []

        testers.forEach(name => {
            const klass = this.plugin.requireTester(name)
            this.testers.push(new klass(this))
        })

        if (!this.isRun && !this.isBuild) {
            this._test()
            return
        }

        const builders = opts.builders || config.getLocal('builders')

        builders.forEach(name => {
            const klass = this.plugin.requireBuilder(name)
            this.builders.push(new klass(this))
        })

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

module.exports = Builder
