'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = require('../waterslide'),
    getConfig = _require.getConfig,
    Plugin = _require.Plugin;

var Setup = require('./');


var config = getConfig();
var plugin = new Plugin();

var Operator = function () {
    function Operator(setup) {
        _classCallCheck(this, Operator);

        this.setup = setup;
    }

    // FIXME


    _createClass(Operator, [{
        key: 'getOpt',
        value: function getOpt() {
            return this.setup.opt;
        }
    }, {
        key: 'getNoOpt',
        value: function getNoOpt() {
            return this.setup.noOpt;
        }
    }, {
        key: 'getNoUse',
        value: function getNoUse() {
            return this.setup.noUse;
        }

        /**
         * @returns {string}
         */

    }, {
        key: 'getProjectDir',
        value: function getProjectDir() {
            return this.setup.projectDir;
        }

        /**
         *
         * @param {number} priority [0..9]
         * @param {string} command
         */

    }, {
        key: 'addCommand',
        value: function addCommand(priority, command) {
            this.setup.command.addCommand(priority, command);
        }

        /**
         *
         * @param {string} directory
         * @param {string} type
         * @param {string} description
         */
        // FIXME

    }, {
        key: 'setDirectory',
        value: function () {
            var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(directory, type, description) {
                var documentInstaller;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.getInstaller('document');

                            case 2:
                                documentInstaller = _context.sent;

                                // console.dir(typeof documentInstaller.setDirectory)
                                // if (typeof documentInstaller.setDriectory !== 'function') {
                                //     throw Error()
                                // }

                                documentInstaller.setDirectory(directory, description);
                                if (type) {
                                    this.setup.directories[type] = directory;
                                    config.writeLocal('directories', this.setup.directories);
                                }

                            case 5:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function setDirectory(_x, _x2, _x3) {
                return _ref.apply(this, arguments);
            }

            return setDirectory;
        }()

        /**
         *
         * @param {string} name
         */

    }, {
        key: 'getGenerator',
        value: function getGenerator(name) {
            if (!this.setup.generators[name]) {
                var Klass = plugin.requireGenerator(name);
                this.setup.generators[name] = new Klass(this.setup.operator);
            }
            return this.setup.generators[name];
        }

        /**
         *
         * @param {string} name
         * @param {Generator} generator
         */

    }, {
        key: 'replaceGenerator',
        value: function replaceGenerator(name, generator) {
            if (this.setup.generators[name]) {
                this.setup.operator.error(name + ' generator is already used.');
            } else {
                this.setup.generators[name] = generator;
            }
        }

        /**
         *
         * @param {string} name
         * @returns {Installer}
         */

    }, {
        key: 'getInstaller',
        value: function () {
            var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(name) {
                var klass, installer;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                if (this.setup.installers[name]) {
                                    _context2.next = 10;
                                    break;
                                }

                                klass = plugin.requireInstaller(name);
                                _context2.next = 4;
                                return klass.getInstaller(this.setup.operator);

                            case 4:
                                installer = _context2.sent;

                                if (installer) {
                                    _context2.next = 8;
                                    break;
                                }

                                this.setup.cliUtils.verbose(name + ' installer is ignored.');

                                return _context2.abrupt('return', {
                                    install: function install() {}
                                });

                            case 8:

                                this.setup.cliUtils.verbose('installer: ' + name, 1);
                                this.setup.installers[name] = installer;

                            case 10:
                                return _context2.abrupt('return', this.setup.installers[name]);

                            case 11:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function getInstaller(_x4) {
                return _ref2.apply(this, arguments);
            }

            return getInstaller;
        }()

        /**
         *
         * @param {string} name
         * @returns {boolean}
         */

    }, {
        key: 'isInstalled',
        value: function isInstalled(name) {
            return this.setup.installers[name] !== null;
        }

        /**
         *
         * @param {string} name
         */

    }, {
        key: 'setTarget',
        value: function setTarget(name) {
            this.setup.target = name;
            config.writeLocal('target', this.setup.target);
        }

        /**
         *
         * @param {string} name
         */

    }, {
        key: 'addBuilder',
        value: function addBuilder(name) {
            if (this.setup.builders.includes(name)) {
                return;
            }
            this.setup.builders.push(name);
            config.writeLocal('builders', this.setup.builders);
        }

        /**
         *
         * @param {string} name
         */

    }, {
        key: 'addTester',
        value: function addTester(name) {
            if (this.setup.testers.includes(name)) {
                return;
            }

            this.setup.testers.push(name);
            config.writeLocal('testers', this.setup.testers);
        }

        /**
         *
         * @param {string} name
         * @returns {Promise<Buffer>}
         */

    }, {
        key: 'readFile',
        value: function readFile(name) {
            return this.setup.fsio.readFile(name);
        }

        /**
         *
         * @param {string} name
         * @returns {Buffer}
         */

    }, {
        key: 'readFileSync',
        value: function readFileSync(name) {
            return this.setup.fsio.readFileSync(name);
        }

        /**
         *
         * @param {string} name
         * @returns {boolean}
         */

    }, {
        key: 'checkExists',
        value: function checkExists(name) {
            return this.setup.fsio.checkExists(name);
        }

        /**
         *
         * @param {string} src
         * @param {string|Buffer} content
         * @param {Object} opts
         */

    }, {
        key: 'writeFile',
        value: function writeFile(src, content) {
            var _this = this;

            var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

            if ('type' in opts) {
                var opts2 = Object.assign({}, opts);
                delete opts2.type;
                this.setup.entries.push({ src: src, type: opts.type, opts: opts });
            } else {
                this.setup.entries.push({ src: src, opts: opts });
            }

            config.writeLocal('entries', this.setup.entries.filter(function (entry) {
                return entry.opts && entry.opts.type;
            }).map(function (entry) {
                var opts2 = Object.assign({}, entry.opts);
                delete opts2.type;
                return { src: entry.src, type: entry.opts.type, opts: opts2 };
            }));

            return this.setup.fsio.writeFile(src, content, opts).then(function (isWrote) {
                if (isWrote) {
                    _this.setup.cliUtils.message('wrote ' + src, 1);
                }
            });
        }

        /**
         *
         * @param {function} cb
         */

    }, {
        key: 'postInstall',
        value: function postInstall(cb) {
            this.setup.postInstalls.push(cb);
        }

        /**
         *
         * @param {string} title
         * @param {string} message
         */

    }, {
        key: 'setInfo',
        value: function setInfo(title, message) {
            this.setup.info.push({ title: title, message: message });
            config.writeLocal('info', this.setup.info);
        }

        /**
         *
         * @param {string} message
         */

    }, {
        key: 'verbose',
        value: function verbose(message) {
            this.setup.cliUtils.verbose(message, 1);
        }

        /**
         *
         * @param {string} message
         */

    }, {
        key: 'message',
        value: function message(_message) {
            this.setup.cliUtils.message(_message, 1);
        }

        /**
         *
         * @param {string} message
         */

    }, {
        key: 'error',
        value: function error(message) {
            this.setup.cliUtils.error(message, 1);
        }
    }]);

    return Operator;
}();

module.exports = Operator;
//# sourceMappingURL=operator.js.map