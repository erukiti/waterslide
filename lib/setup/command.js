'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ChildProcess = require('child_process');

var Command = function () {
    function Command(childProcess) {
        _classCallCheck(this, Command);

        this.childProcess = childProcess;
        this.commands = [[], [], [], [], [], [], [], [], [], []];
    }

    _createClass(Command, [{
        key: 'addCommand',
        value: function addCommand(priority, command) {
            this.commands[priority].push(command);
        }
    }, {
        key: 'exec',
        value: function exec(command) {
            var _this = this;

            return new Promise(function (resolve, reject) {
                var child = _this.childProcess.exec(command);
                child.on('error', function (err) {
                    return reject(err);
                });
                child.on('exit', function (code, signal) {
                    if (code) {
                        child.stdout.pipe(process.stdout);
                        child.stderr.pipe(process.stdout);

                        reject(new Error('error \'' + command + '\' is failed. ' + code));
                    } else {
                        resolve();
                    }
                });
            });
        }
    }, {
        key: 'execAll',
        value: function () {
            var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(cb) {
                var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, commands, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, command;

                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _iteratorNormalCompletion = true;
                                _didIteratorError = false;
                                _iteratorError = undefined;
                                _context.prev = 3;
                                _iterator = this.commands[Symbol.iterator]();

                            case 5:
                                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                                    _context.next = 37;
                                    break;
                                }

                                commands = _step.value;
                                _iteratorNormalCompletion2 = true;
                                _didIteratorError2 = false;
                                _iteratorError2 = undefined;
                                _context.prev = 10;
                                _iterator2 = commands[Symbol.iterator]();

                            case 12:
                                if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                                    _context.next = 20;
                                    break;
                                }

                                command = _step2.value;

                                cb && cb(command);
                                _context.next = 17;
                                return this.exec(command);

                            case 17:
                                _iteratorNormalCompletion2 = true;
                                _context.next = 12;
                                break;

                            case 20:
                                _context.next = 26;
                                break;

                            case 22:
                                _context.prev = 22;
                                _context.t0 = _context['catch'](10);
                                _didIteratorError2 = true;
                                _iteratorError2 = _context.t0;

                            case 26:
                                _context.prev = 26;
                                _context.prev = 27;

                                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                    _iterator2.return();
                                }

                            case 29:
                                _context.prev = 29;

                                if (!_didIteratorError2) {
                                    _context.next = 32;
                                    break;
                                }

                                throw _iteratorError2;

                            case 32:
                                return _context.finish(29);

                            case 33:
                                return _context.finish(26);

                            case 34:
                                _iteratorNormalCompletion = true;
                                _context.next = 5;
                                break;

                            case 37:
                                _context.next = 43;
                                break;

                            case 39:
                                _context.prev = 39;
                                _context.t1 = _context['catch'](3);
                                _didIteratorError = true;
                                _iteratorError = _context.t1;

                            case 43:
                                _context.prev = 43;
                                _context.prev = 44;

                                if (!_iteratorNormalCompletion && _iterator.return) {
                                    _iterator.return();
                                }

                            case 46:
                                _context.prev = 46;

                                if (!_didIteratorError) {
                                    _context.next = 49;
                                    break;
                                }

                                throw _iteratorError;

                            case 49:
                                return _context.finish(46);

                            case 50:
                                return _context.finish(43);

                            case 51:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this, [[3, 39, 43, 51], [10, 22, 26, 34], [27,, 29, 33], [44,, 46, 50]]);
            }));

            function execAll(_x) {
                return _ref.apply(this, arguments);
            }

            return execAll;
        }()
    }]);

    return Command;
}();

module.exports = Command;
//# sourceMappingURL=command.js.map