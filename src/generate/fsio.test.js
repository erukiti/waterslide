'use strict'

const test = require('ava')
const fs = require('fs')
const path = require('path')

require('babel-register')
const Fsio = require('./fsio')

let temp = ''

test.before(t => {
    temp = fs.mkdtempSync('/tmp/ws-')
})

test.beforeEach(t => {
    process.chdir(fs.mkdtempSync(`${temp}/fsio-`))
})

// use test.serial for process.chdir

test.serial('new file', async t => {
    const fsio = new Fsio()
    await fsio.writeFile('test', 'hoge')

    t.true(fs.readFileSync('test').toString() === 'hoge')
})

test.serial('new file with mode', async t => {
    const fsio = new Fsio()
    await fsio.writeFile('test', 'hoge', {mode: 0o777})

    t.true(fs.readFileSync('test').toString() === 'hoge')
})

test.serial('new file with already exists', t => {
    fs.writeFileSync('test', 'foo')

    const fsio = new Fsio()
    t.throws(fsio.writeFile('test', 'hoge'), `EEXIST: file already exists, open 'test'`)
    t.true(fs.readFileSync('test').toString() === 'foo')
})

test.serial('new file with mkdir', async t => {
    const filename = 'hoge/fuga/test'
    const fsio = new Fsio()
    await fsio.writeFile(filename, 'hoge')

    t.true(fs.readFileSync(filename).toString() === 'hoge')
})

test.serial('new file with mkdir failed', async t => {
    fs.writeFileSync('hoge', 'foo')

    const filename = 'hoge/fuga/test'
    const fsio = new Fsio()
    t.throws(fsio.writeFile(filename, 'hoge'), `ENOTDIR: not a directory, mkdir '${path.join(process.cwd(), path.dirname(filename))}'`)
})

