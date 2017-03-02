'use strict'

const Builder = require('../build/builder')

class BuildCli {
    constructor(cliUtils) {
        this.cliUtils = cliUtils
    }

    _config(args) {
        const opts = {isWatch: false, isBuild: false, isRun: false, isTest: false}
        if (args[0] === '--env' && args.length >= 2) {
            opts.env = args[1]
        }
        return opts
    }

    _run(opts) {
        const builder = new Builder(this.cliUtils)

        // assertFalse(opts.isBuild && opts.isRun)

        builder.run(opts)
    }

    build(args) {
        const opts = this._config(args)
        opts.isBuild = true
        opts.isTest = true
        this._run(opts)
    }

    watch(args) {
        const opts = this._config(args)
        opts.isWatch = true
        opts.isRun = true
        opts.isTest = true
        this._run(opts)
    }

    run(args) {
        const opts = this._config(args)
        opts.isRun = true
        opts.isTest = true
        this._run(opts)

    }

    test(args) {
        const opts = this._config(args)
        opts.isTest = true
        this._run(opts)
    }
}

module.exports = BuildCli