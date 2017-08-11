'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = require('../../waterslide'),
    utils = _require.utils;

var SassloaderInstaller = function () {
    function SassloaderInstaller(operator) {
        _classCallCheck(this, SassloaderInstaller);

        this.operator = operator;
    }

    _createClass(SassloaderInstaller, [{
        key: 'install',
        value: function () {
            var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                var jsInstaller, webpackInstaller;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.operator.getInstaller('css');

                            case 2:
                                _context.next = 4;
                                return this.operator.getInstaller('js');

                            case 4:
                                jsInstaller = _context.sent;

                                jsInstaller.addDevPackage('sass-loader');
                                jsInstaller.addDevPackage('node-sass');

                                _context.next = 9;
                                return this.operator.getInstaller('webpack');

                            case 9:
                                webpackInstaller = _context.sent;

                                webpackInstaller.addLoader('\\.scss$', [{ loader: 'style-loader' }, { loader: 'css-loader' }, { loader: 'sass-loader' }]);

                            case 11:
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
            if (utils.checkExistsNpm('sass-loader')) {
                return;
            }
            return new this(operator);
        }
    }]);

    return SassloaderInstaller;
}();

module.exports = SassloaderInstaller;
//# sourceMappingURL=installer.js.map