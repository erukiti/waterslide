'use strict'

const yargs = require('yargs')

const fs = require('fs')

class BinGenerator {
    constructor(operator) {
        this.operator = operator
    }

    async generate(name, opts = {}) {
        const binText = fs.readFileSync(require.resolve('./bin.js'))
        this.operator.writeFile(`bin/${name}`, binText, {mode: 0o755})

        const jsInstaller = await this.operator.getInstaller('js')
        jsInstaller.addBin(`bin/${name}`)
    }
}

module.exports = BinGenerator