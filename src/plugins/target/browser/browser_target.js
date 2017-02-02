'use strict'

class BrowserTarget {
    constructor(operator) {
        this.operator = operator
        operator.requireProvider('js')
    }

    process() {
        this.operator.getGenerator('browser').generate('src/index.js')

        this.operator.setDirectory('src', 'source', 'source code directory')
        this.operator.setDirectory('build', 'destination', 'build directory')
    }
}

module.exports = BrowserTarget
