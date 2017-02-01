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
        app.on('quit', () => {
            cl.sendMessage('quit')
        })
    } catch (err) {
        // console.dir(err)
        // nice catch !!!!!!
    }
})
`

class ElectronTarget {
    constructor(operator) {
        this.operator = operator
        operator.requireProvider('js')
    }

    process() {
        const jsProvider = this.operator.getProvider('js')
        jsProvider.addDevPackage('electron')
        jsProvider.addDevPackage('electron-connect')
        jsProvider.setMain('src/browser/app.js')

        const sourceProvider = this.operator.getProvider('source')


        this.operator.generateSource('browser', 'src/renderer/index.js', {type: 'electron-renderer'})
        this.operator.addSource('src/browser/app.js', appJsText, {type: 'copy'})
        this.operator.addSource('src/package.json', JSON.stringify({'main': 'browser/app.js'}, null, '  ') + '\n', {type: 'copy'})

        this.operator.setDirectory('src', 'source', 'source code directory')
        this.operator.setDirectory('src/browser', null, 'source code directory (Electron Browser Process)')
        this.operator.setDirectory('src/renderer', null, 'source code directory (Electron Renderer Process)')
        this.operator.setDirectory('build', 'destination', 'build directory')
    }
}

module.exports = ElectronTarget
