'use strict'
// @flow

const path = require('path')
const process = require('process')

type Opts = {
    verbose: boolean,
    debug: boolean,
}

class CliUtils {
    isVerbose: boolean
    isDebug: boolean
    isMessage: boolean
    isError: boolean
    isWarning: boolean
    latestLength: number

    constructor(opts: Opts = {verbose: false, debug: false}) {
        this.isVerbose = opts.verbose || opts.debug
        this.isDebug = opts.debug
        this.isMessage = true
        this.isError = true
        this.isWarning = true

        this.latestLength = 0
    }

    _getCaller(depth: number) {
        const reStackTrace = /at .+ \(([^:]+:[0-9]+:[0-9]+)\)/g

        let n = depth + 2

        const {stack} = new Error()
        let result
        while ((result = reStackTrace.exec(stack)) !== null) {
            if (--n <= 0) {
                return path.join(path.basename(path.dirname(result[1])), path.basename(result[1]))
            }
        }
        return ''
    }

    _hook() {
        const stdoutWrite = process.stdout.write
        const stderrWrite = process.stderr.write
        const exit = process.exit

        let rotateIndex = 0

        // Fixme: it can not be stopped while using hooks because it uses setInterval.
        let timer = setInterval(() => {
            const indicator = '|/-\\'.substr(rotateIndex, 1)
            if (++rotateIndex >= 4) {
                rotateIndex = 0
            }

            stdoutWrite.apply(process.stdout, [`${indicator}\r`])
        }, 50)

        const _reset = () => {
            clearInterval(timer)
            process.stdout.write = stdoutWrite
            process.stderr.write = stderrWrite
            process.exit = exit
            if (this.latestLength > 0) {
                process.stdout.write(`${' '.repeat(this.latestLength)}\r`)
                this.latestLength = 0
            }
        }

        process.exit = (...args) => {
            _reset()
            process.exit(...args)
        }

        process.stdout.write = (...args) => {
            _reset()
            process.stdout.write(...args)
        }

        process.stderr.write = (...args) => {
            _reset()
            process.stderr.write(...args)
        }
    }

    /**
     *
     * @param {string} [mesg]
     * @param {number} [depth]
     */
    verbose(mesg: string = '', depth: number = 0) {
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

    /**
     *
     * @param {string} [mesg]
     * @param {number} [depth]
     */
    debug(mesg: string = '', depth: number = 0) {
        if (this.isDebug) {
            const header = `debug ${this._getCaller(depth + 1)}`
            console.log(`\x1b[36m${header}:\x1b[m ${mesg}`)
        }
    }

    /**
     *
     * @param {string} [mesg]
     * @param {number} [depth]
     */
    message(mesg: string = '', depth: number = 0) {
        if (this.isMessage) {
            let header = ''
            if (this.isDebug) {
                console.log(`\x1b[32m${this._getCaller(depth + 1)}\x1b[m: ${mesg}`)
            } else {
                console.log(mesg)
            }
        }
    }

    /**
     *
     * @param {string} [mesg]
     * @param {number} [depth]
     */
    warning(mesg: string = '', depth: number = 0) {
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

    error(mesg: string = '', depth: number = 0) {
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
