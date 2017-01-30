'use strict'

const config = require('../config')
const readPrompt = require('read')

class Setting {
    constructor() {
    }

    getPromptCreator(prompt, key) {
        return new Promise((resolve, reject) => {
            if (config.getGlobal(key)) {
                resolve()
            } else {
                readPrompt({prompt}, (err, result) => {
                    config.writeGlobal(key, result)
                    resolve()
                })
            }
        })
    }

    prompt() {
        this.getPromptCreator('your name :', 'name')
            .then(() => this.getPromptCreator('your email :', 'email'))
            .then(() => this.getPromptCreator('your homepage :', 'homepage'))
            .then(() => this.getPromptCreator('default license', 'license'))
            .then(() => this.getPromptCreator('github token', 'github_token'))
            .then(() => {
                console.log('setting is done.')
                console.log('')
                console.log('[usage]')
                console.log('  waterslider setting')
            })
    }

    run(argv) {
        if (argv.length === 0) {
            console.log(JSON.stringify(config.getGlobalAll(), null, '  '))
        } else if (argv.length >= 2) {
            const validKeys = ['author', 'name', 'email', 'homepage', 'license', 'github_token']

            const value = argv.slice(1).join(' ')

            if (validKeys.includes(argv[0])) {
                config.writeGlobal(argv[0], value)
            } else {
                switch(argv[0]) {
                    case 'license': {
                        // FIXME: SPDX license list にないものは警告をだす？
                        config.writeGlobal(argv[0], value)
                    }
                }
            }
        }
    }
}

module.exports = Setting
