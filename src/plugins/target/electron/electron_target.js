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
        operator.requireProvider('document')
        operator.requireProvider('source')
        operator.requireProvider('browser_sample_source')
    }

    process() {
        this.operator.getProvider('js').addDevPackage('electron')
        this.operator.getProvider('js').addDevPackage('electron-connect')

        const sourceProvider = this.operator.getProvider('source')
        sourceProvider.addEntry('src/browser/app.js', appJsText, {env: 'node'})
        sourceProvider.addAsset('src/package.json', JSON.stringify({'main': 'browser/app.js'}, null, '  '))

        const browserSampleSourceProvider = this.operator.getProvider('browser_sample_source')
        browserSampleSourceProvider.createSample('src/renderer', 'index')

        this.operator.setDirectory('src', 'source', 'source code directory')
        this.operator.setDirectory('src/browser', null, 'source code directory (Electron Browser Process)')
        this.operator.setDirectory('src/renderer', null, 'source code directory (Electron Renderer Process)')
        this.operator.setDirectory('build', 'destination', 'build directory')
    }
}

module.exports = ElectronTarget
