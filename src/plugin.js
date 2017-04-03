'use strict'

const process = require('process')
const fs = require('fs')

class Plugin {
    requireLocal(name: string) {
        try {
            return require(`${process.cwd()}/node_modules/${name}`)
        } catch (e) {
            return require(name)
        }
    }

    requireProject(name: string) {
        return require(`./plugins/${name}`).project
    }

    requireInstaller(name: string) {
        return require(`./plugins/${name}`).installer
    }

    requireGenerator(name: string) {
        return require(`./plugins/${name}`).generator
    }

    requireFinalizer(name: string) {
        return require(`./plugins/${name}`).finalizer
    }

    requireBuilder(name: string) {
        return require(`./plugins/${name}`).builder
    }

    requireTester(name: string) {
        return require(`./plugins/${name}`).tester
    }
}

module.exports = Plugin
