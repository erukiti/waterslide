'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var test = require('ava');
var fs = require('fs');
var path = require('path');

var Fsio = require('./fsio');

var temp = '';

test.before(function (t) {
    temp = fs.mkdtempSync('/tmp/ws-');
});

test.beforeEach(function (t) {
    process.chdir(fs.mkdtempSync(temp + '/fsio-'));
});

// Must use test.serial for process.chdir.

test.serial('new file', function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(t) {
        var fsio;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        fsio = new Fsio();
                        _context.next = 3;
                        return fsio.writeFile('test', 'hoge');

                    case 3:

                        t.true(fs.readFileSync('test').toString() === 'hoge');

                    case 4:
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

test.serial('new file with cache', function () {
    var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(t) {
        var fsio;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        fsio = new Fsio();

                        fsio.cache['test'] = new Buffer('hoge');
                        _context2.next = 4;
                        return fsio.writeFile('test', 'hoge');

                    case 4:

                        t.throws(function () {
                            return fs.readFileSync('test');
                        }, 'ENOENT: no such file or directory, open \'test\'');

                    case 5:
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

test.serial('new file with mode', function () {
    var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(t) {
        var fsio;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        fsio = new Fsio();
                        _context3.next = 3;
                        return fsio.writeFile('test', 'hoge', { mode: 511 });

                    case 3:

                        t.true(fs.readFileSync('test').toString() === 'hoge');

                    case 4:
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

test.serial('new file with already exists', function (t) {
    fs.writeFileSync('test', 'foo');

    var fsio = new Fsio();
    t.throws(fsio.writeFile('test', 'hoge'), 'EEXIST: file already exists, open \'test\'');
    t.true(fs.readFileSync('test').toString() === 'foo');
});

test.serial('new file with mkdir', function () {
    var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(t) {
        var filename, fsio;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        filename = 'hoge/fuga/test';
                        fsio = new Fsio();
                        _context4.next = 4;
                        return fsio.writeFile(filename, 'hoge');

                    case 4:

                        t.true(fs.readFileSync(filename).toString() === 'hoge');

                    case 5:
                    case 'end':
                        return _context4.stop();
                }
            }
        }, _callee4, undefined);
    }));

    return function (_x4) {
        return _ref4.apply(this, arguments);
    };
}());

test.serial('new file with mkdir failed', function () {
    var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(t) {
        var filename, fsio;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
                switch (_context5.prev = _context5.next) {
                    case 0:
                        fs.writeFileSync('hoge', 'foo');

                        filename = 'hoge/fuga/test';
                        fsio = new Fsio();

                        t.throws(fsio.writeFile(filename, 'hoge'), 'ENOTDIR: not a directory, mkdir \'' + path.join(process.cwd(), path.dirname(filename)) + '\'');

                    case 4:
                    case 'end':
                        return _context5.stop();
                }
            }
        }, _callee5, undefined);
    }));

    return function (_x5) {
        return _ref5.apply(this, arguments);
    };
}());

test.serial('read file', function () {
    var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(t) {
        var fsio, content;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) {
                switch (_context6.prev = _context6.next) {
                    case 0:
                        fs.writeFileSync('test', 'hoge');

                        fsio = new Fsio();
                        _context6.next = 4;
                        return fsio.readFile('test');

                    case 4:
                        content = _context6.sent;

                        t.true(content.toString() === 'hoge');

                    case 6:
                    case 'end':
                        return _context6.stop();
                }
            }
        }, _callee6, undefined);
    }));

    return function (_x6) {
        return _ref6.apply(this, arguments);
    };
}());

test.serial('read file with error', function () {
    var _ref7 = _asyncToGenerator(regeneratorRuntime.mark(function _callee7(t) {
        var fsio;
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
            while (1) {
                switch (_context7.prev = _context7.next) {
                    case 0:
                        fsio = new Fsio();

                        t.throws(fsio.readFile('test'), 'ENOENT: no such file or directory, open \'test\'');

                    case 2:
                    case 'end':
                        return _context7.stop();
                }
            }
        }, _callee7, undefined);
    }));

    return function (_x7) {
        return _ref7.apply(this, arguments);
    };
}());

test.serial('cheek file, not exists', function () {
    var _ref8 = _asyncToGenerator(regeneratorRuntime.mark(function _callee8(t) {
        var fsio;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
            while (1) {
                switch (_context8.prev = _context8.next) {
                    case 0:
                        fsio = new Fsio();
                        _context8.t0 = t;
                        _context8.next = 4;
                        return fsio.checkExists('test');

                    case 4:
                        _context8.t1 = _context8.sent;

                        _context8.t0.false.call(_context8.t0, _context8.t1);

                    case 6:
                    case 'end':
                        return _context8.stop();
                }
            }
        }, _callee8, undefined);
    }));

    return function (_x8) {
        return _ref8.apply(this, arguments);
    };
}());

test.serial('cheek file, not exists', function () {
    var _ref9 = _asyncToGenerator(regeneratorRuntime.mark(function _callee9(t) {
        var fsio;
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
            while (1) {
                switch (_context9.prev = _context9.next) {
                    case 0:
                        fs.writeFileSync('test', 'hoge');
                        fsio = new Fsio();
                        _context9.t0 = t;
                        _context9.next = 5;
                        return fsio.checkExists('test');

                    case 5:
                        _context9.t1 = _context9.sent;

                        _context9.t0.true.call(_context9.t0, _context9.t1);

                    case 7:
                    case 'end':
                        return _context9.stop();
                }
            }
        }, _callee9, undefined);
    }));

    return function (_x9) {
        return _ref9.apply(this, arguments);
    };
}());
//# sourceMappingURL=fsio.test.js.map