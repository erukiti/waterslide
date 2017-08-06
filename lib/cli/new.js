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

var setupProject = function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(cliUtils, argv) {
        var projectType, projectDir, projectName, setup, parseOpt, noUse, envs, plugin, Klass, obj, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, name;

        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        projectType = argv.projectType;


                        cliUtils.message('create a new project of ' + projectType);

                        projectDir = null;
                        projectName = null;


                        if (argv.projectDir) {
                            projectDir = argv.projectDir;
                            if (projectDir.indexOf('/') !== -1 || projectDir === '.' || projectDir === '..') {
                                cliUtils.error('invalid projectDir.');
                                process.exit(1);
                            }

                            projectName = projectDir;
                            fs.mkdirSync(projectDir);
                            process.chdir(projectDir);
                            config.startLocal();
                        } else {
                            projectName = generateName();
                            projectDir = projectName.toLowerCase().replace(' ', '-');
                            fs.mkdirSync(projectDir);
                            cliUtils.message('directory \x1B[32m' + projectDir + '\x1B[m was created.');
                            process.chdir(projectDir);
                            config.startLocal();
                            config.writeLocal('sillyname', projectDir);
                        }

                        setup = new Setup(cliUtils);

                        setup.setProjectDir(projectDir);

                        parseOpt = function parseOpt(name) {
                            if (!argv[name]) {
                                return [];
                            } else if (typeof argv[name] === 'string') {
                                return [argv[name]];
                            } else {
                                return argv[name];
                            }
                        };

                        noUse = parseOpt('noUse');

                        setup.setNoUse(noUse);

                        setup.setOpt(parseOpt('opt'));
                        setup.setNoOpt(parseOpt('noOpt'));

                        envs = parseOpt('use').filter(function (v) {
                            return !noUse.includes(v);
                        });


                        if (!setup.operator.getNoOpt().includes('recommend')) {
                            ['editorconfig', 'git'].filter(function (v) {
                                return !noUse.includes(v);
                            }).forEach(function (v) {
                                envs.push(v);
                            });
                        }

                        plugin = new Plugin();
                        Klass = plugin.requireProject(projectType);
                        obj = new Klass(setup.operator);
                        _iteratorNormalCompletion = true;
                        _didIteratorError = false;
                        _iteratorError = undefined;
                        _context.prev = 20;
                        _iterator = envs[Symbol.iterator]();

                    case 22:
                        if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                            _context.next = 29;
                            break;
                        }

                        name = _step.value;
                        _context.next = 26;
                        return setup.operator.getInstaller(name);

                    case 26:
                        _iteratorNormalCompletion = true;
                        _context.next = 22;
                        break;

                    case 29:
                        _context.next = 35;
                        break;

                    case 31:
                        _context.prev = 31;
                        _context.t0 = _context['catch'](20);
                        _didIteratorError = true;
                        _iteratorError = _context.t0;

                    case 35:
                        _context.prev = 35;
                        _context.prev = 36;

                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }

                    case 38:
                        _context.prev = 38;

                        if (!_didIteratorError) {
                            _context.next = 41;
                            break;
                        }

                        throw _iteratorError;

                    case 41:
                        return _context.finish(38);

                    case 42:
                        return _context.finish(35);

                    case 43:
                        _context.next = 45;
                        return obj.install();

                    case 45:
                        _context.next = 47;
                        return setup.install().catch(function (e) {
                            return console.dir(e);
                        });

                    case 47:

                        cliUtils.message();
                        cliUtils.message('  project \x1B[32m' + projectDir + '\x1B[m was created.');
                        cliUtils.message('  see. \x1B[36m' + projectDir + '/README.md\x1B[m');

                    case 50:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined, [[20, 31, 35, 43], [36,, 38, 42]]);
    }));

    return function setupProject(_x, _x2) {
        return _ref.apply(this, arguments);
    };
}();

var newCommand = function newCommand() {
    return {
        command: 'new <projectType> [projectDir]',
        describe: 'create a new project',
        builder: function builder(yargs) {
            yargs.option('use', {
                describe: 'use install plugin',
                type: 'string'
            }).option('no-use', {
                describe: 'disable install plugin',
                type: 'string'
            }).option('opt', {
                describe: 'set option',
                type: 'string'
            }).option('no-opt', {
                describe: 'disable option',
                type: 'string'
            });
        },
        handler: function handler(argv) {
            var cliUtils = new CliUtils({ verbose: argv.verbose, debug: argv.debug });
            setupProject(cliUtils, argv).catch(function (e) {
                return console.dir(e);
            });
        }
    };
};

module.exports = newCommand;
//# sourceMappingURL=new.js.map