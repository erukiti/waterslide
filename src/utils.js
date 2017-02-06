'use strict'

const child_process = require('child_process')

const utils = {
    execSync: (cmd) => {
        try {
            const stdout = child_process.execSync(cmd).toString('utf-8')
            return {isError: false, stdout}
        } catch (e) {
            const stdout = e.stdout.toString('utf-8')
            const stderr = e.stderr.toString('utf-8')
            return {isError: true, stdout, stderr}
        }
    }
}

module.exports = utils
