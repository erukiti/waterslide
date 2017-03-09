'use strict'

const fs = require('fs')

class ElectronProject {
    constructor(operator) {
        this.operator = operator
        operator.setFinalizer('electron')
    }

    async install() {
        const appJsText = fs.readFileSync(require.resolve('./app.js'))

        const jsInstaller = await this.operator.getInstaller('js')
        jsInstaller.addDevPackage('electron')
        jsInstaller.addDevPackage('electron-connect')
        jsInstaller.addDevPackage('electron-packager')
        jsInstaller.addDevPackage('node-7z')
        jsInstaller.setMain('src/browser/app.js')

        const g = this.operator.getGenerator('browser')
        await g.generate('src/renderer/index.js', {type: 'electron-renderer'})

        await this.operator.setDirectory('src', 'source', 'source code directory')
        await this.operator.setDirectory('src/browser', null, 'source code directory (Electron Browser Process)')
        await this.operator.setDirectory('src/renderer', null, 'source code directory (Electron Renderer Process)')
        await this.operator.setDirectory('build', 'destination', 'build directory')
        await this.operator.setDirectory('release', null, 'release directory')

        await this.operator.writeFile('src/browser/app.js', appJsText, {type: 'copy'})
        await this.operator.writeFile('src/package.json', JSON.stringify({'main': 'browser/app.js'}, null, '  ') + '\n', {type: 'copy'})
    }
}

module.exports = ElectronProject
