'use strict'

const path = require('path')
const process = require('process')
const Mustache = require('mustache')
const fs = require('fs')

class BrowserGenerator {
    constructor(operator) {
        this.operator = operator
    }

    async generate(name, opts = {}) {
        const dirname = path.dirname(name)
        const prefix = path.basename(name, '.js')

        const templateHtml = fs.readFileSync(require.resolve('./sample.html.mst')).toString()
        const html = Mustache.render(templateHtml, { prefix })

        const sampleJs = fs.readFileSync(require.resolve('./sample.js'))

        this.operator.writeFile(path.join(dirname, `${prefix}.html`), html, { type: 'copy'})
        this.operator.writeFile(path.join(dirname, `${prefix}.js`), sampleJs, opts)
    }
}

module.exports = BrowserGenerator
