'use strict'

const {EventEmitter} = require('events')

const WebpackBuilder = require('../plugins/builder/webpack/webpack_builder')
const CopyBuilder = require('../plugins/builder/copy/copy_builder')
const ElectronFinalizer = require('../plugins/finalizer/electron/electron_finalizer')

class Watch {
    constructor() {
        const ev = new EventEmitter()

        this.webpackBuilder = new WebpackBuilder(ev)
        this.copyBuilder = new CopyBuilder(ev)
        this.finalizer = new ElectronFinalizer(ev)
        this.isWebpack = false
        this.isCopy = false

        ev.on('compiled', obj => {
            if (obj === this.webpackBuilder) {
                this.isWebpack = true
            } else if (obj === this.copyBuilder) {
                this.isCopy = true
            } else {
                console.error('unknown message!!!!!')
            }

            if (this.isWebpack && this.isCopy) {
                ev.emit('run')
            }
        })
        ev.on('error', err => console.dir(err))
        ev.on('compile error', details => console.error(details))
        ev.on('warning', warning => console.dir(warning))

    }

    run() {
        this.copyBuilder.watch(['package.json', 'browser/app.js', 'renderer/index.html'])
        this.webpackBuilder.watch('renderer/index.js')
    }
}

module.exports = Watch
