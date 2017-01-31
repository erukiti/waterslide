'use strict'

const JSProvider = require('./js_provider')
const BabelProvider = require('./babel_provider')


class JSEnv {
    constructor(operator) {
        const jsProvider = new JSProvider(operator)
        operator.addProvider('js', jsProvider)
        operator.addProvider('babel', new BabelProvider(operator))
        operator.requireProvider('js')
    }

    process() {
    }
}

module.exports = JSEnv
