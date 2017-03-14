'use strict'

const fs = require('fs')
const path = require('path')
const process = require('process')
const Mustache = require('mustache')

class BrowserGenerator {
    constructor(operator) {
        this.operator = operator
    }

    async generate(name, opts = {}) {
        const dirname = path.dirname(name)
        const prefix = path.basename(name, '.js')

        const templateHtml = fs.readFileSync(path.join(__dirname, 'sample.html.mst')).toString()
        const html = Mustache.render(templateHtml, {prefix})

        const sampleJs = fs.readFileSync(path.join(__dirname, 'sample.js'))

        this.operator.writeFile(path.join(dirname, `${prefix}.html`), html, {type: 'copy'})
        this.operator.writeFile(path.join(dirname, `${prefix}.js`), sampleJs, opts)
    }
}

module.exports = BrowserGenerator
