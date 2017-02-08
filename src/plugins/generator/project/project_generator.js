'use strict'

const generateName = require('sillyname')
const process = require('process')

class ProjectGenerator {
    constructor(operator) {
        this.operator = operator
    }

    static getUsage() {
        return `
create new project.
  waterslider new <target> [projectName]`
    }

    fromCli(argv, opts) {
        const generateProjectDirName = () => {
            return generateName().toLowerCase().replace(' ', '-')
        }

        if (argv.length === 0) {
            this.operator.message('Usage: waterslider new <target> [projectName]')
            // FIXME: waterslider new を決め打ちしてるのをなんとかする

            process.exit(1)
        }

        const target = argv[0]

        let sillyname = null
        let projectDir = null

        if (argv.length > 1) {
            projectDir = argv[1]
        } else {
            projectDir = sillyname = generateProjectDirName()
        }

        this.operator.setProjectDir(projectDir)
        this.operator.setOverwrite(false)

        this.operator.setOpts(opts.opt)

        let envs
        if (opts.use.length > 0) {
            envs = opts.use
        } else {
            envs = ['document', 'js', 'babel', 'webpack', 'power-assert', 'mocha', 'eslint', 'editorconfig', 'git', 'react-redux'].filter(value => !opts.noUse.includes(value))
        }

        this.operator.setTarget(target)

        envs.forEach(env => this.operator.getGenerator(env))

        if (sillyname) {
            this.operator.setSillyname(sillyname)
        }
    }

    process() {

    }
    output() {
        return []
    }
}

module.exports = ProjectGenerator
