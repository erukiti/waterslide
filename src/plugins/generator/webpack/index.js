'use strict'

const { getConfig } = require('../../../waterslider')

class WebpackGenerator {
    constructor(operator) {
        this.operator = operator
        this.rules = []
    }

    static getInstaller(operator) {
        return new this(operator)
    }

    addLoader(test, use) {
        this.rules.push({test, use})
    }

    async install() {
        this.operator.addBuilder('webpack')
        const jsGenerator = this.operator.getGenerator('js')
        jsGenerator.addDevPackage('webpack')
        jsGenerator.addDevPackage('babel-loader')

        this.operator.postInstall(() => {
            getConfig().writeLocal('webpack', { rules: this.rules })
        })
    }
}

module.exports = WebpackGenerator
