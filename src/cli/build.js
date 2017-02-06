'use strict'

const Builder = require('../build/builder')

class BuildCli {
    constructor(cliUtils) {
        this.cliUtils = cliUtils
    }

    _run(opts) {
        const builder = new Builder(this.cliUtils)

        // assertFalse(opts.isBuild && opts.isRun)

        builder.run(opts)
    }

    build(args) {
        this._run({isWatch: false, isBuild: true, isRun: false, isTest: true})
    }

    watch(args) {
        this._run({isWatch: true, isBuild: false, isRun: true, isTest: true})

    }

    run(args) {
        this._run({isWatch: false, isBuild: true, isRun: ftrue, isTest: true})

    }

    test(args) {
        this._run({isWatch: false, isBuild: false, isRun: false, isTest: true})

    }
}

module.exports = BuildCli