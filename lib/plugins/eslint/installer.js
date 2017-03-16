'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const fs = require('fs');
const path = require('path');

const { utils } = require('../../waterslide');

class EslintInstaller {
    constructor(operator) {
        this.operator = operator;
    }

    static getInstaller(operator) {
        var _this = this;

        return _asyncToGenerator(function* () {
            if (utils.checkExistsNpm('eslint') || (yield operator.checkExists('.eslintignore')) || (yield operator.checkExists('.eslintrc.json'))) {
                return null;
            }

            return new _this(operator);
        })();
    }

    install() {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            const eslintignore = fs.readFileSync(path.join(__dirname, 'eslintignore'));
            const eslintrc = fs.readFileSync(path.join(__dirname, 'eslintrc.json'));

            const jsInstaller = yield _this2.operator.getInstaller('js');
            jsInstaller.addDevPackage('eslint');
            jsInstaller.addDevPackage('babel-eslint');
            jsInstaller.addDevPackage('espower-babel');
            _this2.operator.addTester('eslint');

            yield _this2.operator.writeFile('.eslintignore', eslintignore);
            yield _this2.operator.writeFile('.eslintrc.json', eslintrc);
        })();
    }
}

module.exports = EslintInstaller;
//# sourceMappingURL=installer.js.map