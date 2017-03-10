'use strict'

const fs = require('fs')

class ElectronIconGenerator {
    constructor(operator) {
        this.operator = operator
    }

    async generate(name, opts = {}) {
        await this.operator.getInstaller('electron-icon')

        const src = fs.readFileSync(require.resolve('./sample.png'))
        await this.operator.writeFile(name, src, {type: 'electron-icon'})
    }
}

module.exports = ElectronIconGenerator
