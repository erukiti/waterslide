'use strict'

const yargs = require('yargs')

const binText = 
`#! /usr/bin/env node

console.log('Hello, Node.js bin World.')
`

class BinGenerator {
    constructor(operator) {
        this.operator = operator
        this.sources = []
    }

    static fromCli(operator, argv) {
        console.dir(argv)

        const g = new this(operator)
        g.generate(argv.args[0])
    }

    generate(name, opts = {}) {
        this.sources.push({path: `bin/${name}`, text: binText, mode: 0o755})

        const jsGenerator = this.operator.getInstaller('js')
        jsGenerator.addBin(`bin/${name}`)
    }

    async install() {
        this.operator.postInstall(async () => {
            await Promise.all(this.sources.map(source => {
                this.operator.writeFile(source.path, source.txt, source.opts)
            }))
        })
    }

}

module.exports = BinGenerator