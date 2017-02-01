'use strict'

const generateName = require('sillyname')

const Operator = require('./operator')
const Plugin = require('../plugin')
const config = require('../config')

class NewProject{
    constructor() {
        this.plugin = new Plugin()
        this.objs = []
        this.target = null
    }

    run(argv) {
        const generateProjectDirName = () => {
            this.sillyname = generateName().toLowerCase().replace(' ', '-')
            return this.sillyname
        }

        if (argv.length === 0) {
            console.error('waterslider new <target> [projectName]')
            return
        }

        const target = argv[0]

        const projectDir = argv.length > 1 ? argv[1] : generateProjectDirName()

        const operator = new Operator(projectDir)

        const envs = ['git', 'ecma_script', 'react_redux', 'webpack']

        operator.setTarget(target)
        envs.forEach(env => operator.requireEnv(env))

        // operator.preprocess()
        operator.process()
        operator.output()

        config.startLocal()
        if (this.sillyname) {
            config.writeLocal('sillyname', this.sillyname)
        }
        config.writeLocal('directories', operator.getDirectories())
        config.writeLocal('env', envs)
        config.writeLocal('entries', operator.getEntries())
    }
}

module.exports = NewProject

