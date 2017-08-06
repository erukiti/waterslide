'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var config = require('../config');
var Menu = require('terminal-menu');
var createCharm = require('charm');
var readPrompt = require('read');

var _require = require('stream'),
    PassThrough = _require.PassThrough;

var DummyInput = function (_PassThrough) {
    _inherits(DummyInput, _PassThrough);

    function DummyInput() {
        _classCallCheck(this, DummyInput);

        return _possibleConstructorReturn(this, (DummyInput.__proto__ || Object.getPrototypeOf(DummyInput)).apply(this, arguments));
    }

    _createClass(DummyInput, [{
        key: 'destroy',
        value: function destroy() {}
    }]);

    return DummyInput;
}(PassThrough);

var charm = createCharm({ input: new DummyInput() });

var prompt = function prompt(item) {
    return new Promise(function (resolve, reject) {
        readPrompt({ prompt: item.desc }, function (err, result) {
            if (err) {
                reject(err);
            } else {
                config.writeGlobal(item.name, result);
                resolve();
            }
        });
    });
};

var createMenu = function createMenu(items) {
    return new Promise(function (resolve, reject) {
        var menu = new Menu({ charm: charm });
        menu.reset();

        var cb = null;

        var menuStream = menu.createStream();
        var passDataToMenu = function passDataToMenu(data) {
            return menuStream.write(data);
        };

        items.forEach(function (item) {
            if (!item.cb) {
                menu.write(item.label);
            } else {
                menu.add(item.label, function () {
                    cb = item.cb;
                    menu.close();
                });
            }
        });

        // see. https://github.com/facebook/flow/issues/2944
        var workAround = process.stdin;

        process.stdin.on('data', passDataToMenu);
        menuStream.pipe(process.stdout, { end: false });
        workAround.setRawMode(true);
        process.stdin.resume();

        menu.on('close', function () {
            menuStream.unpipe(process.stdout);
            process.stdin.removeListener('data', passDataToMenu);
            workAround.setRawMode(false);
            resolve(cb);
        });
    });
};

var selectLicense = function selectLicense(item) {
    var licenses = [{ name: 'Apache-2.0', desc: 'Apache License 2.0' }, { name: 'BSD-2-Clause', desc: 'BSD 2-clause "Simplified" License' }, { name: 'BSD-3-Clause', desc: 'BSD 3-clause "New" or "Revised License' }, { name: 'AGPL-3.0', desc: 'GNU Affero General Public License v3.0' }, { name: 'GPL-2.0', desc: 'GNU General Public License v2.0 only' }, { name: 'GPL-3.0', desc: 'GNU General Public License v3.0 only' }, { name: 'LGPL-2.0', desc: 'GNU Library General Public License v2 only' }, { name: 'LGPL-2.1', desc: 'GNU Lesser General Public License v2.1 only' }, { name: 'LGPL-3.0', desc: 'GNU Lesser General Public License v3.0 only' }, { name: 'MIT', desc: 'MIT License' }];

    var items = [];
    items.push({ label: 'Please select default your license\n\n' });
    licenses.forEach(function (license) {
        items.push({ label: license.desc, cb: function cb() {
                config.writeGlobal('license', license.name);
            } });
    });

    items.push({ label: '\n' });
    items.push({ label: 'Input other license', cb: function cb() {
            return prompt({ name: 'license', desc: 'input license name (see. https://spdx.org/licenses/)' });
        } });

    items.push({ label: '\n' });
    items.push({ label: 'quit', cb: function cb() {} });
    return createMenu(items);
};

var configurable = [{ name: 'name', desc: 'your name (use author\'s credit)', cb: prompt }, { name: 'email', desc: 'your email (use author\'s credit)', cb: prompt }, { name: 'homepage', desc: 'your homepage url (use author\'s credit)', cb: prompt }, { name: 'license', desc: 'default license', cb: selectLicense }];

var configMenu = function configMenu() {
    var items = [];
    items.push({ label: 'waterslide global configuration\n\n' });

    configurable.forEach(function (item) {
        items.push({ label: item.name + ': ' + config.getGlobal(item.name), cb: function cb() {
                return item.cb(item);
            } });
    });

    items.push({ label: '\n' });
    items.push({ label: 'exit', cb: function cb() {
            return process.exit(0);
        } });

    return createMenu(items);
};

var configLoop = function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var cb;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return configMenu().catch(function (e) {
                            return console.dir(e);
                        });

                    case 2:
                        cb = _context.sent;

                    case 3:
                        if (cb) {
                            _context.next = 7;
                            break;
                        }

                        _context.next = 6;
                        return configMenu().catch(function (e) {
                            return console.dir(e);
                        });

                    case 6:
                        cb = _context.sent;

                    case 7:
                        _context.next = 9;
                        return cb();

                    case 9:
                        cb = _context.sent;

                    case 10:
                        _context.next = 3;
                        break;

                    case 12:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function configLoop() {
        return _ref.apply(this, arguments);
    };
}();

var configCommand = function configCommand() {
    return {
        command: 'config [key] [value]',
        describe: 'global configuration',
        builder: function builder(yargs) {},
        handler: function handler(argv) {
            if (!argv.key && !argv.value) {
                configLoop();
                return;
            }

            if (!argv.value) {
                console.log(argv.key + ': ' + config.getGlobal(argv.key));
                return;
            }

            var validKeys = configurable.map(function (item) {
                return item.name;
            });

            if (validKeys.includes(argv.key)) {
                config.writeGlobal(argv.key, argv.value);
            } else {
                console.log('invalid key');
            }
        }
    };
};

module.exports = configCommand;
//# sourceMappingURL=config.js.map