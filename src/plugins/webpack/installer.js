'use strict'

const {utils, getConfig} = require('../../waterslide')
const config = getConfig()

class WebpackInstaller {
    constructor(operator) {
        this.operator = operator
        this.values = config.getLocal('webpack') || {rules: []}
    }

    static getInstaller(operator) {
        return new this(operator)
    }

    addLoader(test, use) {
        if (this.values.rules.find(value => value.test === test)) {
            return
        }
        this.values.rules.push({test, use})
        getConfig().writeLocal('webpack', this.values)
    }

    async install() {
        this.operator.addBuilder('webpack')
        const jsInstaller = await this.operator.getInstaller('js')
        jsInstaller.addDevPackage('webpack')
        jsInstaller.addDevPackage('babel-loader')
    }
}

module.exports = WebpackInstaller
