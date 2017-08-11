'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var test = require('ava');

var Command = require('./command');

var MockChildProcess = function () {
    function MockChildProcess() {
        var _this = this;

        _classCallCheck(this, MockChildProcess);

        this.onError = null;
        this.onExit = null;
        this.onStdoutPipe = null;
        this.onStderrPipe = null;
        this.command = null;

        this.child = {
            on: function on(event, listener) {
                switch (event) {
                    case 'error':
                        {
                            _this.onError = listener;
                            break;
                        }
                    case 'exit':
                        {
                            _this.onExit = listener;
                            break;
                        }
                }
            },
            stdout: { pipe: function pipe(dest) {
                    return _this.onStdoutPipe(dest);
                } },
            stderr: { pipe: function pipe(dest) {
                    return _this.onStderrPipe(dest);
                } }
        };
    }

    _createClass(MockChildProcess, [{
        key: 'getChildProcess',
        value: function getChildProcess() {
            var _this2 = this;

            return {
                exec: function exec(command) {
                    _this2.command = command;
                    return _this2.child;
                }
            };
        }
    }]);

    return MockChildProcess;
}();

test('success', function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(t) {
        var mockChildProcess, command, p;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        mockChildProcess = new MockChildProcess();
                        command = new Command(mockChildProcess.getChildProcess());
                        p = command.exec('hoge');


                        t.true(mockChildProcess.command === 'hoge');
                        mockChildProcess.onExit(0);
                        _context.next = 7;
                        return p;

                    case 7:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function (_x) {
        return _ref.apply(this, arguments);
    };
}());

test('child error', function () {
    var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(t) {
        var err, isThrow, mockChildProcess, command, p;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        err = new Error();
                        isThrow = false;
                        mockChildProcess = new MockChildProcess();
                        command = new Command(mockChildProcess.getChildProcess());
                        p = command.exec('hoge').catch(function (e) {
                            isThrow = true;
                            t.true(e === err);
                        });


                        t.true(mockChildProcess.command === 'hoge');
                        mockChildProcess.onError(err);
                        _context2.next = 9;
                        return p;

                    case 9:
                        t.true(isThrow);

                    case 10:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, undefined);
    }));

    return function (_x2) {
        return _ref2.apply(this, arguments);
    };
}());

test('child failed exit', function () {
    var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(t) {
        var err, isThrow, isStdout, isStderr, mockChildProcess, command, p;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        err = new Error();
                        isThrow = false;
                        isStdout = false;
                        isStderr = false;
                        mockChildProcess = new MockChildProcess();
                        command = new Command(mockChildProcess.getChildProcess());
                        p = command.exec('hoge').catch(function (e) {
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
                        _context3.next = 13;
                        return p;

                    case 13:
                        t.true(isThrow);
                        t.true(isStdout);
                        t.true(isStderr);

                    case 16:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, undefined);
    }));

    return function (_x3) {
        return _ref3.apply(this, arguments);
    };
}());
//# sourceMappingURL=command.test.js.map