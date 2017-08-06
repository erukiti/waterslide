'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BabelInstaller = function () {
    function BabelInstaller(operator) {
        _classCallCheck(this, BabelInstaller);

        this.operator = operator;

        this.values = JSON.parse(operator.readFileSync('.babelrc')) || { presets: [], plugins: [] };
    }

    _createClass(BabelInstaller, [{
        key: 'addPreset',
        value: function addPreset(name) {
            if (this.values.presets.includes(name)) {
                return;
            }

            this.values.presets.push(name);
        }
    }, {
        key: 'addPlugin',
        value: function addPlugin(name) {
            if (this.values.plugins.includes(name)) {
                return;
            }

            this.values.plugins.push(name);
        }
    }, {
        key: 'install',
        value: function () {
            var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
                var _this = this;

                var jsInstaller;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return this.operator.getInstaller('js');

                            case 2:
                                jsInstaller = _context2.sent;

                                jsInstaller.addDevPackage('babel-core');
                                jsInstaller.addDevPackage('babel-loader');
                                jsInstaller.addDevPackage('babel-preset-env');
                                this.addPreset('env');

                                this.operator.postInstall(_asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                                    return regeneratorRuntime.wrap(function _callee$(_context) {
                                        while (1) {
                                            switch (_context.prev = _context.next) {
                                                case 0:
                                                    _context.next = 2;
                                                    return _this.operator.writeFile('.babelrc', JSON.stringify(_this.values, null, '  ') + '\n', { isRewritable: true });

                                                case 2:
                                                case 'end':
                                                    return _context.stop();
                                            }
                                        }
                                    }, _callee, _this);
                                })));

                            case 8:
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
        value: function getInstaller(operator) {
            return new this(operator);
        }
    }]);

    return BabelInstaller;
}();

module.exports = BabelInstaller;
//# sourceMappingURL=installer.js.map