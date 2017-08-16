'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = require('../../waterslide'),
    utils = _require.utils,
    getConfig = _require.getConfig;

var path = require('path');
var fs = require('fs');

var JsInstaller = function () {
    function JsInstaller(operator) {
        _classCallCheck(this, JsInstaller);

        this.operator = operator;

        try {
            var json = operator.readFileSync('package.json');
            if (!json) {
                this._init();
            } else {
                this.values = JSON.parse(json);
            }
        } catch (e) {
            this._init();
        }

        this.packages = [];
        this.devPackages = [];

        this.isYarn = this.operator.getOpt().includes('yarn');
    }

    _createClass(JsInstaller, [{
        key: '_init',
        value: function _init() {
            var _this = this;

            var config = getConfig();

            var getProjectName = function getProjectName() {
                return _this.operator.getProjectDir();
            };
            // FIXME: project dir -> project name

            this.values = {
                main: '',
                name: getProjectName(),
                version: '0.0.1',
                description: '',
                author: config.getAuthor(),
                license: config.getGlobal('license'),
                keywords: [],
                scripts: {
                    start: 'innocentia run',
                    build: 'innocentia build',
                    watch: 'innocentia watch',
                    test: 'innocentia test'
                },
                bin: {},
                innocentia: {}
            };
        }
    }, {
        key: 'addPackage',
        value: function addPackage(name) {
            if (utils.checkExistsNpm(name)) {
                return;
            }

            this.packages.push(name);
        }
    }, {
        key: 'addDevPackage',
        value: function addDevPackage(name) {
            if (utils.checkExistsNpm(name)) {
                return;
            }

            this.devPackages.push(name);
        }
    }, {
        key: 'addBin',
        value: function addBin(binPath) {
            this.values.bin[path.basename(binPath)] = binPath;
        }
    }, {
        key: 'setMain',
        value: function setMain(name) {
            this.values.main = name;
        }
    }, {
        key: 'setInnocentiaConfig',
        value: function setInnocentiaConfig(key, obj) {
            this.values.innocentia[key] = obj;
        }
    }, {
        key: 'setBuildConfig',
        value: function setBuildConfig(obj) {
            this.values.build = obj;
        }
    }, {
        key: 'install',
        value: function () {
            var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
                var _this2 = this;

                var noUse, defaultUse, webpackInstaller;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                this.addDevPackage('innocentia');

                                if (this.operator.getIsUse()) {
                                    _context3.next = 6;
                                    break;
                                }

                                noUse = this.operator.getNoUse();
                                defaultUse = ['ava', 'eslint'];
                                _context3.next = 6;
                                return Promise.all(defaultUse.filter(function (value) {
                                    return !noUse.includes(value);
                                }).map(function () {
                                    var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(value) {
                                        return regeneratorRuntime.wrap(function _callee$(_context) {
                                            while (1) {
                                                switch (_context.prev = _context.next) {
                                                    case 0:
                                                        _context.next = 2;
                                                        return _this2.operator.getInstaller(value);

                                                    case 2:
                                                        return _context.abrupt('return', _context.sent);

                                                    case 3:
                                                    case 'end':
                                                        return _context.stop();
                                                }
                                            }
                                        }, _callee, _this2);
                                    }));

                                    return function (_x) {
                                        return _ref2.apply(this, arguments);
                                    };
                                }()));

                            case 6:
                                _context3.next = 8;
                                return this.operator.getInstaller('webpack');

                            case 8:
                                webpackInstaller = _context3.sent;

                                webpackInstaller.addLoader('\\.jsx?$', [{ loader: 'babel-loader', options: { sourceMap: true } }]);
                                _context3.next = 12;
                                return this.operator.getInstaller('babel');

                            case 12:

                                this.operator.postInstall(_asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
                                    return regeneratorRuntime.wrap(function _callee2$(_context2) {
                                        while (1) {
                                            switch (_context2.prev = _context2.next) {
                                                case 0:
                                                    _context2.next = 2;
                                                    return _this2.operator.writeFile('package.json', JSON.stringify(_this2.values, null, '  ') + '\n', { isRewritable: true });

                                                case 2:

                                                    if (_this2.isYarn) {
                                                        if (_this2.packages.length > 0) {
                                                            _this2.operator.addCommand(3, 'yarn add ' + _this2.packages.join(' ') + ' -S');
                                                        }
                                                        if (_this2.devPackages.length > 0) {
                                                            _this2.operator.addCommand(3, 'yarn add ' + _this2.devPackages.join(' ') + ' -D');
                                                        }
                                                    } else {
                                                        if (_this2.packages.length > 0) {
                                                            _this2.operator.addCommand(3, 'npm i ' + _this2.packages.join(' ') + ' -S');
                                                        }
                                                        if (_this2.devPackages.length > 0) {
                                                            _this2.operator.addCommand(3, 'npm i ' + _this2.devPackages.join(' ') + ' -D');
                                                        }
                                                    }

                                                case 3:
                                                case 'end':
                                                    return _context2.stop();
                                            }
                                        }
                                    }, _callee2, _this2);
                                })));

                            case 13:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
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

    return JsInstaller;
}();

module.exports = JsInstaller;
//# sourceMappingURL=installer.js.map