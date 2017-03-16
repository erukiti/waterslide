'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const fs = require('fs');
const path = require('path');

const { utils } = require('../../waterslide');

class AvaInstaller {
    constructor(operator) {
        this.operator = operator;
    }

    static getInstaller(operator) {
        var _this = this;

        return _asyncToGenerator(function* () {
            if (utils.checkExistsNpm('ava') || (yield operator.checkExists('src/hoge.test.js'))) {
                return null;
            }

            return new _this(operator);
        })();
    }

    install() {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            const testJs = fs.readFileSync(path.join(__dirname, 'sample.test.js'));

            const jsInstaller = yield _this2.operator.getInstaller('js');
            jsInstaller.addDevPackage('ava');
            _this2.operator.addTester('ava');
            yield _this2.operator.writeFile('src/sample.test.js', testJs);
        })();
    }
}

module.exports = AvaInstaller;
//# sourceMappingURL=installer.js.map