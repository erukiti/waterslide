const test = require('ava')

const Command = require('./command')

class MockChildProcess {
    constructor() {
        this.onError = null
        this.onExit = null
        this.onStdoutPipe = null
        this.onStderrPipe = null
        this.command = null

        this.child = {
            on: (event, listener) => {
                switch (event) {
                case 'error': {
                    this.onError = listener
                    break
                }
                case 'exit': {
                    this.onExit = listener
                    break
                }
                }
            },
            stdout: {pipe: (dest) => this.onStdoutPipe(dest)},
            stderr: {pipe: (dest) => this.onStderrPipe(dest)},
        }
    }

    getChildProcess() {
        return {
            exec: command => {
                this.command = command
                return this.child
            }
        }
    }
}

test('success', async t => {
    const mockChildProcess = new MockChildProcess()
    const command = new Command(mockChildProcess.getChildProcess())
    const p = command.exec('hoge')

    t.true(mockChildProcess.command === 'hoge')
    mockChildProcess.onExit(0)
    await p
})

test('child error', async t => {
    const err = new Error()
    let isThrow = false

    const mockChildProcess = new MockChildProcess()
    const command = new Command(mockChildProcess.getChildProcess())
    const p = command.exec('hoge').catch(e => {
        isThrow = true
        t.true(e === err)
    })

    t.true(mockChildProcess.command === 'hoge')
    mockChildProcess.onError(err)
    await p
    t.true(isThrow)
})

test('child failed exit', async t => {
    const err = new Error()
    let isThrow = false
    let isStdout = false
    let isStderr = false

    const mockChildProcess = new MockChildProcess()
    const command = new Command(mockChildProcess.getChildProcess())
    const p = command.exec('hoge').catch(e => {
        isThrow = true
        t.true(e.toString() === 'Error: error \'hoge\' is failed. 1')
    })

    mockChildProcess.onStdoutPipe = () => {
        isStdout = true
    }
    mockChildProcess.onStderrPipe = () => {
        isStderr = true
    }

    t.true(mockChildProcess.command === 'hoge')
    mockChildProcess.onExit(1)
    await p
    t.true(isThrow)
    t.true(isStdout)
    t.true(isStderr)
})

