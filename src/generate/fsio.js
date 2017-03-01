'use strict'

const path = require('path')

class Fsio {
    constructor(fs) {
        this.fs = fs
    }

    writeFile(filename, content, opts = {}) {
        const mkdir = name => new Promise(resolve => {
            this.fs.mkdir(name, err => {
                resolve()
            })
        })

        const mkdirp = async name => {
            const dir = []
            for (let v of name.split('/')) {
                if (v != '.') {
                    dir.push(v)
                    const hoge = await mkdir(dir.join('/'))
                }
            }
        }

        const writeFile = () => new Promise((resolve, reject) => {
            const options = {}
            if (opts.mode) {
                options.mode = opts.mode
            }
            options.flag = 'w'

            this.fs.writeFile(filename, content, options, err => {
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            })
        })

        return mkdirp(path.dirname(filename)).then(() => writeFile())
    }

    readFile(filename) {
        return this.fs.readFileSync(filename)
    }
}

module.exports = Fsio