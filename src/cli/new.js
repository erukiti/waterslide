'use strict'

const generateName = require('sillyname')
const process = require('process')
const path = require('path')
const fs = require('fs')

const Setup = require('../setup')
const Plugin = require('../plugin')
const config = require('../config')
const CliUtils = require('./utils')

const setupProject = async (cliUtils, argv) => {
    const projectType = argv.projectType

    cliUtils.message(`create a new project of ${projectType}`)

    let projectDir = null
    let projectName = null

    if (argv.projectDir) {
        projectDir = argv.projectDir
        if (projectDir.indexOf('/') !== -1 || projectDir === '.' || projectDir === '..') {
            cliUtils.error('invalid projectDir.')
            process.exit(1)
        }

        projectName = projectDir
        fs.mkdirSync(projectDir)
        process.chdir(projectDir)
        config.startLocal()
    } else {
        projectName = generateName()
        projectDir = projectName.toLowerCase().replace(' ', '-')
        fs.mkdirSync(projectDir)
        cliUtils.message(`directory \x1b[32m${projectDir}\x1b[m was created.`)
        process.chdir(projectDir)
        config.startLocal()
        config.writeLocal('sillyname', projectDir)
    }

    const setup = new Setup(cliUtils)
    setup.setProjectDir(projectDir)

    const parseOpt = name => {
        if (!argv[name]) {
            return []
        } else if (typeof argv[name] === 'string') {
            return [argv[name]]
        } else {
            return argv[name]
        }
    }

    const noUse = parseOpt('noUse')
    setup.setNoUse(noUse)

    setup.setOpt(parseOpt('opt'))
    setup.setNoOpt(parseOpt('noOpt'))

    const envs = parseOpt('use').filter(v => !noUse.includes(v))

    if (!setup.operator.getNoOpt().includes('recommend')) {
        ['editorconfig', 'git'].filter(v => !noUse.includes(v)).forEach(v =>{
            envs.push(v)
        })
    }

    const plugin = new Plugin()
    const klass = plugin.requireProject(projectType)
    const obj = new klass(setup.operator)

    for (let name of envs) {
        await setup.operator.getInstaller(name)
    }

    await obj.install()

    await setup.install().catch(e => console.dir(e))

    cliUtils.message()
    cliUtils.message(`  project \x1b[32m${projectDir}\x1b[m was created.`)
    cliUtils.message(`  see. \x1b[36m${projectDir}/README.md\x1b[m`)

}

const newCommand = () => {
    return {
        command: 'new <projectType> [options] [projectDir]',
        describe: 'create a new project',
        builder: yargs => {
            yargs
                .option('use', {
                    describe: 'use install plugin',
                    type: 'string'
                })
                .option('no-use', {
                    describe: 'disable install plugin',
                    type: 'string'                    
                })
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
            setupProject(cliUtils, argv).catch(e => console.dir(e))
        }
    }
}

module.exports = newCommand
