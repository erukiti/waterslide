'use strict'

class JSProvider {
    constructor(operator) {
        this.operator = operator

        this.packages = []
        this.devPackages = []

        const getProjectName = () => operator.getProjectDir()
            // FIXME: いい感じに変換する仕組みを考える
            //        大文字小文字や区切りをいじったり

        const getVersion = () => '1.0.0'
        const getDescription = () => ''
        const getMain = () => 'src/index.js'

        this.values = {
            name: getProjectName(),
            version: getVersion(),
            description: getDescription(),
            main: getMain()
        }

    }

    addPackage(name) {
        this.packages.push(name)
    }

    addDevPackage(name){
        this.devPackages.push(name)
    }

    outputs() {
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
