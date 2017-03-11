'use strict'

const config = require('../config')
const readPrompt = require('read')

const configCommand = () => {
    return {
        command: 'config [key] [value]',
        describe: 'global configuration',
        builder: yargs => {

        },
        handler: argv => {
            console.dir(argv)
            if (argv.key && argv.value) {
                const validKeys = ['author', 'name', 'email', 'homepage', 'license']

                if (validKeys.includes(argv.key)) {
                    config.writeGlobal(argv.key, argv.value)
                } else {
                    console.log('invalid key')
                }
            }
        }
    }
}

module.exports = configCommand
