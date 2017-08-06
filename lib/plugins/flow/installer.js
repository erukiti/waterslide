'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fs = require('fs');
var path = require('path');

var _require = require('../../waterslide'),
    utils = _require.utils;

var FlowInstaller = function () {
    function FlowInstaller(operator) {
        _classCallCheck(this, FlowInstaller);

        this.operator = operator;
    }

    _createClass(FlowInstaller, [{
        key: 'install',
        value: function () {
            var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                var jsInstaller, babelInstaller, conf;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.operator.getInstaller('js');

                            case 2:
                                jsInstaller = _context.sent;

                                jsInstaller.addDevPackage('flow-bin');
                                jsInstaller.addDevPackage('flow-typed');
                                jsInstaller.addDevPackage('babel-plugin-transform-flow-strip-types');

                                _context.next = 8;
                                return this.operator.getInstaller('babel');

                            case 8:
                                babelInstaller = _context.sent;

                                babelInstaller.addPlugin('transform-flow-strip-types');

                                // const eslintInstaller = await this.operator.getInstaller('eslint')
                                // eslintInstaller.


                                conf = fs.readFileSync(path.join(__dirname, 'flowconfig')).toString();
                                _context.next = 13;
                                return this.operator.writeFile('.flowconfig', conf);

                            case 13:
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
        value: function () {
            var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(operator) {
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.t0 = utils.checkExistsNpm('flow-bin');

                                if (_context2.t0) {
                                    _context2.next = 5;
                                    break;
                                }

                                _context2.next = 4;
                                return operator.checkExists('.flowconfig');

                            case 4:
                                _context2.t0 = _context2.sent;

                            case 5:
                                if (!_context2.t0) {
                                    _context2.next = 7;
                                    break;
                                }

                                return _context2.abrupt('return', null);

                            case 7:
                                return _context2.abrupt('return', new this(operator));

                            case 8:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function getInstaller(_x) {
                return _ref2.apply(this, arguments);
            }

            return getInstaller;
        }()
    }]);

    return FlowInstaller;
}();

module.exports = FlowInstaller;
//# sourceMappingURL=installer.js.map