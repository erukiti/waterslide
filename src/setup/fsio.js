'use strict'

const path = require('path')
const mkdirp = require('mkdirp')
const fs = require('fs')

class Fsio {
    constructor() {
        this.cache = {}
    }

    writeFile(filename, content, opts = {}) {
        return new Promise((resolve, reject) => {
            let buf
            if (typeof buf === 'string') {
                buf = new Buffer(content)
            } else {
                buf = content
            }

            if (this.cache[filename] && this.cache[filename].equals(buf)) {
                resolve(false)
                return
            } else {
                this.cache[filename] = buf
            }

            if (path.dirname(filename) !== '.') {
                mkdirp.sync(path.dirname(filename))
            }

            const options = {}
            if (opts.mode) {
                options.mode = opts.mode
            }
            options.flag = opts.isRewritable ? 'w' : 'wx'

            fs.writeFile(filename, buf, options, err => {
                if (err) {
                    reject(err)
                } else {
                    resolve(true)
                }
            })
        })
    }

    readFile(filename) {
        return new Promise((resolve, reject) => {
            fs.readFile(filename, (err, content) => {
                if (err) {
                    reject(err)
                } else {
                    this.cache[filename] = content
                    resolve(content)
                }
            })
        })
    }

    readFileSync(filename) {
        try {
            const content = fs.readFileSync(filename)
            this.cache[filename] = content
            return content
        } catch (e) {
            return null
        }
    }

    checkExists(filename) {
        return new Promise((resolve, reject) => {
            fs.stat(filename, (err, stat) => {
                if (err) {
                    resolve(false)
                } else {
                    resolve(true)
                }
            })
        })
    }
}

module.exports = Fsio
