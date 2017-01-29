'use strict'

const JSProvider = require('./js_provider')
const BabelProvider = require('./babel_provider')
const BrowserSampleSourceProvider = require('./browser_sample_source_provider')

class JSEnv {
    constructor(operator) {
        const jsProvider = new JSProvider(operator)
        operator.addProvider('js', jsProvider)
        operator.addProvider('babel', new BabelProvider(operator))
        operator.addProvider('browser_sample_source', new BrowserSampleSourceProvider(operator))
        operator.requireProvider('js')
    }

    process() {
    }
}

module.exports = JSEnv
