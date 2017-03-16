'use strict';

const fs = require('fs');
const process = require('process');
const path = require('path');

const { utils, Plugin } = require('../../waterslide');

class ElectronFinalizer {
    constructor(builder) {
        this.builder = builder;
        this.electron = null;
        this.dest = this.builder.getDirectory('destination');
    }

    run() {
        if (!this.electron) {
            const plugin = new Plugin();
            this.electron = plugin.requireLocal('electron-connect').server.create({ path: `./${this.dest}`, stopOnClose: true });
            this.electron.start(state => state === 'stopped' && process.exit(0));
        } else {
            this.electron.restart();
        }
    }

    build() {
        this.builder.verbose('build electron');
        const plugin = new Plugin();
        const packager = plugin.requireLocal('electron-packager');
        const Zip = plugin.requireLocal('node-7z');

        const packageInfo = JSON.parse(fs.readFileSync('./package.json'));
        const electronVersion = utils.readNpmVersion('electron');

        const packagerConfDarwin = {
            dir: this.dest,
            out: 'release/',
            name: packageInfo.name,
            appVersion: packageInfo.version,
            arch: ['x64'],
            asar: true,
            platform: 'darwin',
            electronVersion,
            icon: path.join(this.dest, 'app.icns'),
            overwrite: true
        };

        if (process.env.ELECTRON_SIGN_DARWIN) {
            packagerConfDarwin['sign'] = process.env.ELECTRON_SIGN_DARWIN;
        }

        packager(packagerConfDarwin, (err, name) => {
            if (err) {
                this.builder.error(err);
                return;
            }

            let archive = new Zip();
            archive.add(`release/${packageInfo.name}-darwin-${packageInfo.version}.7z`, `release/${packageInfo.name}-darwin-x64/`, {
                m0: '=BCJ',
                m1: '=LZMA:d=21'
            }).then(() => {
                // process.exit(1)
            }).catch(err3 => console.error(err3));
        });

        const packagerConfWin32 = {
            dir: this.dest,
            out: 'release/',
            name: packageInfo.name,
            appVersion: packageInfo.version,
            arch: ['ia32', 'x64'],
            asar: true,
            platform: 'win32',
            electronVersion,
            icon: path.join(this.dest, 'app.ico'),
            overwrite: true
        };

        packager(packagerConfWin32, (err, pathes) => {
            if (err) {
                this.builder.error(err);
            }

            pathes.forEach(name => {
                const a = name.split('-');
                const platform = a[a.length - 2];
                const arch = a[a.length - 1];

                let archive = new Zip();
                archive.add(`release/${packageInfo.name}-${platform}-${arch}-${packageInfo.version}.7z`, name, {
                    m0: '=BCJ',
                    m1: '=LZMA:d=21'
                }).then(() => {}).catch(err3 => console.error(err3));
            });
        });
    }
}

module.exports = ElectronFinalizer;
//# sourceMappingURL=finalizer.js.map