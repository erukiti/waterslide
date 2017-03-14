'use strict'

const fs = require('fs')
const path = require('path')

class BinGenerator {
    constructor(operator) {
        this.operator = operator
    }

    async generate(name, opts = {}) {
        const binText = fs.readFileSync(path.join(__dirname, 'bin.js'))
        this.operator.writeFile(`bin/${name}`, binText, {mode: 0o755})

        const jsInstaller = await this.operator.getInstaller('js')
        jsInstaller.addBin(`bin/${name}`)
    }
}

module.exports = BinGenerator
