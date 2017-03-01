'use strict'

const process = require('process')
const path = require('path')
const fs = require('fs')
const mkdirp = require('mkdirp')
const childProcess = require('child_process')

const {getConfig, Plugin} = require('../waterslider')
const config = getConfig()
const Fsio = require('./fsio')

class Operator {
    constructor(cliUtils) {
        this.plugin = new Plugin()
        this.fsio = new Fsio(fs)
        this.cliUtils = cliUtils
        this.commands = [[], [], [], [], [], [], [], [], [], []]
        this.projectDir = null
        this.directories = []
        this.generators = {}
        this.entries = []
        this.target = null
        this.builders = []
        this.testers = []
        this.isOverwrite = true
        this.opt = []
        this.noOpt = []
        this.noUse = []

        this._command = command => new Promise((resolve, reject) => {
            this.cliUtils.verbose(command)
            const child = childProcess.exec(command)
            child.on('error', err => reject(err))
            child.on('exit', (code, signal) => {
                if (code) {
                    child.stdout.pipe(process.stdout)
                    child.stderr.pipe(process.stdout)

                    reject(`error '${command}' is failed. ${code}`)
                } else {
                    resolve()
                }
            })
        })

        this.addBuilder('copy')
    }

    getConfig() {
        return config
    }

    setProjectDir(projectDir = './') {
        this.projectDir = projectDir
        if (projectDir !== './') {
            fs.mkdirSync(projectDir)
            process.chdir(projectDir)
        }
        config.startLocal()

        // FIXME?
        this.directories = config.getLocal('directories') || []
        const entries = config.getLocal('entries') || []
        entries.forEach(entry => {
            this.entries.push(entry)
        })
        this.finalizer = config.getLocal('finalizer')
        this.builders = config.getLocal('builders') || ['copy']
        this.testers = config.getLocal('testers') || []
        this.sillyname = config.getLocal('sillyname')
        this.opt = config.getLocal('opt') || []
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

    setOverwrite(isOverwrite) {
        this.isOverwrite = isOverwrite
    }

    getProjectDir() {
        // if (!this.projectDir)
        return this.projectDir
    }

    addCommand(priority, command) {
        this.commands[priority].push(command)
    }

    setDirectory(path, purpose, description) {
        const documentGenerator = this.getGenerator('document')
        documentGenerator.setDirectory(path, description)
        if (purpose) {
            this.directories.push({path, purpose})
        }
    }

    getDirectories() {
        return this.directories
    }

    getGenerator(name) {
        if (!this.generators[name]) {
            const klass = this.plugin.requireGenerator(name)

            this.cliUtils.verbose(`generator: ${name}`, 1)

            if (klass.replace) {
                this.cliUtils.verbose(`generator: ${name} -> ${klass.replace()}`, 1)
                name = klass.replace()
            }

            if (this.generators[name]) {
                this.cliUtils.error(`${src} is already loaded.`)
                process.exit(1)
            }

            // if (!klass) の処理を書く

            this.generators[name] = new klass(this)
        }

        return this.generators[name]
    }

    setTarget(name) {
        const klass = this.plugin.requireTarget(name)
        this.target = new klass(this)

        // FIXME 二回目以後はエラー
    }

    setFinalizer(name) {
        this.finalizer = name
    }

    addBuilder(name) {
        this.builders.push(name)
    }

    addTester(name) {
        this.testers.push(name)
    }

    async output() {
        // if (!this.projectDir)

        // console.log(Object.keys(this.generators).join(', '))

        // assert target が generators に含まれてない


        const processed = []

        const getNotProcessedKey = () => Object.keys(this.generators).filter(key => !processed.includes(key))

        if (this.target) {
            this.target.process()
        }

        let notProcessed = []
        while ((notProcessed = getNotProcessedKey()).length > 0) {
            notProcessed.forEach(key => {
                this.generators[key].process()
                processed.push(key)
            })
        }

        // outputs
        Object.keys(this.generators).forEach(key => {
            this.generators[key].output().forEach(entry => {
                this.entries.push(entry)
            })
        })

        if (this.target) {
            this.target.output().forEach(entry => {
                this.entries.push(entry)
            })
        }

        const outputFiles = this.entries.map(async entry => {
            await this.fsio.writeFile(entry.path, entry.text)
            this.cliUtils.verbose(`wrote ${entry.path}`)
        })

        await Promise.all(outputFiles)

        for (let commands of this.commands) {
            for (let command of commands) {
                await this._command(command)
            }
        }

        this.cliUtils.message()
        this.cliUtils.message(`  project \x1b[32m${this.projectDir}\x1b[m was created.`)
        this.cliUtils.message(`  see. \x1b[36m${this.projectDir}/README.md\x1b[m`)

        // console.log(JSON.stringify(config.localConfig, null, '  ')+'\n')

        config.writeLocal('directories', this.directories)
        config.writeLocal('entries', this.entries.filter(entry => entry.opts && entry.opts.type).map(entry => {return {path: entry.path, opts: entry.opts}}))
        config.writeLocal('finalizer', this.finalizer)
        config.writeLocal('builders', this.builders)
        config.writeLocal('testers', this.testers)
        config.writeLocal('opt', this.opt)
        config.writeLocal('use', Object.keys(this.generators))
        if (this.sillyname) {
            config.writeLocal('sillyname', this.sillyname)
        }
    }

    setSillyname(sillyname) {
        this.sillyname = sillyname
    }

    verbose(message) {
        this.cliUtils.verbose(message, 1)
    }

    message(message) {
        this.cliUtils.message(message, 1)
    }
}

module.exports = Operator
