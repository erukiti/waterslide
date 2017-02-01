'use strict'

class Plugin {
    constructor() {

    }

    requireEnv(name) {
        return require(`./plugins/env/${name}/${name}_env`)
    }

    requireTarget(name) {
        return require(`./plugins/target/${name}/${name}_target`)
    }

    requireGenerator(name) {
        return require(`./plugins/generator/${name}/${name}_generator`)
    }

    requireFinalizer(name) {
        return require(`./plugins/finalizer/${name}/${name}_finalizer`)
    }

    requireBuilder(name) {
        return require(`./plugins/builder/${name}/${name}_builder`)
    }
}

module.exports = Plugin
