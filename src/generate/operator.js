'use strict'

const process = require('process')
const path = require('path')
const fs = require('fs')
const mkdirp = require('mkdirp')
const childProcess = require('child_process')


const {getLogger, getConfig, Plugin} = require('../waterslider')
const config = getConfig()
const logger = getLogger()

/**
 * creator()が生成するPromiseを非同期かつ直列的に実行する
 * var creator  Promiseを返すコールバック
 * return       creatorが生成したPromise
 */

let p = Promise.resolve()
const doSerial = creator => p = p.then(creator)

class Operator {
    constructor() {
        this.commands = []
        this.projectDir = null
        this.directories = []
        this.generators = {}
        this.plugin = new Plugin()
        this.entries = []
        this.target = null
        this.builders = []

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
        this.directories = config.getLocal('directories')
        config.getLocal('entries').forEach(entry => {
            this.entries.push(entry)
        })
        this.finalizer = config.getLocal('finalizer')
        this.builders = config.getLocal('builders')
        this.sillyname = config.getLocal('sillyname')
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

    replaceGenerator(src, dest) {
        // 既に登録済みだとwarning出すべきかな
        if (this.generators[src]) {
            console.error(`${src} is already loaded.`)
            process.exit(1)
        }
        const klass = this.plugin.requireGenerator(dest)
        this.generators[src] = new klass(this)
    }

    getGenerator(name) {
        if (!this.generators[name]) {
            const klass = this.plugin.requireGenerator(name)

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
        
        const outputFiles = []

        // process()
        Object.keys(this.generators).forEach(key => {
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
                outputFiles.push(this._outputFile(entry.path, entry.text))
            }
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
        console.log(`\x1b[33m${message}\x1b[m]`)
    }
}

module.exports = Operator
