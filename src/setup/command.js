'use strict'
// @flow

const ChildProcess = require('child_process')

const CliUtils = require('../cli/utils')

class Command {
    childProcess: any
    commands: Array<Array<string>>
    cliUtils: CliUtils

    constructor(childProcess: any, cliUtils: CliUtils) {
        this.childProcess = childProcess
        this.commands = [[], [], [], [], [], [], [], [], [], []]
        this.cliUtils = cliUtils
    }

    addCommand(priority: number, command: string) {
        this.commands[priority].push(command)
    }

    exec(command: string) {
        return new Promise((resolve, reject) => {
            this.cliUtils.message(command)
            const child = this.childProcess.exec(command)
            // child.stdout.pipe(process.stdout)
            // child.stderr.pipe(process.stdout)
            child.on('error', err => reject(err))
            child.on('exit', (code, signal) => {
                if (code) {
                    reject(new Error(`error '${command}' is failed. ${code}`))
                } else {
                    resolve()
                }
            })
        })
    }

    async execAll(cb: () => any) {
        for (let commands of this.commands) {
            for (let command of commands) {
                cb && cb(command)
                await this.exec(command)
            }
        }
    }
}

module.exports = Command
