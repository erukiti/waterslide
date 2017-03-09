'use strict'

const path = require('path')
const process = require('process')

class CliUtils {
    constructor(opts = {}) {
        this.isVerbose = opts.verbose || opts.debug
        this.isDebug = opts.debug
        this.isMessage = true
        this.isError = true
        this.isWarning = true

        this.latestLength = 0
    }

    _getCaller(depth) {
        const reStackTrace = /at .+ \(([^:]+:[0-9]+:[0-9]+)\)/g

        depth += 2

        const { stack }  = new Error()
        let result
        while ((result = reStackTrace.exec(stack)) !== null) {
            if (--depth <= 0) {
                return path.join(path.basename(path.dirname(result[1])), path.basename(result[1]))
            }
        }
        return null
    }

    _hook() {
        const stdoutWrite = process.stdout.write
        const stderrWrite = process.stderr.write

        this._write = (...args) => {
            stdoutWrite.apply(process.stdout, args)
        }

        const _clear = () => {
            if (this.latestLength > 0) {
                this._write(`${' '.repeat(this.latestLength)}\r`)
                this.latestLength = 0
            }
        }

        let rotateIndex = 0
        let timer = setInterval(() => {
            const indicator = '|/-\\'.substr(rotateIndex, 1)
            if (++rotateIndex >= 4) {
                rotateIndex = 0
            }

            this._write(`${indicator}\r`)
        }, 50)

        process.stdout.write = (...args) => {
            _clear()
            process.stdout.write = stdoutWrite
            process.stderr.write = stderrWrite
            process.stdout.write(...args)
            clearInterval(timer)
        }

        process.stderr.write = (...args) => {
            _clear()
            process.stdout.write = stdoutWrite
            process.stderr.write = stderrWrite
            process.stderr.write(...args)
            clearInterval(timer)
        }
    }

    verbose(mesg = '', depth = 0) {
        let header = ''
        const caller = this._getCaller(depth + 1)
        if (this.isDebug && caller) {
            header = `verbose ${caller}`
        } else {
            header = 'verbose'
        }

        if (this.isVerbose) {
            console.log(`\x1b[33m${header}:\x1b[m ${mesg}`)
        } else {
            process.stdout.write(`  ${mesg}\r`)
            this.latestLength = mesg.length + 2
            this._hook()
        }
    }

    debug(mesg = '', depth = 0) {
        if (this.isDebug) {
            const header = `debug ${this._getCaller(depth + 1)}`
            console.log(`\x1b[36m${header}:\x1b[m ${mesg}`)
        }
    }

    message(mesg = '', depth = 0) {
        if (this.isMessage) {
            let header = ''
            if (this.isDebug) {
                console.log(`\x1b[32m${this._getCaller(depth + 1)}\x1b[m: ${mesg}`)
            } else {
                console.log(mesg)
            }
        }
    }

    warning(mesg = '', depth = 0) {
        if (this.isWarning) {
            let header = ''
            if (this.isDebug) {
                header = `warning ${this._getCaller(depth + 1)}`
            } else {
                header = 'warning'
            }
            console.log(`\x1b[33m${header}:\x1b[m ${mesg}`)
        }
    }

    error(mesg = '', depth = 0) {
        if (this.isError) {
            let header = ''
            if (this.isDebug) {
                header = `error ${this._getCaller(depth + 1)}`
            } else {
                header = 'error'
            }
            console.log(`\x1b[33m${header}:\x1b[m ${mesg}`)
        }
    }

}

module.exports = CliUtils