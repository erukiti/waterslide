'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var process = require('process');
var fs = require('fs');

var _require = require('../waterslide'),
    getConfig = _require.getConfig,
    Plugin = _require.Plugin;

var config = getConfig();
var plugin = new Plugin();
var Fsio = require('./fsio');
var Command = require('./command');
var Operator = require('./operator');
var CliUtils = require('../cli/utils');

// FIXME


// export interface Installer {
//     install: () => {},
//     setDirectory?: (path: string, description?: string) => void
// }

var Setup = function () {
    function Setup(cliUtils) {
        _classCallCheck(this, Setup);

        this.fsio = new Fsio();
        this.cliUtils = cliUtils;
        this.command = new Command(require('child_process'), cliUtils);
        this.projectDir = null; // FIXME
        this.installers = {};
        this.generators = {};
        this.noOpt = [];
        this.noUse = [];
        this.isUse = false;

        this.postInstalls = [];

        this.directories = config.getLocal('directories') || {};
        this.entries = config.getLocal('entries') || [];
        this.target = config.getLocal('target');
        this.builders = config.getLocal('builders') || [];
        this.testers = config.getLocal('testers') || {};
        this.opt = config.getLocal('opt') || [];
        this.info = config.getLocal('info') || [];

        this.operator = new Operator(this);

        this.operator.addBuilder('copy');
    }

    _createClass(Setup, [{
        key: 'setProjectDir',
        value: function setProjectDir(name) {
            this.projectDir = name;
        }
    }, {
        key: 'setUse',
        value: function setUse() {
            this.isUse = true;
        }
    }, {
        key: 'setOpt',
        value: function setOpt(opt) {
            if (this.opt.length > 0) {
                this.cliUtils.error('warning: opt is already set.');
            }

            this.opt = opt;
            config.writeLocal('opt', this.opt);
        }
    }, {
        key: 'setNoOpt',
        value: function setNoOpt(noOpt) {
            if (this.noOpt.length > 0) {
                this.cliUtils.error('warning: noOpts is already set.');
            }

            this.noOpt = noOpt;
        }
    }, {
        key: 'setNoUse',
        value: function setNoUse(noUse) {
            if (this.noUse.length > 0) {
                this.cliUtils.error('warning: noUse is already set.');
            }

            this.noUse = noUse;
        }
    }, {
        key: 'install',
        value: function () {
            var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                var _this = this;

                var processed, getNotProcessedKey, notProcessed, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, key;

                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                processed = [];

                                getNotProcessedKey = function getNotProcessedKey() {
                                    return Object.keys(_this.installers).filter(function (key) {
                                        return !processed.includes(key);
                                    });
                                };

                                notProcessed = void 0;

                            case 3:
                                if (!((notProcessed = getNotProcessedKey()).length > 0)) {
                                    _context.next = 33;
                                    break;
                                }

                                _iteratorNormalCompletion = true;
                                _didIteratorError = false;
                                _iteratorError = undefined;
                                _context.prev = 7;
                                _iterator = notProcessed[Symbol.iterator]();

                            case 9:
                                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                                    _context.next = 16;
                                    break;
                                }

                                key = _step.value;
                                _context.next = 13;
                                return this.installers[key].install();

                            case 13:
                                _iteratorNormalCompletion = true;
                                _context.next = 9;
                                break;

                            case 16:
                                _context.next = 22;
                                break;

                            case 18:
                                _context.prev = 18;
                                _context.t0 = _context['catch'](7);
                                _didIteratorError = true;
                                _iteratorError = _context.t0;

                            case 22:
                                _context.prev = 22;
                                _context.prev = 23;

                                if (!_iteratorNormalCompletion && _iterator.return) {
                                    _iterator.return();
                                }

                            case 25:
                                _context.prev = 25;

                                if (!_didIteratorError) {
                                    _context.next = 28;
                                    break;
                                }

                                throw _iteratorError;

                            case 28:
                                return _context.finish(25);

                            case 29:
                                return _context.finish(22);

                            case 30:
                                processed = processed.concat(notProcessed);
                                _context.next = 3;
                                break;

                            case 33:
                                _context.next = 35;
                                return Promise.all(this.postInstalls.map(function (cb) {
                                    return cb();
                                }));

                            case 35:
                                _context.next = 37;
                                return this.command.execAll(function (command) {
                                    return _this.cliUtils.verbose(command);
                                });

                            case 37:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[7, 18, 22, 30], [23,, 25, 29]]);
            }));

            function install() {
                return _ref.apply(this, arguments);
            }

            return install;
        }()
    }]);

    return Setup;
}();

module.exports = Setup;
//# sourceMappingURL=index.js.map