'use strict'

const process = require('process')
const fs = require('fs')

class Plugin {
    constructor() {

    }

    requireLocal(name) {
        return require(`${process.cwd()}/node_modules/${name}`)
    }

    requireTarget(name) {
        return require(`./plugins/target/${name}/${name}_target`)
    }

    requireGenerator(name) {
        return require(`./plugins/generator/${name}/${name}_generator`)
    }

    findGenerator() {
        return ['project', 'browser']
    }

    requireFinalizer(name) {
        return require(`./plugins/finalizer/${name}/${name}_finalizer`)
    }

    requireBuilder(name) {
        return require(`./plugins/builder/${name}/${name}_builder`)
    }

    requireTester(name) {
        return require(`./plugins/tester/${name}/${name}_tester`)
    }
}

module.exports = Plugin
