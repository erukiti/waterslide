'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const fs = require('fs');
const path = require('path');

const { utils } = require('../../waterslide');

class MochaInstaller {
    constructor(operator) {
        this.operator = operator;
    }

    static getInstaller(operator) {
        var _this = this;

        return _asyncToGenerator(function* () {
            if (utils.checkExistsNpm('mocha') || (yield operator.checkExists('test/mocha.opts')) || (yield operator.checkExists('test/test-helper.js')) || (yield operator.checkExists('test/test.js'))) {
                return null;
            }

            return new _this(operator);
        })();
    }

    install() {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            const mochaOptsText = fs.readFileSync(path.join(__dirname, 'mocha.opts'));
            const testJs = fs.readFileSync(path.join(__dirname, 'sample.js'));

            yield _this2.operator.getInstaller('power-assert');

            const jsInstaller = yield _this2.operator.getInstaller('js');
            jsInstaller.addDevPackage('mocha');
            jsInstaller.addDevPackage('babel-register');
            _this2.operator.addTester('mocha', './node_modules/.bin/mocha -c test');

            yield _this2.operator.writeFile('test/mocha.opts', mochaOptsText);
            yield _this2.operator.writeFile('test/test.js', testJs);
        })();
    }
}

module.exports = MochaInstaller;
//# sourceMappingURL=installer.js.map