'use strict'

const Builder = require('../build/builder')

class BuildCli {
    constructor(cliUtils) {
        this.cliUtils = cliUtils
    }

    _config(args) {
        const opts = {isWatch: false, isBuild: false, isRun: false, isTest: false}
        if (args.env) {
            opts.env = args.env
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

const buildCommand = (cliUtils, type) => {
    return {
        command: `${type} [options]`,
        describe: `${type} application`,
        builder: yargs => {
            yargs
                .option('env', {
                    describe: 'environment',
                    type: 'string'
                })
        },
        handler: argv => {
            const buildCli = new BuildCli(cliUtils)
            buildCli[type](argv)
        }
    }
}

module.exports = buildCommand
