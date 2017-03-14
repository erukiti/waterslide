'use strict'

const process = require('process')
const fs = require('fs')

const {getConfig, Plugin} = require('../waterslide')
const config = getConfig()
const plugin = new Plugin()
const Fsio = require('./fsio')
const Command = require('./command')
const Operator = require('./operator')

class Setup {
    constructor(cliUtils) {
        this.fsio = new Fsio()
        this.cliUtils = cliUtils
        this.command = new Command(require('child_process'))
        this.projectDir = null // FIXME
        this.installers = {}
        this.generators = {}
        this.noOpt = []
        this.noUse = []

        this.postInstalls = []

        this.directories = config.getLocal('directories') || {}
        this.entries = config.getLocal('entries') || []
        this.finalizer = config.getLocal('finalizer')
        this.builders = config.getLocal('builders') || []
        this.testers = config.getLocal('testers') || []
        this.opt = config.getLocal('opt') || []
        this.info = config.getLocal('info') || []

        this.operator = new Operator(this)

        this.operator.addBuilder('copy')
    }

    setProjectDir(name) {
        this.projectDir = name
    }

    setOpt(opt) {
        if (this.opt.length > 0) {
            this.cliUtils.error('warning: opt is already set.')
        }

        this.opt = opt
        config.writeLocal('opt', this.opt)
    }

    setNoOpt(noOpt) {
        if (this.noOpt.length > 0) {
            this.cliUtils.error('warning: noOpts is already set.')
        }

        this.noOpt = noOpt
    }

    setNoUse(noUse) {
        if (this.noUse.length > 0) {
            this.cliUtils.error('warning: noUse is already set.')
        }

        this.noUse = noUse
    }

    async install() {
        let processed = []

        const getNotProcessedKey = () => Object.keys(this.installers).filter(key => !processed.includes(key))

        let notProcessed
        while ((notProcessed = getNotProcessedKey()).length > 0) {
            for (let key of notProcessed) {
                await this.installers[key].install()
            }
            processed = processed.concat(notProcessed)
        }

        await Promise.all(this.postInstalls.map(cb => cb()))

        await this.command.execAll(command => this.cliUtils.verbose(command))
    }
}

module.exports = Setup
