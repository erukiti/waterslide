'use strict'

const generateName = require('sillyname')
const process = require('process')

class ProjectGenerator {
    constructor(operator) {
        this.operator = operator
    }

    static getPurpose() {
        return 'generate project.'
    }

    fromCli(argv) {
        const generateProjectDirName = () => {
            this.sillyname = generateName().toLowerCase().replace(' ', '-')
            return this.sillyname
        }

        if (argv.length === 0) {
            this.operator.message('Usage: waterslider new <target> [projectName]')
            // FIXME: waterslider new を決め打ちしてるのをなんとかする

            process.exit(1)
        }

        const target = argv[0]

        const projectDir = argv.length > 1 ? argv[1] : generateProjectDirName()
        this.operator.setProjectDir(projectDir)
        this.operator.setOverwrite(false)

        const envs = ['document', 'js', 'babel', 'webpack', 'power-assert', 'mocha', 'eslint', 'editorconfig', 'git', 'react-redux']
        this.operator.setTarget(target)
        envs.forEach(env => this.operator.getGenerator(env))

        if (this.sillyname) {
            this.operator.setSillyname(this.sillyname)
        }
    }

    process() {

    }
    output() {
        return []
    }
}

module.exports = ProjectGenerator
