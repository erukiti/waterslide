'use strict'

const { getConfig } = require('../../../waterslider')

class WebpackGenerator {
    constructor(operator) {
        this.operator = operator
        this.rules = []
        operator.addBuilder('webpack')
    }

    addLoader(test, use) {
        this.rules.push({test, use})
    }

    async install() {
        const jsGenerator = this.operator.getGenerator('js')
        jsGenerator.addDevPackage('webpack')
        jsGenerator.addDevPackage('babel-loader')

        this.operator.postInstall(() => {
            getConfig().writeLocal('webpack', { rules: this.rules })
        })
    }
}

module.exports = WebpackGenerator
