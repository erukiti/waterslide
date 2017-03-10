'use strict'

const fs = require('fs')
const mkdirp = require('mkdirp')
const path = require('path')

const {Plugin} = require('../../../waterslider')
const plugin = new Plugin()
const icongen = plugin.requireLocal('icon-gen')
const Jimp = plugin.requireLocal('jimp')

class ElectronIconBuilder {
    constructor(builder) {
        this.builder = builder
        this.src = builder.getDirectory('source')
        this.dest = builder.getDirectory('destination')
        this.isCompiled = false
    }

    getTypes() {
        return ['electron-icon']
    }

    async _run(entries) {
        await Promise.all(entries.map(async entry => {
            const temp = fs.mkdtempSync('/tmp/ws-')
            await Jimp.read(entry.path).then(async image => {
                await Promise.all([16, 24, 32, 48, 64, 128, 256, 512, 1024].map(size => {
                    return new Promise((resolve, reject) => {
                        image.clone().resize(size, size).write(path.join(temp, `${size}.png`), () => {
                            resolve()
                        })
                    })
                }))
            })

            const dest = path.dirname(entry.path.replace(this.src, this.dest))
            const name = path.basename(entry.path, '.png')

            return icongen(temp, dest, {
                type: 'png',
                modes: ['ico', 'icns'],
                names: {ico: name, icns: name}
            })
        }))

        this.isCompiled = true
        this.builder.compiled()
    }

    run(entries) {
        this._run(entries).catch(e => console.dir(e))
    }

    watch(entries) {
        // this._run(entries).forEach(filepath => {
        //     fs.watch(filepath, (event, filename) => {
        //         this._copy(filepath)
        //         this.isCompiled = true
        //         this.builder.compiled()
        //     })
        // })
    }
}

module.exports = ElectronIconBuilder
