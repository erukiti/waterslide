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

    preprocess() {

    }

    process() {
        this.objs.forEach(obj => obj.process())
    }

    requireEnv(envs) {
        envs.forEach(name => {
            const klass = this.plugin.requireEnv(name)
            this.objs.push(new klass(this.operator))
        })
    }

    setTarget(name) {
        // ここらへんの仕組み Plugin に移動する
        const klass = this.plugin.requireTarget(name)
        this.objs.push(new klass(this.operator))
        this.target = name
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

        this.operator = new Operator(projectDir)

        const envs = ['js', 'git', 'ecma_script', 'react_redux', 'webpack']

        this.setTarget(target)
        this.requireEnv(envs)

        this.preprocess()
        this.process()
        this.operator.output()

        config.startLocal()
        if (this.sillyname) {
            config.writeLocal('sillyname', this.sillyname)
        }
        config.writeLocal('directories', this.operator.getDirectories())
        config.writeLocal('env', envs)
        config.writeLocal('entries', this.operator.getEntries())
    }
}

module.exports = NewProject

