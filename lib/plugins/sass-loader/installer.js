'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const { utils } = require('../../waterslide');

class SassloaderInstaller {
    constructor(operator) {
        this.operator = operator;
    }

    static getInstaller(operator) {
        if (utils.checkExistsNpm('sass-loader')) {
            return;
        }
        return new this(operator);
    }

    install() {
        var _this = this;

        return _asyncToGenerator(function* () {
            yield _this.operator.getInstaller('css');

            const jsInstaller = yield _this.operator.getInstaller('js');
            jsInstaller.addDevPackage('sass-loader');
            jsInstaller.addDevPackage('node-sass');

            const webpackInstaller = yield _this.operator.getInstaller('webpack');
            webpackInstaller.addLoader('\\.scss$', [{ loader: 'style-loader' }, { loader: 'css-loader' }, { loader: 'sass-loader' }]);
        })();
    }
}

module.exports = SassloaderInstaller;
//# sourceMappingURL=installer.js.map