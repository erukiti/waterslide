'use strict'

const appJsText =
`'use strict'

const app = require('electron').app
const BrowserWindow = require('electron').BrowserWindow

app.on('window-all-closed', () => {
    app.quit()
})

let win

app.on('ready', () => {
    win = new BrowserWindow({
        width: 800,
        height: 600
    })
    win.loadURL(\`file://\${__dirname}/../renderer/index.html\`)
    win.on('closed', () => {
        win = null
    })
    try {
        const client = require('electron-connect').client
        let cl = client.create(win)
    } catch (err) {
        // console.dir(err)
        // nice catch !!!!!!
    }
})
`

class ElectronProject {
    constructor(operator) {
        this.operator = operator
        operator.setFinalizer('electron')
    }

    async install() {
        const jsGenerator = this.operator.getGenerator('js')
        jsGenerator.addDevPackage('electron')
        jsGenerator.addDevPackage('electron-connect')
        jsGenerator.addDevPackage('electron-packager')
        jsGenerator.addDevPackage('node-7z')
        jsGenerator.setMain('src/browser/app.js')

        this.operator.getGenerator('browser').generate('src/renderer/index.js', {type: 'electron-renderer'})

        this.operator.setDirectory('src', 'source', 'source code directory')
        this.operator.setDirectory('src/browser', null, 'source code directory (Electron Browser Process)')
        this.operator.setDirectory('src/renderer', null, 'source code directory (Electron Renderer Process)')
        this.operator.setDirectory('build', 'destination', 'build directory')
        this.operator.setDirectory('release', null, 'release directory')

        await this.operator.writeFile('src/browser/app.js', appJsText, {type: 'copy'})
        await this.operator.writeFile('src/package.json', JSON.stringify({'main': 'browser/app.js'}, null, '  ') + '\n', {type: 'copy'})
    }
}

module.exports = ElectronProject
