'use strict'

const {config} = require('../../../waterslider')

class JsGenerator {
    constructor(operator) {
        this.operator = operator

        this.packages = []
        this.devPackages = []
        this.main = ''
    }

    addPackage(name) {
        this.packages.push(name)
    }

    addDevPackage(name){
        this.devPackages.push(name)
    }

    setMain(name) {
        this.main = name
    }

    process() {

    }

    output() {
        const getProjectName = () => this.operator.getProjectDir()
        // FIXME: project dir -> project name

        const main = this.main
        const name = getProjectName()
        const version = '1.0.0'
        const description = ''
        const author = config.get('author')
        const license = config.get('license')
        const keywords = []

        const scripts = {
            start: 'waterslider watch',
            build: 'waterslider build',
            test: 'waterslider test'
        }

        this.values = {
            main,
            name,
            version,
            description,
            author,
            license,
            keywords,
            scripts
        }

        this.packages.forEach(name => {
            this.operator.addCommand(0, `npm install ${name} -S`)
        })

        this.devPackages.forEach(name => {
            this.operator.addCommand(0, `npm install ${name} -D`)
        })

        return [{
            path: 'package.json',
            text: JSON.stringify(this.values, null, '  ')
        }]
    }
}

module.exports = JsGenerator
