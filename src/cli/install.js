'use strict'

const generateName = require('sillyname')
const process = require('process')
const path = require('path')
const fs = require('fs')

const Operator = require('../generate/operator')
const Plugin = require('../plugin')
const config = require('../config')

const install = async (cliUtils, argv) => {
    config.startLocal()

    const operator = new Operator(cliUtils)

    const parseOpt = name => {
        if (!argv[name]) {
            return []
        } else if (typeof argv[name] === 'string') {
            return [argv[name]]
        } else {
            return argv[name]
        }
    }

    operator.setOpt(parseOpt('opt'))
    operator.setNoOpt(parseOpt('noOpt'))

    for (let name of argv.pluginNames) {
        await operator.getInstaller(name)
    }

    await operator.install().catch(e => console.dir(e))
}

const installCommand = cliUtils => {
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
            install(cliUtils, argv).catch(e => console.dir(e))
        }
    }
}

module.exports = installCommand
