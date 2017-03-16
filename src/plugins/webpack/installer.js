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
        const found = this.values.rules.findIndex(value => value.test === test)
        if (found !== -1) {
            use.forEach(({loader, options}) => {
                if (!this.values.rules[found].use.find(value => value.loader === loader)) {
                    this.values.rules[found].use.push({loader, options, exclude: 'node_modules'})
                }
            })

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
