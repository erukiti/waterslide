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
            this.plugin.findGenerator().forEach(name => {
                const usage = this.plugin.requireGenerator(name).getUsage()
                this.cliUtils.message(usage)
            })

            return
        }

        const operator = new Operator(this.cliUtils)

        const generator = operator.getGenerator(argv[0])
        argv.shift()

        const getUse = s => s.startsWith('--use-') ? s.substr(6) : null
        const getOpt = s => s.startsWith('--opt-') ? s.substr(6) : null
        const getNoUse = s => s.startsWith('--no-use-') ? s.substr(9) : null
        const getNoOpt = s => s.startsWith('--no-opt-') ? s.substr(9) : null

        const opts = {use: [], opt: [], noUse: [], noOpt: []}

        let use, opt, noUse, noOpt
        while (
            (use = getUse(argv[0])) !== null || 
            (opt = getOpt(argv[0])) !== null ||
            (noUse = getNoUse(argv[0])) !== null || 
            (noOpt = getNoOpt(argv[0])) !== null
        ) {
            // assert

            if (use) {
                opts.use.push(use)
            }
            if (opt) {
                opts.opt.push(opt)
            }
            if (noUse) {
                opts.noUse.push(noUse)
            }
            if (noOpt) {
                opts.noOpt.push(noOpt)
            }

            argv.shift()
        }

        opts.use = opts.use.filter(value => !opts.noUse.includes(value))
        opts.opt = opts.opt.filter(value => !opts.noOpt.includes(value))

        if (opts.opt.length > 0) {
            this.operator.message(`set option: [${opts.opt.join(', ')}]`)
        }

        generator.fromCli(argv, opts)
        operator.output()
    }
}

module.exports = GenerateCli
