'use strict'

class BrowserTarget {
    constructor(operator) {
        this.operator = operator
        operator.requireProvider('js')
        operator.requireProvider('document')
        operator.requireProvider('source')
    }

    process() {
        this.operator.generateSource('browser', 'src/index.js')

        const documentProvider = this.operator.getProvider('document')
        this.operator.setDirectory('src', 'source', 'source code directory')
        this.operator.setDirectory('build', 'destination', 'build directory')
    }
}

module.exports = BrowserTarget
