'use strict'

const fs = require('fs')
const path = require('path')

const {utils} = require('../../waterslide')

class FlowInstaller {
    constructor(operator) {
        this.operator = operator
    }

    static async getInstaller(operator) {
        if (utils.checkExistsNpm('flow-bin')
            || await operator.checkExists('.flowconfig')
        ) {
            return null
        }
        return new this(operator)
    }

    async install() {
        const jsInstaller = await this.operator.getInstaller('js')
        jsInstaller.addDevPackage('flow-bin')
        jsInstaller.addDevPackage('flow-typed')
        jsInstaller.addDevPackage('babel-preset-flow')

        const babelInstaller = await this.operator.getInstaller('babel')
        babelInstaller.addPreset('flow')

        // const eslintInstaller = await this.operator.getInstaller('eslint')
        // eslintInstaller.


        const conf = fs.readFileSync(path.join(__dirname, 'flowconfig')).toString()
        await this.operator.writeFile('.flowconfig', conf)
    }
}

module.exports = FlowInstaller
