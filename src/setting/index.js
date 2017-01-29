'use strict'

const SettingWriter = require('./writer')

const setting = (argv) => {
    const writer = new SettingWriter()

    const validKeys = ['author', 'name', 'email', 'homepage', 'license']

    if (argv.length >= 2) {
        const value = argv.slice(1).join(' ')

        if (validKeys.includes(argv[0])) {
            writer.write(argv[0], value)
        } else {
            switch(argv[0]) {
                case 'license': {
                    // FIXME: SPDX license list にないものは警告をだす？
                    writer.write(argv[0], value)
                }
            }
        }
    }
}

module.exports = setting
