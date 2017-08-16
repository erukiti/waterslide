'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const test = require('ava');
const fs = require('fs');
const path = require('path');

const Fsio = require('./fsio');

let temp = '';

test.before(t => {
    temp = fs.mkdtempSync('/tmp/ws-');
});

test.beforeEach(t => {
    process.chdir(fs.mkdtempSync(`${temp}/fsio-`));
});

// Must use test.serial for process.chdir.

test.serial('new file', (() => {
    var _ref = _asyncToGenerator(function* (t) {
        const fsio = new Fsio();
        yield fsio.writeFile('test', 'hoge');

        t.true(fs.readFileSync('test').toString() === 'hoge');
    });

    return function (_x) {
        return _ref.apply(this, arguments);
    };
})());

test.serial('new file with cache', (() => {
    var _ref2 = _asyncToGenerator(function* (t) {
        const fsio = new Fsio();
        fsio.cache['test'] = new Buffer('hoge');
        yield fsio.writeFile('test', 'hoge');

        t.throws(function () {
            return fs.readFileSync('test');
        }, 'ENOENT: no such file or directory, open \'test\'');
    });

    return function (_x2) {
        return _ref2.apply(this, arguments);
    };
})());

test.serial('new file with mode', (() => {
    var _ref3 = _asyncToGenerator(function* (t) {
        const fsio = new Fsio();
        yield fsio.writeFile('test', 'hoge', { mode: 0o777 });

        t.true(fs.readFileSync('test').toString() === 'hoge');
    });

    return function (_x3) {
        return _ref3.apply(this, arguments);
    };
})());

test.serial('new file with already exists', t => {
    fs.writeFileSync('test', 'foo');

    const fsio = new Fsio();
    t.throws(fsio.writeFile('test', 'hoge'), 'EEXIST: file already exists, open \'test\'');
    t.true(fs.readFileSync('test').toString() === 'foo');
});

test.serial('new file with mkdir', (() => {
    var _ref4 = _asyncToGenerator(function* (t) {
        const filename = 'hoge/fuga/test';
        const fsio = new Fsio();
        yield fsio.writeFile(filename, 'hoge');

        t.true(fs.readFileSync(filename).toString() === 'hoge');
    });

    return function (_x4) {
        return _ref4.apply(this, arguments);
    };
})());

test.serial('new file with mkdir failed', (() => {
    var _ref5 = _asyncToGenerator(function* (t) {
        fs.writeFileSync('hoge', 'foo');

        const filename = 'hoge/fuga/test';
        const fsio = new Fsio();
        t.throws(fsio.writeFile(filename, 'hoge'), `ENOTDIR: not a directory, mkdir '${path.join(process.cwd(), path.dirname(filename))}'`);
    });

    return function (_x5) {
        return _ref5.apply(this, arguments);
    };
})());

test.serial('read file', (() => {
    var _ref6 = _asyncToGenerator(function* (t) {
        fs.writeFileSync('test', 'hoge');

        const fsio = new Fsio();
        const content = yield fsio.readFile('test');
        t.true(content.toString() === 'hoge');
    });

    return function (_x6) {
        return _ref6.apply(this, arguments);
    };
})());

test.serial('read file with error', (() => {
    var _ref7 = _asyncToGenerator(function* (t) {
        const fsio = new Fsio();
        t.throws(fsio.readFile('test'), 'ENOENT: no such file or directory, open \'test\'');
    });

    return function (_x7) {
        return _ref7.apply(this, arguments);
    };
})());

test.serial('cheek file, not exists', (() => {
    var _ref8 = _asyncToGenerator(function* (t) {
        const fsio = new Fsio();
        t.false((yield fsio.checkExists('test')));
    });

    return function (_x8) {
        return _ref8.apply(this, arguments);
    };
})());

test.serial('cheek file, not exists', (() => {
    var _ref9 = _asyncToGenerator(function* (t) {
        fs.writeFileSync('test', 'hoge');
        const fsio = new Fsio();
        t.true((yield fsio.checkExists('test')));
    });

    return function (_x9) {
        return _ref9.apply(this, arguments);
    };
})());
//# sourceMappingURL=fsio.test.js.map