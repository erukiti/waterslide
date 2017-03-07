'use strict'

const child_process = require('child_process')

const waitStream = stream => new Promise(resolve => {
    stream.on('end', () => resolve())
})

const utils = {
    execSync: cmd => {
        try {
            const stdout = child_process.execSync(cmd).toString('utf-8')
            return {isError: false, stdout}
        } catch (e) {
            const stdout = e.stdout.toString('utf-8')
            const stderr = e.stderr.toString('utf-8')
            return {isError: true, stdout, stderr}
        }
    },
    exec: cmd => new Promise((resolve, reject) => {
        const child = child_process.exec(cmd)

        let stdout = ''
        let stderr = ''

        child.stdout.on('data', chunk => {
            stdout += chunk.toString()
        })

        child.stderr.on('data', chunk => {
            stderr += chunk.toString()
        })

        child.on('error', err => {
            reject(err)
        })
        child.on('exit', async (code, signal) => {
            await waitStream(child.stdout)
            await waitStream(child.stderr)
            resolve({code, stdout, stderr})
        })
    }),
    readNpmVersion: name => {
        const result = chlildProcess.execSync('npm info electron')
        const reVer = /version: '(\d+\.\d+\.\d+)',/
        return reVer.exec(result.toString())[1]
    }
}

module.exports = utils
