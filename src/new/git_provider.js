'use strict'

class GitProvider {
    constructor(operator) {
        this.ignoreFiles = ['node_modules/', 'npm-debug.log']
    }

    addIgnore(path) {
        this.ignoreFiles.push(path)
    }

    outputs() {
        return [{
            path: '.gitignore',
            text: this.ignoreFiles.join('\n')
        }]
    }
}

module.exports = GitProvider
