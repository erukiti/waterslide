'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fs = require('fs');
var path = require('path');

var _require = require('../../waterslide'),
    utils = _require.utils;

var TypescriptInstaller = function () {
    function TypescriptInstaller(operator) {
        _classCallCheck(this, TypescriptInstaller);

        this.operator = operator;
    }

    _createClass(TypescriptInstaller, [{
        key: 'install',
        value: function () {
            var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
                var _this = this;

                var jsInstaller, webpackInstaller, content;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.operator.getInstaller('js');

                            case 2:
                                jsInstaller = _context2.sent;

                                jsInstaller.addDevPackage('ts-loader');
                                jsInstaller.addDevPackage('typescript');

                                _context2.next = 7;
                                return this.operator.getInstaller('webpack');

                            case 7:
                                webpackInstaller = _context2.sent;

                                webpackInstaller.addLoader('\\.tsx?$', [{ loader: 'babel-loader' }, { loader: 'ts-loader' }]);

                                content = fs.readFileSync(path.join(__dirname, 'tsconfig.json')).toString();

                                this.operator.postInstall(_asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                                    return regeneratorRuntime.wrap(function _callee$(_context) {
                                        while (1) {
                                            switch (_context.prev = _context.next) {
                                                case 0:
                                                    _context.next = 2;
                                                    return _this.operator.writeFile('tsconfig.json', content);

                                                case 2:
                                                case 'end':
                                                    return _context.stop();
                                            }
                                        }
                                    }, _callee, _this);
                                })));

                            case 11:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function install() {
                return _ref.apply(this, arguments);
            }

            return install;
        }()
    }], [{
        key: 'getInstaller',
        value: function () {
            var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(operator) {
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                if (!(utils.checkExistsNpm('ts-loader') || operator.checkExists('tsconfig.json'))) {
                                    _context3.next = 2;
                                    break;
                                }

                                return _context3.abrupt('return', null);

                            case 2:
                                return _context3.abrupt('return', new this(operator));

                            case 3:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function getInstaller(_x) {
                return _ref3.apply(this, arguments);
            }

            return getInstaller;
        }()
    }]);

    return TypescriptInstaller;
}();

module.exports = TypescriptInstaller;
//# sourceMappingURL=installer.js.map