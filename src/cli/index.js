'use strict'

const process = require('process')
const yargs = require('yargs')

const cli = () => {
    yargs
        .detectLocale(false)
        .version()
        .help()
        .usage('Usage: ws [options...] <subcommand> [args...]')
        .option('verbose', {
            default: false,
            type: 'boolean',
        })
        .option('debug', {
            default: false,
            type: 'boolean',
        })
        .command(require('./new')())
        .command(require('./install')())
        .command(require('./generate')())
        .command(require('./config')())
        .demandCommand(1, 'Need subcommand.')
        .argv
}

module.exports = cli
