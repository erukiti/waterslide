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

        const envs = ['ecma_script', 'webpack', 'power-assert', 'mocha', 'eslint', 'editorconfig', 'js', 'babel', 'git']
        operator.replaceGenerator('browser','react_redux')
        operator.setTarget(target)
        envs.forEach(env => operator.getGenerator(env))

        if (this.sillyname) {
            operator.setSillyname(this.sillyname)
        }
        operator.output()
    }
}

module.exports = NewProject

