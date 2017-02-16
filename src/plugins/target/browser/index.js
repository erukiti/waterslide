'use strict'

class BrowserTarget {
    constructor(operator) {
        this.operator = operator
        operator.setFinalizer('browser')
    }

    process() {
        this.operator.getGenerator('js')
        this.operator.getGenerator('browser').generate('src/index.js', {type: 'web'})

        this.operator.setDirectory('src', 'source', 'source code directory')
        this.operator.setDirectory('build', 'destination', 'build directory')
    }

    output() {
        return []
    }
}

module.exports = BrowserTarget
