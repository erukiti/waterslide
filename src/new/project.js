'use strict'

const generateName = require('sillyname')

const Operator = require('./operator')
const Plugin = require('../plugin')

class NewProject{
    constructor() {
        this.plugin = new Plugin()
        this.objs = []
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
        const klass = this.plugin.requireTarget(name)
        this.objs.push(new klass(this.operator))
    }

    run(argv) {
        const generateProjectDirName = () => {
            return generateName().toLowerCase().replace(' ', '-')
        }

        const projectDir = argv.length > 0 ? argv[0] : generateProjectDirName()

        this.operator = new Operator(projectDir)

        const envs = ['js', 'git', 'ecma_script', 'react_redux']
        const target = 'electron'

        this.setTarget(target)
        this.requireEnv(envs)

        this.preprocess()
        this.process()
        this.operator.output()

    }
}

module.exports = NewProject

