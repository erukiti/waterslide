'use strict'

const SettingReader = require('../../../setting/reader')

class JSProvider {
    constructor(operator) {
        this.settingReader = new SettingReader()

        this.operator = operator

        this.packages = []
        this.devPackages = []
    }

    addPackage(name) {
        this.packages.push(name)
    }

    addDevPackage(name){
        this.devPackages.push(name)
    }

    outputs() {
        const getProjectName = () => this.operator.getProjectDir()
            // FIXME: project dir -> project name

        const getVersion = () => '1.0.0'
        const getDescription = () => ''
        const getMain = () => 'src/index.js'
        const author = this.settingReader.get('author')
        const license = this.settingReader.get('license')
        const keywords = []

        this.values = {
            name: getProjectName(),
            version: getVersion(),
            description: getDescription(),
            main: getMain(),
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
