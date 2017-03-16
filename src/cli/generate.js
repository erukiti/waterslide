'use strict'

const process = require('process')
const path = require('path')
const fs = require('fs')

const Setup = require('../setup')
const Plugin = require('../plugin')
const config = require('../config')
const CliUtils = require('./utils')

const generate = async (cliUtils, argv) => {
    config.startLocal()

    const setup = new Setup(cliUtils)

    const parseOpt = name => {
        if (!argv[name]) {
            return []
        } else if (typeof argv[name] === 'string') {
            return [argv[name]]
        } else {
            return argv[name]
        }
    }

    setup.setOpt(parseOpt('opt'))
    setup.setNoOpt(parseOpt('noOpt'))

    await setup.operator.getGenerator(argv.generatorName).generate(argv.args[0])

    await setup.install().catch(e => console.dir(e))
    cliUtils.message('generate finish.')
}

const generateCommand = () => {
    return {
        command: 'generate [options] <generatorName> <args...>',
        describe: 'generate file',
        builder: yargs => {
            yargs
                .option('opt', {
                    describe: 'set option',
                    type: 'string'
                })
                .option('no-opt', {
                    describe: 'disable option',
                    type: 'string'
                })
        },
        handler: argv => {
            if (!config.isExists()) {
                console.log('If you want to generate file, you need to setup waterslide')
                process.exit(1)
            }

            const cliUtils = new CliUtils({verbose: argv.verbose, debug: argv.debug})
            generate(cliUtils, argv).catch(e => console.dir(e))
        }
    }
}

module.exports = generateCommand
