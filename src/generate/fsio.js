'use strict'

const path = require('path')
const mkdirp = require('mkdirp')
const fs = require('fs')

class Fsio {
    writeFile(filename, content, opts = {}) {
        return new Promise((resolve, reject) => {
            if (path.dirname(filename) !== '.') {
                mkdirp.sync(path.dirname(filename))
            }
            
            const options = {}
            if (opts.mode) {
                options.mode = opts.mode
            }
            options.flag = 'wx'

            fs.writeFile(filename, content, options, err => {
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            })
        })
    }

}

module.exports = Fsio