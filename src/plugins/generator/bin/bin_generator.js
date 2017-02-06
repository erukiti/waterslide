'use strict'

const binText = 
`#! /usr/bin/env node

console.log('Hello, Node.js bin World.')
`

class BinGenerator {
    constructor(operator) {
        this.operator = operator
        this.sources = []
    }

    static getPurpose() {
        return 'generate bin file at node.js'
    }

    fromCli(argv) {
        if (argv.length < 1) {
            this.operator.message('Usage: waterslider generate bin <name>')
            process.exit(1)
        }

        this.operator.setProjectDir()
        this.generate(argv[0])
    }

    generate(name, opts = {}) {
        this.sources.push({path: `bin/${name}`, text: binText, mode: 0o755})

        const jsGenerator = this.operator.getGenerator('js')
        jsGenerator.addBin(`bin/${name}`)
    }

    process() {

    }

    output() {
        return this.sources
    }

}

module.exports = BinGenerator