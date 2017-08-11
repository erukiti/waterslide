'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var process = require('process');
var path = require('path');
var fs = require('fs');

var Setup = require('../setup');
var Plugin = require('../plugin');
var config = require('../config');
var CliUtils = require('./utils');

var generate = function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(cliUtils, argv) {
        var setup, parseOpt;
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

                        _context.next = 7;
                        return setup.operator.getGenerator(argv.generatorName).generate(argv.args[0]);

                    case 7:
                        _context.next = 9;
                        return setup.install().catch(function (e) {
                            return console.dir(e);
                        });

                    case 9:
                        cliUtils.message('generate finish.');

                    case 10:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function generate(_x, _x2) {
        return _ref.apply(this, arguments);
    };
}();

var generateCommand = function generateCommand() {
    return {
        command: 'generate [options] <generatorName> <args...>',
        describe: 'generate file',
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
                console.log('If you want to generate file, you need to setup waterslide');
                process.exit(1);
            }

            var cliUtils = new CliUtils({ verbose: argv.verbose, debug: argv.debug });
            generate(cliUtils, argv).catch(function (e) {
                return console.dir(e);
            });
        }
    };
};

module.exports = generateCommand;
//# sourceMappingURL=generate.js.map