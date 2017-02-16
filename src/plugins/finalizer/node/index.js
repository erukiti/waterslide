'use strict'

const childProcess = require('child_process')

class NodeFinalizer {
    constructor(builder) {
        this.builder = builder
    }

    run() {
        const child = childProcess.exec('node build/index.js')
        child.stdout.pipe(process.stdout)
        child.stderr.pipe(process.stderr)

        child.on('error', err => {
            this.builder.error(err)
            process.exit(1)
        })

        child.on('exit', (code, signal) => {
            this.builder.verbose(`exit ${code}`)
            if (code) {
                process.exit(code)
            }
        })

    }

    build() {
        this.builder.verbose('NodeFinalizer#build is nop.')
    }

}

module.exports = NodeFinalizer
