'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const fs = require('fs');
const path = require('path');

const { utils } = require('../../waterslide');

class TypescriptInstaller {
    constructor(operator) {
        this.operator = operator;
    }

    static getInstaller(operator) {
        var _this = this;

        return _asyncToGenerator(function* () {
            if (utils.checkExistsNpm('ts-loader') || operator.checkExists('tsconfig.json')) {
                return null;
            }
            return new _this(operator);
        })();
    }

    install() {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            const jsInstaller = yield _this2.operator.getInstaller('js');
            jsInstaller.addDevPackage('ts-loader');
            jsInstaller.addDevPackage('typescript');

            const webpackInstaller = yield _this2.operator.getInstaller('webpack');
            webpackInstaller.addLoader('\\.tsx?$', [{ loader: 'babel-loader' }, { loader: 'ts-loader' }]);

            const content = fs.readFileSync(path.join(__dirname, 'tsconfig.json')).toString();
            _this2.operator.postInstall(_asyncToGenerator(function* () {
                yield _this2.operator.writeFile('tsconfig.json', content);
            }));
        })();
    }

}

module.exports = TypescriptInstaller;
//# sourceMappingURL=installer.js.map