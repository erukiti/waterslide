const process = require('process')

const CliUtils = require('./utils')

const ConfigCli = require('./config')
const BuildCli = require('./build')

const setupProject = require('../generate/project')

const cliUtils = new CliUtils({verbose: true, debug: true})

if (process.argv.length <= 2) {
    console.error('need args')
    process.exit(1)
}

if (process.argv[2] === 'new') {
    setupProject(cliUtils, process.argv.slice(3))
}

if (process.argv[2] === 'generate') {
    // const generate = new GenerateCli(cliUtils)
    // generate.run(process.argv.slice(3))
}

if (process.argv[2] === 'config') {
    const config = new ConfigCli(cliUtils)
    config.run(process.argv.slice(3))
}

if (process.argv[2] === 'watch') {
    const buildCli = new BuildCli(cliUtils)
    buildCli.watch(process.argv.slice(3))
}

if (process.argv[2] === 'build') {
    const buildCli = new BuildCli(cliUtils)
    buildCli.build(process.argv.slice(3))
}

if (process.argv[2] === 'run') {
    const buildCli = new BuildCli(cliUtils)
    buildCli.run(process.argv.slice(3))
}

if (process.argv[2] === 'test') {
    const buildCli = new BuildCli(cliUtils)
    buildCli.test(process.argv.slice(3))
}
