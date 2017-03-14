'use strict'

const fs = require('fs')
const path = require('path')

class SassGenerator {
    constructor(operator) {
        this.operator = operator
    }

    async generate(name, opts = {}) {
        const src = fs.readFileSync(path.join(__dirname, 'sample.scss'))
        if (this.operator.isInstalled('sass')) {
            await this.operator.writeFile(name, src, {type: 'sass'})
        } else {
            await this.operator.writeFile(name, src)
        }
    }
}

module.exports = SassGenerator
