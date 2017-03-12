'use strict'

const fs = require('fs')
const path = require('path')

class ElectronIconGenerator {
    constructor(operator) {
        this.operator = operator
    }

    async generate(name, opts = {}) {
        await this.operator.getInstaller('electron-icon')

        const src = fs.readFileSync(path.join(__dirname, 'sample.png'))
        await this.operator.writeFile(name, src, {type: 'electron-icon'})
    }
}

module.exports = ElectronIconGenerator
