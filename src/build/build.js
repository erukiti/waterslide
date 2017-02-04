'use strict'

const {EventEmitter} = require('events')

const config = require('../config')
const Plugin = require('../plugin')

class Build {
    constructor() {
        config.startLocal()

        const ev = new EventEmitter()
        this.plugin = new Plugin()
        this.entries = config.getLocal('entries')
        this.builders = []
        this.compiled = {}
        this.isWebpack = false
        this.isCopy = false
        if (config.getLocal('finalizer')) {
            const klass = this.plugin.requireFinalizer(config.getLocal('finalizer'))
            new klass(ev)
        }
        config.getLocal('builders').forEach(name => {
            const klass = this.plugin.requireBuilder(name)
            this.builders.push(new klass(ev))
        })
        const list = config.getLocal('builders').sort().join(',')

        ev.on('compiled', name => {
            this.compiled[name] = name

            if (list === Object.keys(this.compiled).sort().join(',')) {
                ev.emit('build')
            }
        })
        ev.on('error', err => console.error(err))
        ev.on('compile error', details => {
            console.log('compile error')
            console.error(details)
        })
        ev.on('warning', warning => {
            console.log('compile warning')
            console.dir(warning)
        })

    }

    run() {
        this.builders.forEach(builder => {
            builder.watch(this.entries.filter(entry => {
                return entry.opts && builder.getTypes().includes(entry.opts.type)
            }))
        })
    }
}

module.exports = Build
