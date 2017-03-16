'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const fs = require('fs');
const path = require('path');

const { utils } = require('../../waterslide');

class CssInstaller {
    constructor(operator) {
        this.operator = operator;
    }

    static getInstaller(operator) {
        if (utils.checkExistsNpm('css-loader')) {
            return null;
        }
        return new this(operator);
    }

    install() {
        var _this = this;

        return _asyncToGenerator(function* () {
            const helpText = fs.readFileSync(path.join(__dirname, 'help.txt'));
            _this.operator.setInfo('css', helpText);

            const jsInstaller = yield _this.operator.getInstaller('js');
            jsInstaller.addDevPackage('css-loader');
            jsInstaller.addDevPackage('style-loader');
            jsInstaller.addDevPackage('url-loader');
            jsInstaller.addDevPackage('file-loader');

            const webpackInstaller = yield _this.operator.getInstaller('webpack');
            webpackInstaller.addLoader('\\.css$', [{ loader: 'style-loader' }, { loader: 'css-loader' }]);
            webpackInstaller.addLoader('\\.woff2?(\\?v=\\d+\\.\\d+\\.\\d+)?$', [{
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    mimetype: 'application/font-woff',
                    name: '[name].[ext]'
                }
            }]);
            webpackInstaller.addLoader('\\.ttf(\\?v=\\d+\\.\\d+\\.\\d+)?$', [{
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    mimetype: 'application/octet-stream',
                    name: '[name].[ext]'
                }
            }]);
            webpackInstaller.addLoader('\\.eot(\\?v=\\d+\\.\\d+\\.\\d+)?$', [{
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]'
                }
            }]);
            webpackInstaller.addLoader('\\.svg(\\?v=\\d+\\.\\d+\\.\\d+)?$', [{
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    mimetype: 'image/svg+xml',
                    name: '[name].[ext]'
                }
            }]);
        })();
    }
}

module.exports = CssInstaller;
//# sourceMappingURL=installer.js.map