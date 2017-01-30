'use strict'

const process = require('process')
const path = require('path')

class ElectronFinalizer {
    constructor(ev) {
        this.ev = ev
        this.electron = null
        this.ev.on('run', () => this.run())
    }

    run() {
        if (!this.electron) {
            this.electron = require(path.join(process.cwd(), 'node_modules', 'electron-connect')).server.create({path: './build'})
            console.dir(this.electron)
            this.electron.start()
            this.electron.on('quit', () => process.exit(0))
        } else {
            this.electron.restart()
        }
    }
}

module.exports = ElectronFinalizer
