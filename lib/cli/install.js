'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var generateName = require('sillyname');
var process = require('process');
var path = require('path');
var fs = require('fs');

var Setup = require('../setup');
var Plugin = require('../plugin');
var config = require('../config');
var CliUtils = require('./utils');

var install = function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(cliUtils, argv) {
        var setup, parseOpt, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, name, installer;

        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        config.startLocal();

                        setup = new Setup(cliUtils);

                        parseOpt = function parseOpt(name) {
                            if (!argv[name]) {
                                return [];
                            } else if (typeof argv[name] === 'string') {
                                return [argv[name]];
                            } else {
                                return argv[name];
                            }
                        };

                        setup.setOpt(parseOpt('opt'));
                        setup.setNoOpt(parseOpt('noOpt'));

                        _iteratorNormalCompletion = true;
                        _didIteratorError = false;
                        _iteratorError = undefined;
                        _context.prev = 8;
                        _iterator = argv.pluginNames[Symbol.iterator]();

                    case 10:
                        if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                            _context.next = 19;
                            break;
                        }

                        name = _step.value;
                        _context.next = 14;
                        return setup.operator.getInstaller(name);

                    case 14:
                        installer = _context.sent;

                        if (!installer) {
                            cliUtils.error(name + ' is not installed. already installed or installing file is already exists.');
                        }

                    case 16:
                        _iteratorNormalCompletion = true;
                        _context.next = 10;
                        break;

                    case 19:
                        _context.next = 25;
                        break;

                    case 21:
                        _context.prev = 21;
                        _context.t0 = _context['catch'](8);
                        _didIteratorError = true;
                        _iteratorError = _context.t0;

                    case 25:
                        _context.prev = 25;
                        _context.prev = 26;

                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }

                    case 28:
                        _context.prev = 28;

                        if (!_didIteratorError) {
                            _context.next = 31;
                            break;
                        }

                        throw _iteratorError;

                    case 31:
                        return _context.finish(28);

                    case 32:
                        return _context.finish(25);

                    case 33:
                        _context.next = 35;
                        return setup.install().catch(function (e) {
                            return console.dir(e);
                        });

                    case 35:
                        cliUtils.message('install finish.');

                    case 36:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined, [[8, 21, 25, 33], [26,, 28, 32]]);
    }));

    return function install(_x, _x2) {
        return _ref.apply(this, arguments);
    };
}();

var installCommand = function installCommand() {
    return {
        command: 'install [options] <pluginNames...>',
        describe: 'install to project',
        builder: function builder(yargs) {
            yargs.option('opt', {
                describe: 'set option',
                type: 'string'
            }).option('no-opt', {
                describe: 'disable option',
                type: 'string'
            });
        },
        handler: function handler(argv) {
            if (!config.isExists()) {
                console.log('If you want to install, you need to setup waterslide');
                process.exit(1);
            }

            var cliUtils = new CliUtils({ verbose: argv.verbose, debug: argv.debug });
            install(cliUtils, argv).catch(function (e) {
                return console.dir(e);
            });
        }
    };
};

module.exports = installCommand;
//# sourceMappingURL=install.js.map