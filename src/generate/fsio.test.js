'use strict'

const test = require('ava')

const Fsio = require('./fsio')

test('new file', async t => {
    const fs = {
        'writeFile': (filename, content, options, callback) => {
            t.true(filename === 'test')
            t.true(content === 'hoge')
            t.deepEqual(options, {flag: 'w'})
            callback(null)
        }
    }

    const fsio = new Fsio(fs)
    await fsio.writeFile('test', 'hoge')
})

test('new file conflict', t => {
    const err = new Error('hoge')

    const fs = {
        'writeFile': (filename, content, options, callback) => {
            t.true(filename === 'test')
            t.true(content === 'hoge')
            t.deepEqual(options, {flag: 'w'})
            callback(err)
        }
    }

    const fsio = new Fsio(fs)
    fsio.writeFile('test', 'hoge').catch(e => t.true(e === err))
})

