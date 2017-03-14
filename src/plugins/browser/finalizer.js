'use strict'

const open = require('open')
const path = require('path')

class BrowserFinalizer {
    constructor(builder) {
        this.builder = builder
        this.dest = this.builder.getDirectory('destination')
    }

    run() {
        open(`file:///${path.resolve('./${this.dest}/index.html')}`)
    }

    build() {
        this.builder.message('build complete.')
    }
}

module.exports = BrowserFinalizer
