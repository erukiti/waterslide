'use strict'

const {config} = require('../../../waterslider')

class JSProvider {
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

    outputs() {
        const getProjectName = () => this.operator.getProjectDir()
            // FIXME: project dir -> project name

        const getVersion = () => '1.0.0'
        const getDescription = () => ''
        const author = config.get('author')
        const license = config.get('license')
        const keywords = []

        this.values = {
            main: this.main,
            name: getProjectName(),
            version: getVersion(),
            description: getDescription(),
            author,
            license,
            keywords
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

module.exports = JSProvider
