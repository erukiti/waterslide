'use strict'

const process = require('process')
const path = require('path')
const fs = require('fs')
const mkdirp = require('mkdirp')
const childProcess = require('child_process')

const DocumentProvider = require('./document_provider')
const SourceProvider = require('./source_provider')
const config = require('../config')
const Plugin = require('../plugin')

/**
 * creator()が生成するPromiseを非同期かつ直列的に実行する
 * var creator  Promiseを返すコールバック
 * return       creatorが生成したPromise
 */

let p = Promise.resolve()
const doSerial = creator => p = p.then(creator)

class Operator {
    constructor(projectDir) {
        this.providers = {}
        this.required = {}
        this.commands = []
        this.projectDir = projectDir
        this.directories = []
        this.generators = {}
        this.plugin = new Plugin()
        this.entries = []
        this.objs = []
        this.envs = {}
        this.builders = []

        this._makeProjectDir = () => {
            fs.mkdirSync(projectDir)
            process.chdir(projectDir)
        }

        this._outputFile = (filename, text) => new Promise((resolve, reject) => {
            if (path.dirname(filename)) {
                mkdirp.sync(path.dirname(filename))
            }

            fs.writeFile(filename, text, { flag: 'wx' }, err => {
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            })
        })

        this._command = command => new Promise((resolve, reject) => {
            console.log(command)
            const child = childProcess.exec(command)
            child.on('error', err => reject(err))
            child.on('exit', (code, signal) => {
                if (code) {
                    child.stdout.pipe(process.stdout)
                    child.stderr.pipe(process.stdout)
                    reject()
                } else {
                    resolve()
                }
            })
        })

        this.addProvider('document', new DocumentProvider(this))
        this.addProvider('source', new SourceProvider(this))
        this.addBuilder('copy')
    }

    getConfig(key) {
        return config.getGlobal(key)
    }

    getProjectDir() {
        return this.projectDir
    }

    addProvider(name, provider) {
        this.providers[name] = provider
    }

    requireProvider(name) {
        this.required[name] = true
    }

    isRequiredProvider(name) {
        return this.required[name]
    }

    addCommand(priority, command) {
        if (this.commands[priority] === undefined) {
            this.commands[priority] = []
        }

        this.commands[priority].push(command)
    }

    setDirectory(path, purpose, description) {
        this.getProvider('document').setDirectory(path, description)
        if (purpose) {
            this.directories.push({path, purpose})
        }
    }

    getDirectories() {
        return this.directories
    }

    replaceGenerator(name, generator) {
        // 既に登録済みだとwarning出すべきかな
        this.generators[name] = generator
    }

    generateSource(generatorName, name, opts = {}) {
        if (!this.generators[generatorName]) {
            const klass = this.plugin.requireGenerator(generatorName)

            // if (!klass) の処理を書く

            this.generators[generatorName] = new klass(this)
        }
        this.entries = this.entries.concat(this.generators[generatorName].generateSource(name, opts))
    }

    addSource(name, text, opts = {}) {
        this.entries.push({path: name, text, opts})
    }

    getEntries() {
        return this.entries.map(entry => {
            return {path: entry.path, opts: entry.opts}
        })
    }

    requireEnv(name) {
        if (!this.envs[name]) {
            const klass = this.plugin.requireEnv(name)
            this.objs.push(new klass(this))
            this.envs[name] = true
        }
    }

    setTarget(name) {
        const klass = this.plugin.requireTarget(name)
        this.objs.push(new klass(this))

        // FIXME 二回目以後はエラー
    }

    setFinalizer(name) {
        this.finalizer = name
    }

    getFinalizer() {
        return this.finalizer
    }

    addBuilder(name) {
        this.builders.push(name)
    }

    getBuilders() {
        return this.builders
    }

    preprocess() {
        this.objs.forEach(obj => obj.preprocess())
    }

    process() {
        this.objs.forEach(obj => obj.process())
    }

    output() {
        this._makeProjectDir()

        const outputFiles = []

        this.entries.forEach(entry => {
            outputFiles.push(this._outputFile(entry.path, entry.text))
        })

        Object.keys(this.providers).forEach(key => {
            this.providers[key].outputs().forEach(provided => {
                outputFiles.push(this._outputFile(provided.path, provided.text))
            })
        })

        doSerial(() => Promise.all(outputFiles))

        this.commands.forEach(commands => {
            commands.forEach(command => {
                doSerial(() => this._command(command))
            })
        })
        doSerial(() => {
            console.log()
            console.log(`  project \x1b[32m${this.projectDir}\x1b[m was created.`)
            console.log(`  see. \x1b[36m${this.projectDir}/README.md\x1b[m`)
        }).catch(err => console.error(err))
    }

    getProvider(name) {
        return this.providers[name]
    }
}

module.exports = Operator
