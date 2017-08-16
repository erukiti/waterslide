'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class ElectronIconInstaller {
    constructor(operator) {
        this.operator = operator;
    }

    static getInstaller(operator) {
        var _this = this;

        return _asyncToGenerator(function* () {
            return new _this(operator);
        })();
    }

    install() {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            _this2.operator.addBuilder('electron-icon');

            const jsInstaller = yield _this2.operator.getInstaller('js');
            jsInstaller.addDevPackage('jimp');
            jsInstaller.addDevPackage('icon-gen');
        })();
    }
}

module.exports = ElectronIconInstaller;
//# sourceMappingURL=installer.js.map