'use strict'

const Operator = require('../generate/operator')
const Plugin = require('../plugin')

class GenerateCli {
    constructor(cliUtils) {
        this.plugin = new Plugin()
        this.cliUtils = cliUtils
    }

    run(argv) {
        if (argv.length < 1) {
            this.cliUtils.message('Usage: waterslider generate <generator>')
            this.plugin.findGenerator().forEach(name => {
                const purpose = this.plugin.requireGenerator(name).getPurpose()
                this.cliUtils.message(`  ${name} : ${purpose}`)
            })

            return
        }

        const operator = new Operator(this.cliUtils)
        const generator = operator.getGenerator(argv[0])
        generator.fromCli(argv.slice(1))
        operator.output()
    }
}

module.exports = GenerateCli
