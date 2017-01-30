'use strict'

const fs = require('fs')
const mkdirp = require('mkdirp')
const path = require('path')

class CopyBuilder {
    constructor(ev) {
        this.ev = ev
        this.src = './src'
        this.dest = './build'
    }

    copy(filepath) {
        const src = path.join(this.src, filepath)
        const dest = path.join(this.dest, filepath)

        mkdirp.sync(path.dirname(dest))
        fs.createReadStream(src).pipe(fs.createWriteStream(dest))
    }

    watch(files) {
        files.forEach(filepath => {
            this.copy(filepath)
        })

        this.ev.emit('compiled', this)

        files.forEach(file => {
            fs.watch(path.join(this.src, file), (event, filename) => {
                this.copy(file)
                this.ev.emit('compiled', this)
            })
        })
    }
}

module.exports = CopyBuilder
