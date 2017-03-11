'use strict'

const fs = require('fs')

class SassGenerator {
    constructor(operator) {
        this.operator = operator
    }

    async generate(name, opts = {}) {
        const src = fs.readFileSync(require.resolve('./sample.scss'))
        if (this.operator.isInstalled('sass')) {
            await this.operator.writeFile(name, src, {type: 'sass'})
        } else {
            await this.operator.writeFile(name, src)
        }
    }
}

module.exports = SassGenerator
