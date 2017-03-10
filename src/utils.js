'use strict'

const childProcess = require('child_process')
const fs = require('fs')

const waitStream = stream => new Promise(resolve => {
    stream.on('end', () => resolve())
})

let cachePackageJson = null

const utils = {
    execSync: cmd => {
        try {
            const stdout = childProcess.execSync(cmd).toString('utf-8')
            return {isError: false, stdout}
        } catch (e) {
            const stdout = e.stdout.toString('utf-8')
            const stderr = e.stderr.toString('utf-8')
            return {isError: true, stdout, stderr}
        }
    },
    exec: cmd => new Promise((resolve, reject) => {
        const child = childProcess.exec(cmd)

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
            // await waitStream(child.stdout)
            // await waitStream(child.stderr)
            resolve({code, stdout, stderr})
        })
    }),
    readNpmVersion: name => {
        const result = childProcess.execSync(`npm list --depth=0`).toString()
        const ind = result.indexOf(`${name}@`)
        if (ind !== -1) {
            return result.substr(ind + name.length + 1).split('\n')[0]
        } else {
            return null
        }
    },
    checkExistsNpm: name => {
        if (!cachePackageJson) {
            try {
                cachePackageJson = JSON.parse(fs.readFileSync('package.json'))
            } catch(e) {
                return false
            }
        }

        if (cachePackageJson.dependencies && cachePackageJson.dependencies[name]) {
            return true
        }

        if (cachePackageJson.devDependencies && cachePackageJson.devDependencies[name]) {
            return true
        }
        return false
    }
}

module.exports = utils
