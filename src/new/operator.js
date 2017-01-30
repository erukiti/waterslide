'use strict'

const process = require('process')
const path = require('path')
const fs = require('fs')
const mkdirp = require('mkdirp')
const childProcess = require('child_process')

const DocumentProvider = require('./document_provider')
const SourceProvider = require('./source_provider')
const config = require('../config')

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

    output() {
        this._makeProjectDir()

        const outputFiles = []
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
