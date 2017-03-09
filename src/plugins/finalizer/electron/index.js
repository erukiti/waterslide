'use strict'

const fs = require('fs')
const process = require('process')

const { utils, Plugin } = require('../../../waterslider')

class ElectronFinalizer {
    constructor(builder) {
        this.builder = builder
        this.electron = null
        this.dest = this.builder.getDirectory('destination')
    }

    run() {
        if (!this.electron) {
            const plugin = new Plugin()
            this.electron = plugin.requireLocal('electron-connect').server.create({path: `./${this.dest}`, stopOnClose: true})
            this.electron.start(state => state === 'stopped' && process.exit(0))
        } else {
            this.electron.restart()
        }
    }

    build() {
        const plugin = new Plugin()
        const packager = plugin.requireLocal('electron-packager')
        const Zip = plugin.requireLocal('node-7z')

        const packageInfo = JSON.parse(fs.readFileSync('./package.json'))

        const electronVersion = utils.readNpmVersion('electron')

        const packagerConfDarwin = {
            dir: this.dest,
            out: 'release/',
            name: packageInfo.name,
            arch: ['x64'],
            asar: true,
            platform: 'darwin',
            electronVersion,
            // icon: 'src/app.icns',
            overwrite: true
        }

        if (process.env.ELECTRON_SIGN_DARWIN) {
            packagerConfDarwin['sign'] = process.env.ELECTRON_SIGN_DARWIN
        }

        packager(packagerConfDarwin, (err2, path) => {
            let archive = new Zip()
            archive.add(`release/${packageInfo.name}-darwin-${packageInfo.version}.7z`, `release/${packageInfo.name}-darwin-x64/`, {
                m0: '=BCJ',
                m1: '=LZMA:d=21'
            }).then(() => {
                // process.exit(1)
            }).catch(err3 => console.error(err3))
        })

/*
        const packagerConfWin32 = {
            dir: 'build',
            out: 'release/',
            name: packageInfo.name,
            arch: ['ia32', 'x64'],
            asar: true,
            platform: 'win32',
            electronVersion: packageInfo.dependencies['electron'],
            // icon: 'tmp/app.ico',
            overwrite: true
        }

        packager(packagerConfWin32, (err2, pathes) => {
            console.dir(err2)
            console.dir(pathes)
            pathes.forEach((path) => {
                const a = path.split('-')
                const platform = a[1]
                const arch = a[2]

                let archive = new Zip()
                archive.add(`release/${packageInfo.name}-${platform}-${arch}-${packageInfo.version}.7z`, path, {
                    m0: '=BCJ',
                    m1: '=LZMA:d=21'
                }).then(() => {

                }).catch(err3 => console.error(err3))

            })

        })
*/
    }
}

module.exports = ElectronFinalizer
