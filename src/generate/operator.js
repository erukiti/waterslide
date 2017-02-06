'use strict'

const process = require('process')
const path = require('path')
const fs = require('fs')
const mkdirp = require('mkdirp')
const childProcess = require('child_process')


const {getConfig, Plugin} = require('../waterslider')
const config = getConfig()

/**
 * creator()が生成するPromiseを非同期かつ直列的に実行する
 * var creator  Promiseを返すコールバック
 * return       creatorが生成したPromise
 */

let p = Promise.resolve()
const doSerial = creator => p = p.then(creator)

class Operator {
    constructor(cliUtils) {
        this.plugin = new Plugin()
        this.cliUtils = cliUtils
        this.commands = []
        this.projectDir = null
        this.directories = []
        this.generators = {}
        this.entries = []
        this.target = null
        this.builders = []
        this.isOverwrite = true

        this._outputFile = entry => new Promise((resolve, reject) => {
            if (path.dirname(entry.path)) {
                mkdirp.sync(path.dirname(entry.path))
            }

            const opts = {}
            if (entry.mode) {
                opts.mode = entry.mode
            }
            opts.flag = this.isOverwrite ? 'w' : 'wx'

            fs.writeFile(entry.path, entry.text, opts, err => {
                if (err) {
                    reject(err)
                } else {
                    this.cliUtils.verbose(`file wrote: ${entry.path}`)
                    resolve()
                }
            })
        })

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

    setProjectDir(projectDir = './') {
        this.projectDir = projectDir
        if (projectDir !== './') {
            fs.mkdirSync(projectDir)
            process.chdir(projectDir)
        }
        config.startLocal()

        // FIXME
        this.directories = config.getLocal('directories') || []
        const entries = config.getLocal('entries') || []
        entries.forEach(entry => {
            this.entries.push(entry)
        })
        this.finalizer = config.getLocal('finalizer')
        this.builders = config.getLocal('builders') || ['copy']
        this.sillyname = config.getLocal('sillyname')
    }

    setOverwrite(isOverwrite) {
        this.isOverwrite = isOverwrite
    }

    getProjectDir() {
        // if (!this.projectDir)
        return this.projectDir
    }

    addCommand(priority, command) {
        if (this.commands[priority] === undefined) {
            this.commands[priority] = []
        }

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

            this.cliUtils.verbose(`generator: ${name}`)

            if (klass.replace) {
                this.cliUtils.verbose(`generator: ${name} -> ${klass.replace()}`)
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

    output() {
        // if (!this.projectDir)

        // console.log(Object.keys(this.generators).join(', '))

        const outputFiles = []

        // FIXME: process()の中でgetGeneretorされる対策
        // process()
        Object.keys(this.generators).forEach(key => {
            // console.log(key)
            this.generators[key].process()
        })

        if (this.target) {
            this.target.process()
        }

        // outputs
        Object.keys(this.generators).forEach(key => {
            this.generators[key].output().forEach(file => {
                this.entries.push(file)
            })
        })

        if (this.target) {
            this.target.output().forEach(file => {
                this.entries.push(file)
            })
        }

        this.entries.forEach(entry => {
            if (entry.text) {
                outputFiles.push(this._outputFile(entry))
            }
        })

        doSerial(() => Promise.all(outputFiles))

        this.commands.forEach(commands => {
            commands.forEach(command => {
                doSerial(() => this._command(command))
            })
        })
        doSerial(() => {
            this.cliUtils.message()
            this.cliUtils.message(`  project \x1b[32m${this.projectDir}\x1b[m was created.`)
            this.cliUtils.message(`  see. \x1b[36m${this.projectDir}/README.md\x1b[m`)
        }).catch(err => console.error(err))

        // console.log(JSON.stringify(config.localConfig, null, '  ')+'\n')

        config.writeLocal('directories', this.directories)
        config.writeLocal('entries', this.entries.filter(entry => entry.opts && entry.opts.type).map(entry => {return {path: entry.path, opts: entry.opts}}))
        config.writeLocal('finalizer', this.finalizer)
        config.writeLocal('builders', this.builders)
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
