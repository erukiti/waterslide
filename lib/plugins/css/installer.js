'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fs = require('fs');
var path = require('path');

var _require = require('../../waterslide'),
    utils = _require.utils;

var CssInstaller = function () {
    function CssInstaller(operator) {
        _classCallCheck(this, CssInstaller);

        this.operator = operator;
    }

    _createClass(CssInstaller, [{
        key: 'install',
        value: function () {
            var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                var helpText, jsInstaller, webpackInstaller;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                helpText = fs.readFileSync(path.join(__dirname, 'help.txt'));

                                this.operator.setInfo('css', helpText);

                                _context.next = 4;
                                return this.operator.getInstaller('js');

                            case 4:
                                jsInstaller = _context.sent;

                                jsInstaller.addDevPackage('css-loader');
                                jsInstaller.addDevPackage('style-loader');
                                jsInstaller.addDevPackage('url-loader');
                                jsInstaller.addDevPackage('file-loader');

                                _context.next = 11;
                                return this.operator.getInstaller('webpack');

                            case 11:
                                webpackInstaller = _context.sent;

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

                            case 17:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function install() {
                return _ref.apply(this, arguments);
            }

            return install;
        }()
    }], [{
        key: 'getInstaller',
        value: function getInstaller(operator) {
            if (utils.checkExistsNpm('css-loader')) {
                return null;
            }
            return new this(operator);
        }
    }]);

    return CssInstaller;
}();

module.exports = CssInstaller;
//# sourceMappingURL=installer.js.map