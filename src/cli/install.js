'use strict'

const generateName = require('sillyname')
const process = require('process')
const path = require('path')
const fs = require('fs')

const Setup = require('../setup')
const Plugin = require('../plugin')
const config = require('../config')
const CliUtils = require('./utils')

const install = async (cliUtils, argv) => {
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

    for (let name of argv.pluginNames) {
        await setup.operator.getInstaller(name)
    }

    await setup.install().catch(e => console.dir(e))
}

const installCommand = () => {
    return {
        command: 'install [options] <pluginNames...>',
        describe: 'install to project',
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
            const cliUtils = new CliUtils({verbose: argv.verbose, debug: argv.debug})
            install(cliUtils, argv).catch(e => console.dir(e))
        }
    }
}

module.exports = installCommand