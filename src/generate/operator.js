'use strict'

const process = require('process')
const fs = require('fs')

const { getConfig, Plugin } = require('../waterslider')
const config = getConfig()
const Fsio = require('./fsio')
const Command = require('./command')

class Operator {
    constructor(cliUtils) {
        this.plugin = new Plugin()
        this.fsio = new Fsio()
        this.cliUtils = cliUtils
        this.command = new Command(require('child_process'))
        this.projectDir = null // FIXME
        this.installers = {}
        this.generator = null
        this.noOpt = []
        this.noUse = []

        this.postInstalls = []

        this.directories = config.getLocal('directories') || []
        this.entries = config.getLocal('entries') || []
        this.finalizer = config.getLocal('finalizer')
        this.builders = config.getLocal('builders') || []
        this.testers = config.getLocal('testers') || []
        this.opt = config.getLocal('opt') || []
        this.info = config.getLocal('info') || []

        this.addBuilder('copy')

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

    getOpt() {
        return this.opt
    }

    setNoOpt(noOpt) {
        if (this.noOpt.length > 0) {
            this.cliUtils.error('warning: noOpts is already set.')
        }

        this.noOpt = noOpt
    }

    getNoOpt() {
        return this.noOpt
    }

    setNoUse(noUse) {
        if (this.noUse.length > 0) {
            this.cliUtils.error('warning: noUse is already set.')
        }

        this.noUse = noUse
    }

    getNoUse(noUse) {
        return this.noUse
    }

    getProjectDir() {
        // if (!this.projectDir)
        return this.projectDir
    }

    addCommand(priority, command) {
        this.command.addCommand(priority, command)
    }

    async setDirectory(directory, purpose, description) {
        const documentGenerator = await this.getInstaller('document')
        documentGenerator.setDirectory(directory, description)
        if (purpose) {
            this.directories.push({directory, purpose})
        }
    }

    getDirectories() {
        return this.directories
    }

    async setGenerator(name, argv) {
        const Generator = this.plugin.requireGenerator(name)
        this.generator = Generator.fromCli(this, argv)

        await this.generator.install()

            // if (klass.replace) {
            //     this.cliUtils.verbose(`generator: ${name} -> ${klass.replace()}`, 1)
            //     name = klass.replace()
            // }

            // if (this.installers[name]) {
            //     this.cliUtils.error(`${src} is already loaded.`)
            //     process.exit(1)
            // }

            // if (!klass) の処理を書く
    }

    async getInstaller(name) {
        if (!this.installers[name]) {
            const klass = this.plugin.requireInstaller(name)
            const generator = await klass.getInstaller(this)
            if (!generator) {
                this.cliUtils.warning(`installer ${name} is ignored.`)
                return null
            }

            this.cliUtils.verbose(`installer: ${name}`, 1)
            this.installers[name] = generator
        }

        return this.installers[name]
    }

    setFinalizer(name) {
        this.finalizer = name
    }

    addBuilder(name) {
        if (this.builders.includes(name)) {
            return
        }
        this.builders.push(name)
    }

    addTester(name) {
        if (this.builders.includes(name)) {
            return
        }

        this.testers.push(name)
    }

    readFile(name) {
        return this.fsio.readFile(name)
    }

    readFileSync(name) {
        return this.fsio.readFileSync(name)
    }

    checkExists(name) {
        return this.fsio.checkExists(name)
    }

    writeFile(name, content, opts = {}) {
        this.entries.push({path: name, text: content, opts})

        return this.fsio.writeFile(name, content, opts).then(isWrote => {
            if (isWrote) {
                this.verbose(`wrote ${name}`)
            }
        })
    }

    postInstall(cb) {
        this.postInstalls.push(cb)
    }

    setInfo(title, message) {
        this.info.push({title, message})
    }

    async install() {
        let processed = []

        const getNotProcessedKey = () => Object.keys(this.installers).filter(key => !processed.includes(key))

        let notProcessed
        while ((notProcessed = getNotProcessedKey()).length > 0) {
            await Promise.all(notProcessed.map(key => this.installers[key].install()))
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

    verbose(message) {
        this.cliUtils.verbose(message, 1)
    }

    message(message) {
        this.cliUtils.message(message, 1)
    }
}

module.exports = Operator
