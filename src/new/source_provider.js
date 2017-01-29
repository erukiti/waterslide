'use strict'

class SourceProvider {
    constructor(operator) {
        this.sources = []
        this.entries = []
    }

    addAsset(path, text, opts = {}) {
        this.sources.push({path, text})
    }

    addEntry(path, text, opts = {}) {
        this.sources.push({path, text})
    }

    outputs() {
        return this.sources
    }
}

module.exports = SourceProvider
