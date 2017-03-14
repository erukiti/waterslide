'use strict'

const process = require('process')
const fs = require('fs')

class Plugin {
    requireLocal(name) {
        return require(`${process.cwd()}/node_modules/${name}`)
    }

    requireProject(name) {
        return require(`./plugins/${name}`).project
    }

    requireInstaller(name) {
        return require(`./plugins/${name}`).installer
    }

    requireGenerator(name) {
        return require(`./plugins/${name}`).generator
    }

    requireFinalizer(name) {
        return require(`./plugins/${name}`).finalizer
    }

    requireBuilder(name) {
        return require(`./plugins/${name}`).builder
    }

    requireTester(name) {
        return require(`./plugins/${name}`).tester
    }
}

module.exports = Plugin
