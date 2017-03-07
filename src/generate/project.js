'use strict'

const generateName = require('sillyname')
const process = require('process')
const path = require('path')
const fs = require('fs')

const Operator = require('../generate/operator')
const Plugin = require('../plugin')
const config = require('../config')

const setupProject = async (cliUtils, argv) => {
    if (argv.length === 0) {
        cliUtils.message('Usage: waterslider new <target> [projectName]')
        process.exit(1)
    }

    const projectType = argv[0]

    let projectDir = null
    let projectName = null

    if (argv.length > 1) {
        if (argv[1].indexOf('/') !== -1 || argv[1] === '.' || argv[1] === '..') {
            cliUtils.error('invalid projectDir.')
            process.exit(1)
        }

        projectDir = argv[1]
        projectName = projectDir
        fs.mkdirSync(projectDir)
        process.chdir(projectDir)
        config.startLocal()
    } else {
        projectName = generateName()
        projectDir = projectName.toLowerCase().replace(' ', '-')
        fs.mkdirSync(projectDir)
        process.chdir(projectDir)
        config.startLocal()
        config.writeLocal('sillyname', projectDir)
    }

    const operator = new Operator(cliUtils)
    operator.setProjectDir(projectDir)

    const plugin = new Plugin()
    const klass = plugin.requireProject(projectType)
    const obj = new klass(operator)
    await obj.install()

    let opts = {use: [], noUse: []}
    let envs
    if (opts.use.length > 0) {
        envs = opts.use
    } else {
        envs = ['document', 'editorconfig', 'git'].filter(value => !opts.noUse.includes(value))
    }

    envs.forEach(env => operator.getGenerator(env))

    await operator.install()

    cliUtils.message()
    cliUtils.message(`  project \x1b[32m${projectDir}\x1b[m was created.`)
    cliUtils.message(`  see. \x1b[36m${projectDir}/README.md\x1b[m`)

}

module.exports = setupProject
