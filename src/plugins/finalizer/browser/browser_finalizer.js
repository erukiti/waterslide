'use strict'

const open = require('open')
const path = require('path')
class BrowserFinalizer {
    constructor(builder) {
        this.builder = builder
    }

    run() {
        // FIXME: 一度openしたら再度openしなくていいのでは？
        open(`file:///${path.resolve('./build/index.html')}`)
    }

    build() {
        this.builder.verbose('BrowserFinalizer#build is nop.')
    }
}

module.exports = BrowserFinalizer
