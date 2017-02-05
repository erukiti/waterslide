'use strict'

const Operator = require('./operator')
const Plugin = require('../plugin')

class Generate {
    constructor() {
        this.plugin = new Plugin()
    }
    run(argv) {
        if (argv.length < 1) {
            console.log('need args')
            return
        }

        const operator = new Operator()
        const generator = operator.getGenerator(argv[0])
        generator.fromCli(argv.slice(1))
        operator.output()
    }
}

module.exports = Generate
