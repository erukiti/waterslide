'use strict'

const fs = require('fs')
const mkdirp = require('mkdirp')
const path = require('path')

class CopyBuilder {
    constructor(builder) {
        this.builder = builder
        this.dest = './build'
        this.isCompiled = false
    }

    getTypes() {
        return ['copy']
    }

    _copy(src) {
        const dest = src.replace(/^src\//, 'build/')

        this.builder.debug(`copy: ${src} -> ${dest}`)

        mkdirp.sync(path.dirname(dest))
        fs.createReadStream(src).pipe(fs.createWriteStream(dest))
    }

    _run(entries) {
        const files = entries.map(entry => entry.path)

        this.builder.verbose(`copy builder: ${files.join(', ')}`)

        files.forEach(filepath => {
            this._copy(filepath)
        })

        this.isCompiled = true
        this.builder.compiled()

        return files
    }

    run(entries) {
        this._run(entries)
    }

    watch(entries) {
        this._run(entries).forEach(filepath => {
            fs.watch(filepath, (event, filename) => {
                this._copy(filepath)
                this.isCompiled = true
                this.builder.compiled()
            })
        })
    }
}

module.exports = CopyBuilder
