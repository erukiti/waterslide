const process = require('process')
const yargs = require('yargs')

const CliUtils = require('./utils')
const cliUtils = new CliUtils({verbose: true, debug: true})
const buildCommand = require('./build')

yargs
    .detectLocale(false)
    .command(require('./new')(cliUtils))
    .command(require('./install')(cliUtils))
    .command(require('./generate')(cliUtils))
    .command(buildCommand(cliUtils, 'run'))
    .command(buildCommand(cliUtils, 'build'))
    .command(buildCommand(cliUtils, 'watch'))
    .command(buildCommand(cliUtils, 'test'))
    .argv

// if (process.argv[2] === 'config') {
//     const config = new ConfigCli(cliUtils)
//     config.run(process.argv.slice(3))
// }
