'use strict'

const childProcess = require('child_process')

class NodeFinalizer {
    constructor(builder) {
        this.builder = builder
        this.dest = this.builder.getDirectory('destination')
    }

    run() {
        const child = childProcess.exec(`node ${this.dest}/index.js`)
        child.stdout.pipe(process.stdout)
        child.stderr.pipe(process.stderr)

        child.on('error', err => {
            this.builder.error(err)
            process.exit(1)
        })

        child.on('exit', (code, signal) => {
            this.builder.message(`exit ${code}`)
        })

    }

    build() {
        this.builder.message('build complete.')
    }

}

module.exports = NodeFinalizer
