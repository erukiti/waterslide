'use strict'

const process = require('process')
const fs = require('fs')

const { getConfig, Plugin } = require('../waterslider')
const config = getConfig()
const plugin = new Plugin()
const Fsio = require('./fsio')
const Command = require('./command')

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

        this._createOperator()

        this.operator.addBuilder('copy')
    }

    _createOperator() {
        this.operator = {}
        this.operator.getOpt = () => this.opt
        this.operator.getNoOpt = () => this.noOpt
        this.operator.getNoUse = () => this.noUse
        this.operator.getProjectDir = () => this.projectDir
        this.operator.addCommand = (priority, command) => this.command.addCommand(priority, command)
        this.operator.setDirectory = async (directory, type, description) => {
            const documentInstaller = await this.operator.getInstaller('document')
            documentInstaller.setDirectory(directory, description)
            if (type) {
                this.directories[type] = directory
            }
        }

        this.operator.getGenerator = name => {
            if (!this.generators[name]) {
                const Generator = plugin.requireGenerator(name)
                this.generators[name] = new Generator(this.operator)
            }
            return this.generators[name]
        }

        this.operator.replaceGenerator = (name, generator) => {
            if (this.generators[name]) {
                this.operator.error(`${name} generator is already used.`)
            } else {
                this.generators[name] = generator
            }
        }

        this.operator.getInstaller = async name => {
            if (!this.installers[name]) {
                const klass = plugin.requireInstaller(name)
                const installer = await klass.getInstaller(this.operator)
                if (!installer) {
                    this.cliUtils.warning(`installer ${name} is ignored.`)
                    return null
                }

                this.cliUtils.verbose(`installer: ${name}`, 1)
                this.installers[name] = installer
            }

            return this.installers[name]
        }

        this.operator.setFinalizer = name => this.finalizer = name

        this.operator.addBuilder = name => {
            if (this.builders.includes(name)) {
                return
            }
            this.builders.push(name)
        }

        this.operator.addTester = name => {
            if (this.testers.includes(name)) {
                return
            }

            this.testers.push(name)
        }

        this.operator.readFile = name => this.fsio.readFile(name)
        this.operator.readFileSync = name => this.fsio.readFileSync(name)
        this.operator.checkExists = name =>  this.fsio.checkExists(name)
        this.operator.writeFile = (name, content, opts = {}) => {
            this.entries.push({path: name, text: content, opts})

            return this.fsio.writeFile(name, content, opts).then(isWrote => {
                if (isWrote) {
                    this.cliUtils.verbose(`wrote ${name}`, 1)
                }
            })
        }

        this.operator.postInstall = cb => this.postInstalls.push(cb)
        this.operator.setInfo = (title, message) => this.info.push({title, message})
        this.operator.verbose = message => this.cliUtils.verbose(message, 1)
        this.operator.message = message => this.cliUtils.message(message, 1)
        this.operator.error = message => this.cliUtils.error(message, 1)
    }

    setProjectDir(name) {
        this.projectDir = name
    }

    setOpt(opt) {
        if (this.opt.length > 0) {
            this.cliUtils.error('warning: opt is already set.')
        }

        this.opt = opt
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

        config.writeLocal('directories', this.directories)
        config.writeLocal('entries', this.entries.filter(entry => entry.opts && entry.opts.type).map(entry => {return {path: entry.path, opts: entry.opts}}))
        config.writeLocal('finalizer', this.finalizer)
        config.writeLocal('builders', this.builders)
        config.writeLocal('testers', this.testers)
        config.writeLocal('opt', this.opt)
        config.writeLocal('info', this.info)

        await this.command.execAll(command => this.cliUtils.verbose(command))
    }
}

module.exports = Setup
