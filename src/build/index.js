'use strict'
// @flow

const {EventEmitter} = require('events')

const config = require('../config')
const Plugin = require('../plugin')
const plugin = new Plugin()

const Builder = require('./builder')
const CliUtils = require('../cli/utils')

import type {Entry} from '../config'

export interface Tester {
    test(): Object
}

export interface Builder2 {
    constructor(builder: Builder): Builder2,
    getTypes(): Array<string>,
    run(entries: Array<Entry>): any,
    watch(entries: Array<Entry>): any,
    isCompiled: boolean
}

export interface Finalizer {
    constructor(builder: Builder): Builder2,
    run(): any,
    build(): any
}

class Build {
    cliUtils: CliUtils
    builder: Builder
    isBuild: boolean
    isRun: boolean
    isTest: boolean
    isWatch: boolean
    env: string
    entries: Array<Entry>
    testers: Array<Tester>
    builders: Array<Builder2>
    finalizer: Finalizer

    /**
     *
     * @param {CliUtis} cliUtils
     * @param {*} opts
     */
    constructor(cliUtils: CliUtils, opts: Object) {
        config.startLocal()

        this.builder = new Builder(this)
        this.cliUtils = cliUtils

        this.isBuild = opts.build
        this.isRun = opts.run
        this.isTest = opts.test
        this.isWatch = opts.watch
        this.env = opts.env || 'development'

        this.entries = config.getLocal('entries')
        this.testers = []
        this.builders = config.getLocal('builders').map(name => {
            const Klass = plugin.requireBuilder(name)
            return new Klass(this.builder)
        })
    }

    _compiled() {
        if (this.builders.find(builder => !builder.isCompiled)) {
            return
        }

        this._test()

        if (this.isBuild || this.isRun) {
            // assert if (config.getLocal('finalizer')) {

            if (!config.getLocal('finalizer')) {
                this.cliUtils.message('build complete.')
                return
            }

            if (!this.finalizer) {
                const Klass = plugin.requireFinalizer(config.getLocal('finalizer'))
                this.finalizer = new Klass(this.builder)
            }
            // assertFalse(this.isBuild && this.isRun)

            if (this.isBuild) {
                this.finalizer.build()
            } else if (this.isRun) {
                this.cliUtils.message('run application')
                this.finalizer.run()
            }
        }
    }

    _test() {
        if (this.isTest && this.testers.length > 0) {
            this.testers.forEach(tester => {
                const result = tester.test()
                const className = tester.constructor.name
                if (result.isError) {
                    this.builder.error(className)
                    if (result.stdout) {
                        this.builder.error(result.stdout)
                    }
                    if (result.stderr) {
                        this.builder.error(result.stderr)
                    }
                } else {
                    this.builder.message(`${className}: no error`)
                }
            })
        }
    }

    process() {
        if (this.isTest) {
            const testers = config.getLocal('testers') || []

            testers.forEach(name => {
                const Klass = plugin.requireTester(name)
                const tester = new Klass(this.builder)
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
            const entries = this.entries.filter(entry => {
                if (entry.opts && entry.opts.type) {
                    const opts = entry.opts     // Flow work around
                    return builder.getTypes().includes(opts.type)
                } else {
                    return false
                }
            })

            if (this.isWatch) {
                builder.watch(entries)
            } else {
                builder.run(entries)
            }
        })
    }
}

module.exports = Build
