'use strict'
// @flow

const config = require('../config')
const Menu = require('terminal-menu')
const createCharm = require('charm')
const readPrompt = require('read')
const {PassThrough} = require('stream')


type MenuItem = {
    label: string,
    cb?: () => any,
}

class DummyInput extends PassThrough {
    destroy() {}
}

const charm = createCharm({input: new DummyInput()})

const prompt = item => {
    return new Promise((resolve, reject) => {
        readPrompt({prompt: item.desc}, (err, result) => {
            if (err) {
                reject(err)
            } else {
                config.writeGlobal(item.name, result)
                resolve()
            }
        })
    })
}

const createMenu = (items: Array<MenuItem>) => {
    return new Promise((resolve, reject) => {
        const menu = new Menu({charm})
        menu.reset()

        let cb = null

        const menuStream = menu.createStream()
        const passDataToMenu = data => menuStream.write(data)

        items.forEach(item => {
            if (!item.cb) {
                menu.write(item.label)
            } else {
                menu.add(item.label, () => {
                    cb = item.cb
                    menu.close()
                })
            }
        })

        // see. https://github.com/facebook/flow/issues/2944
        const workAround: any = process.stdin

        process.stdin.on('data', passDataToMenu)
        menuStream.pipe(process.stdout, {end: false})
        workAround.setRawMode(true)
        process.stdin.resume()

        menu.on('close', () => {
            menuStream.unpipe(process.stdout)
            process.stdin.removeListener('data', passDataToMenu)
            workAround.setRawMode(false)
            resolve(cb)
        })
    })
}

const selectLicense = item => {
    const licenses = [
        {name: 'Apache-2.0', desc: 'Apache License 2.0'},
        {name: 'BSD-2-Clause', desc: 'BSD 2-clause "Simplified" License'},
        {name: 'BSD-3-Clause', desc: 'BSD 3-clause "New" or "Revised License'},
        {name: 'AGPL-3.0', desc: 'GNU Affero General Public License v3.0'},
        {name: 'GPL-2.0', desc: 'GNU General Public License v2.0 only'},
        {name: 'GPL-3.0', desc: 'GNU General Public License v3.0 only'},
        {name: 'LGPL-2.0', desc: 'GNU Library General Public License v2 only'},
        {name: 'LGPL-2.1', desc: 'GNU Lesser General Public License v2.1 only'},
        {name: 'LGPL-3.0', desc: 'GNU Lesser General Public License v3.0 only'},
        {name: 'MIT', desc: 'MIT License'},
    ]

    const items: Array<MenuItem> = []
    items.push({label: 'Please select default your license\n\n'})
    licenses.forEach(license => {
        items.push({label: license.desc, cb: () => {
            config.writeGlobal('license', license.name)
        }})
    })

    items.push({label: '\n'})
    items.push({label: 'Input other license', cb: () => {
        return prompt({name: 'license', desc: 'input license name (see. https://spdx.org/licenses/)'})
    }})

    items.push({label: '\n'})
    items.push({label: 'quit', cb: () => {}})
    return createMenu(items)
}

const configurable = [
    {name: 'name', desc: 'your name (use author\'s credit)', cb: prompt},
    {name: 'email', desc: 'your email (use author\'s credit)', cb: prompt},
    {name: 'homepage', desc: 'your homepage url (use author\'s credit)', cb: prompt},
    {name: 'license', desc: 'default license', cb: selectLicense},
]

const configMenu = () => {
    const items: Array<MenuItem> = []
    items.push({label: 'waterslide global configuration\n\n'})

    configurable.forEach(item => {
        items.push({label: `${item.name}: ${config.getGlobal(item.name)}`, cb: () => item.cb(item)})
    })

    items.push({label: '\n'})
    items.push({label: 'exit', cb: () => process.exit(0)})

    return createMenu(items)
}

const configLoop = async () => {
    let cb = await configMenu().catch(e => console.dir(e))
    for (;;) {
        if (!cb) {
            cb = await configMenu().catch(e => console.dir(e))
        }
        cb = await cb()
    }
}


const configCommand = () => {
    return {
        command: 'config [key] [value]',
        describe: 'global configuration',
        builder: (yargs: Object) => {

        },
        handler: (argv: Object) => {
            if (!argv.key && !argv.value) {
                configLoop()
                return
            }

            if (!argv.value) {
                console.log(`${argv.key}: ${config.getGlobal(argv.key)}`)
                return
            }

            const validKeys = configurable.map(item => item.name)

            if (validKeys.includes(argv.key)) {
                config.writeGlobal(argv.key, argv.value)
            } else {
                console.log('invalid key')
            }
        }
    }
}

module.exports = configCommand
