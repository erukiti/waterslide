'use strict'

class Command {
    constructor(childProcess) {
        this.childProcess = childProcess
        this.commands = [[], [], [], [], [], [], [], [], [], []]
    }

    addCommand(priority, command) {
        this.commands[priority].push(command)
    }

    exec(command) {
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

    async execAll(cb) {
        for (let commands of this.commands) {
            for (let command of commands) {
                cb && cb(command)
                await this.exec(command)
            }
        }
    }
}

module.exports = Command
