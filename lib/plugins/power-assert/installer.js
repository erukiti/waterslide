'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const { utils } = require('../../waterslide');

class PowerAssertInstaller {
    constructor(operator) {
        this.operator = operator;
    }

    static getInstaller(operator) {
        if (utils.checkExistsNpm('power-assert')) {
            return null;
        }
        return new this(operator);
    }

    install() {
        var _this = this;

        return _asyncToGenerator(function* () {
            const babelInstaller = yield _this.operator.getInstaller('babel');
            babelInstaller.addPreset('babel-preset-power-assert');

            const jsInstaller = yield _this.operator.getInstaller('js');
            jsInstaller.addDevPackage('babel-preset-power-assert');
            jsInstaller.addDevPackage('power-assert');
        })();
    }
}

module.exports = PowerAssertInstaller;
//# sourceMappingURL=installer.js.map