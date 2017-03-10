'use strict'

const Build = require('../build')
const CliUtils = require('./utils')

const buildCommand = type => {
    const defaults = {
        test: {watch: false, build: false, run: false, test: true},
        run: {watch: false, build: false, run: true, test: true},
        build: {watch: false, build: true, run: false, test: true},
        watch: {watch: true, build: false, run: true, test: true},
    }

    return {
        command: `${type} [options]`,
        describe: `${type} application`,
        builder: yargs => {
            yargs.options({
                'env': {type: 'string', describe: 'environment'},
                'watch': {type: 'boolean', default: defaults[type].watch},
                'run': {type: 'boolean', default: defaults[type].run},
                'build': {type: 'boolean', default: defaults[type].build},
                'test': {type: 'boolean', default: defaults[type].test},
            })
        },
        handler: argv => {
            const cliUtils = new CliUtils({verbose: argv.verbose, debug: argv.debug})

            const build = new Build(cliUtils, argv)
            build.process()
        }
    }
}

module.exports = buildCommand
