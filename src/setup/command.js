'use strict'
// @flow

const ChildProcess = require('child_process')

class Command {
    childProcess: any
    commands: Array<Array<string>>

    constructor(childProcess: any) {
        this.childProcess = childProcess
        this.commands = [[], [], [], [], [], [], [], [], [], []]
    }

    addCommand(priority: number, command: string) {
        this.commands[priority].push(command)
    }

    exec(command: string) {
        return new Promise((resolve, reject) => {
            const child = this.childProcess.exec(command)
            child.on('error', err => reject(err))
            child.on('exit', (code, signal) => {
                if (code) {
                    child.stdout.pipe(process.stdout)
                    child.stderr.pipe(process.stdout)

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
