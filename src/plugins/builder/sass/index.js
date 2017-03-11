'use strict'

const fs = require('fs')
const mkdirp = require('mkdirp')
const path = require('path')
const sass = require('node-sass')

class SassBuilder {
    constructor(builder) {
        this.builder = builder
        this.src = builder.getDirectory('source')
        this.dest = builder.getDirectory('destination')
        this.isCompiled = false
    }

    getTypes() {
        return ['sass']
    }

    _sass(src) {
        const reSrc = new RegExp(`^${this.src}/`)

        const dest = src.replace(reSrc, `${this.dest}/`).replace(/(\.scss|\.sass)$/, '.css')

        this.builder.debug(`sass: ${src} -> ${dest}`)

        mkdirp.sync(path.dirname(dest))

        return new Promise((resolve, reject) => {
            sass.render({file: src, outFile: dest}, (err, result) => {
                if (err) {
                    reject(err)
                } else {
                    fs.writeFileSync(dest, result.css)
                    resolve()
                }
            })

        })
    }

    async _run(entries) {
        const files = entries.map(entry => entry.path)

        this.builder.verbose(`sass builder: ${files.join(', ')}`)

        for (let filePath of files) {
            await this._sass(filePath)
        }

        this.isCompiled = true
        this.builder.compiled()

        return files
    }

    run(entries) {
        this._run(entries)
    }

    watch(entries) {
    }
}

module.exports = SassBuilder
