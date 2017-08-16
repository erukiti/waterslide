'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const test = require('ava');

const Command = require('./command');

class MockChildProcess {
    constructor() {
        this.onError = null;
        this.onExit = null;
        this.onStdoutPipe = null;
        this.onStderrPipe = null;
        this.command = null;

        this.child = {
            on: (event, listener) => {
                switch (event) {
                    case 'error':
                        {
                            this.onError = listener;
                            break;
                        }
                    case 'exit':
                        {
                            this.onExit = listener;
                            break;
                        }
                }
            },
            stdout: { pipe: dest => this.onStdoutPipe(dest) },
            stderr: { pipe: dest => this.onStderrPipe(dest) }
        };
    }

    getChildProcess() {
        return {
            exec: command => {
                this.command = command;
                return this.child;
            }
        };
    }
}

test('success', (() => {
    var _ref = _asyncToGenerator(function* (t) {
        const mockChildProcess = new MockChildProcess();
        const command = new Command(mockChildProcess.getChildProcess());
        const p = command.exec('hoge');

        t.true(mockChildProcess.command === 'hoge');
        mockChildProcess.onExit(0);
        yield p;
    });

    return function (_x) {
        return _ref.apply(this, arguments);
    };
})());

test('child error', (() => {
    var _ref2 = _asyncToGenerator(function* (t) {
        const err = new Error();
        let isThrow = false;

        const mockChildProcess = new MockChildProcess();
        const command = new Command(mockChildProcess.getChildProcess());
        const p = command.exec('hoge').catch(function (e) {
            isThrow = true;
            t.true(e === err);
        });

        t.true(mockChildProcess.command === 'hoge');
        mockChildProcess.onError(err);
        yield p;
        t.true(isThrow);
    });

    return function (_x2) {
        return _ref2.apply(this, arguments);
    };
})());

test('child failed exit', (() => {
    var _ref3 = _asyncToGenerator(function* (t) {
        const err = new Error();
        let isThrow = false;
        let isStdout = false;
        let isStderr = false;

        const mockChildProcess = new MockChildProcess();
        const command = new Command(mockChildProcess.getChildProcess());
        const p = command.exec('hoge').catch(function (e) {
            isThrow = true;
            t.true(e.toString() === 'Error: error \'hoge\' is failed. 1');
        });

        mockChildProcess.onStdoutPipe = function () {
            isStdout = true;
        };
        mockChildProcess.onStderrPipe = function () {
            isStderr = true;
        };

        t.true(mockChildProcess.command === 'hoge');
        mockChildProcess.onExit(1);
        yield p;
        t.true(isThrow);
        t.true(isStdout);
        t.true(isStderr);
    });

    return function (_x3) {
        return _ref3.apply(this, arguments);
    };
})());
//# sourceMappingURL=command.test.js.map