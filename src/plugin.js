'use strict'

const process = require('process')
const fs = require('fs')

class Plugin {
    requireLocal(name) {
        return require(`${process.cwd()}/node_modules/${name}`)
    }

    requireProject(name) {
        return require(`./plugins/project/${name}`)
    }

    requireInstaller(name) {
        return require(`./plugins/installer/${name}`)
    }

    requireGenerator(name) {
        return require(`./plugins/generator/${name}`)
    }

    findGenerator() {
        return ['browser', 'bin']
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
