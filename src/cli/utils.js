'use strict'

const path = require('path')
const process = require('process')

class CliUtils {
    constructor(opts = {}) {
        this.isVerbose = opts.verbose
        this.isDebug = opts.debug
        this.isMessage = true
        this.isError = true

        this.rotateIndex = 0
        this.latestLength = 0
    }

    _getCaller(depth) {
        const reStackTrace = /at .+ \(([^:]+:[0-9]+:[0-9]+)\)/g

        depth += 2

        const { stack }  = new Error()
        let result
        while ((result = reStackTrace.exec(stack)) !== null) {
            if (--depth <= 0) {
                return result[1]
            }
        }
        return null
    }

    verbose(mesg = '', depth = 0) {
        let header = ''
        const caller = this._getCaller(depth + 1)
        if (this.isDebug && caller) {
            header = `verbose ${path.basename(caller)}`
        } else {
            header = 'verbose'
        }

        if (this.isVerbose) {
            console.log(`\x1b[33m${header}:\x1b[m ${mesg}`)
        } else {
            const indicator = '|/-\\'.substr(this.rotateIndex, 1)
            if (++this.rotateIndex >= 4) {
                this.rotateIndex = 0
            }
            
            process.stdout.write(`${' '.repeat(this.latestLength + 2)}\r${indicator} ${mesg}\r`)
            this.latestLength = mesg.length
        }
    }

    debug(mesg = '', depth = 0) {
        if (this.isDebug) {
            const header = `debug ${path.basename(this._getCaller(depth + 1))}`
            console.log(`\x1b[36m${header}:\x1b[m ${mesg}`)
        }
    }

    message(mesg = '', depth = 0) {
        if (this.isMessage) {
            let header = ''
            if (this.isDebug) {
                console.log(`\x1b[32m${path.basename(this._getCaller(depth + 1))}\x1b[m: ${mesg}`)
            } else {
                console.log(mesg)
            }
        }
    }

    error(mesg = '', depth = 0) {
        if (this.isError) {
            let header = ''
            if (this.isDebug) {
                header = `error ${path.basename(this._getCaller(depth + 1))}`
            } else {
                header = 'error'
            }
            console.log(`\x1b[33m${header}:\x1b[m ${mesg}`)
        }
    }

}

module.exports = CliUtils