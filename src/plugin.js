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
        return require(`./plugins/target/${name}`)
    }

    requireGenerator(name) {
        return require(`./plugins/generator/${name}`)
    }

    findGenerator() {
        return ['project', 'browser']
    }

    requireFinalizer(name) {
        return require(`./plugins/finalizer/${name}`)
    }

    requireBuilder(name) {
        return require(`./plugins/builder/${name}`)
    }

    requireTester(name) {
        return require(`./plugins/tester/${name}`)
    }
}

module.exports = Plugin
