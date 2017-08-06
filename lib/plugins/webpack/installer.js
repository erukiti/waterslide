'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = require('../../waterslide'),
    utils = _require.utils,
    getConfig = _require.getConfig;

var config = getConfig();

var WebpackInstaller = function () {
    function WebpackInstaller(operator) {
        _classCallCheck(this, WebpackInstaller);

        this.operator = operator;
        this.values = config.getLocal('webpack') || { rules: [] };
    }

    _createClass(WebpackInstaller, [{
        key: 'addLoader',
        value: function addLoader(test, use) {
            var _this = this;

            var found = this.values.rules.findIndex(function (value) {
                return value.test === test;
            });
            if (found !== -1) {
                use.forEach(function (_ref) {
                    var loader = _ref.loader,
                        options = _ref.options;

                    if (!_this.values.rules[found].use.find(function (value) {
                        return value.loader === loader;
                    })) {
                        _this.values.rules[found].use.push({ loader: loader, options: options, exclude: 'node_modules' });
                    }
                });

                return;
            }
            this.values.rules.push({ test: test, use: use });
            getConfig().writeLocal('webpack', this.values);
        }
    }, {
        key: 'install',
        value: function () {
            var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                var jsInstaller;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                this.operator.addBuilder('webpack');
                                _context.next = 3;
                                return this.operator.getInstaller('js');

                            case 3:
                                jsInstaller = _context.sent;

                                jsInstaller.addDevPackage('webpack');
                                jsInstaller.addDevPackage('babel-loader');

                            case 6:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function install() {
                return _ref2.apply(this, arguments);
            }

            return install;
        }()
    }], [{
        key: 'getInstaller',
        value: function getInstaller(operator) {
            return new this(operator);
        }
    }]);

    return WebpackInstaller;
}();

module.exports = WebpackInstaller;
//# sourceMappingURL=installer.js.map