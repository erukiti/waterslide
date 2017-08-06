'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fs = require('fs');
var path = require('path');

var _require = require('../../waterslide'),
    utils = _require.utils;

var MochaInstaller = function () {
    function MochaInstaller(operator) {
        _classCallCheck(this, MochaInstaller);

        this.operator = operator;
    }

    _createClass(MochaInstaller, [{
        key: 'install',
        value: function () {
            var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                var mochaOptsText, testJs, jsInstaller;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                mochaOptsText = fs.readFileSync(path.join(__dirname, 'mocha.opts'));
                                testJs = fs.readFileSync(path.join(__dirname, 'sample.js'));
                                _context.next = 4;
                                return this.operator.getInstaller('power-assert');

                            case 4:
                                _context.next = 6;
                                return this.operator.getInstaller('js');

                            case 6:
                                jsInstaller = _context.sent;

                                jsInstaller.addDevPackage('mocha');
                                this.operator.addTester('mocha');

                                _context.next = 11;
                                return this.operator.writeFile('test/mocha.opts', mochaOptsText);

                            case 11:
                                _context.next = 13;
                                return this.operator.writeFile('test/test.js', testJs);

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
                                _context2.t2 = utils.checkExistsNpm('mocha');

                                if (_context2.t2) {
                                    _context2.next = 5;
                                    break;
                                }

                                _context2.next = 4;
                                return operator.checkExists('test/mocha.opts');

                            case 4:
                                _context2.t2 = _context2.sent;

                            case 5:
                                _context2.t1 = _context2.t2;

                                if (_context2.t1) {
                                    _context2.next = 10;
                                    break;
                                }

                                _context2.next = 9;
                                return operator.checkExists('test/test-helper.js');

                            case 9:
                                _context2.t1 = _context2.sent;

                            case 10:
                                _context2.t0 = _context2.t1;

                                if (_context2.t0) {
                                    _context2.next = 15;
                                    break;
                                }

                                _context2.next = 14;
                                return operator.checkExists('test/test.js');

                            case 14:
                                _context2.t0 = _context2.sent;

                            case 15:
                                if (!_context2.t0) {
                                    _context2.next = 17;
                                    break;
                                }

                                return _context2.abrupt('return', null);

                            case 17:
                                return _context2.abrupt('return', new this(operator));

                            case 18:
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

    return MochaInstaller;
}();

module.exports = MochaInstaller;
//# sourceMappingURL=installer.js.map