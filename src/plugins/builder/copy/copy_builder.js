'use strict'

const fs = require('fs')
const mkdirp = require('mkdirp')
const path = require('path')

class CopyBuilder {
    constructor(ev) {
        this.ev = ev
        this.dest = './build'
    }

    getTypes() {
        return ['copy']
    }

    copy(src) {
        const dest = src.replace(/^src\//, 'build/')

        // console.log(`${src} -> ${dest}`)

        mkdirp.sync(path.dirname(dest))
        fs.createReadStream(src).pipe(fs.createWriteStream(dest))
    }

    watch(entries) {
        const files = []
        entries.forEach(entry => {
            if (entry.opts && entry.opts.type === 'copy') {
                files.push(entry.path)
            }
        })

        files.forEach(filepath => {
            this.copy(filepath)
        })

        this.ev.emit('compiled', this)

        files.forEach(filepath => {
            fs.watch(filepath, (event, filename) => {
                this.copy(filepath)
                this.ev.emit('compiled', this)
            })
        })
    }
}

module.exports = CopyBuilder
