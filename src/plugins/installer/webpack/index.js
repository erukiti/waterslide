'use strict'

const { utils, getConfig } = require('../../../waterslider')
const config = getConfig()

class WebpackGenerator {
    constructor(operator) {
        this.operator = operator
        this.values = config.getLocal('webpack') || { rules: [] }
    }

    static getInstaller(operator) {
        return new this(operator)
    }

    addLoader(test, use) {
        if (this.values.rules.find(value => value.test === test)) {
            return
        }
        this.values.rules.push({test, use})
    }

    async install() {
        this.operator.addBuilder('webpack')
        const jsGenerator = await this.operator.getInstaller('js')
        jsGenerator.addDevPackage('webpack')
        jsGenerator.addDevPackage('babel-loader')

        this.operator.postInstall(() => {
            getConfig().writeLocal('webpack', this.values)
        })
    }
}

module.exports = WebpackGenerator
