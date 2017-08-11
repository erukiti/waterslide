'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var path = require('path');
var process = require('process');

var CliUtils = function () {
    function CliUtils() {
        var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { verbose: false, debug: false };

        _classCallCheck(this, CliUtils);

        this.isVerbose = opts.verbose || opts.debug;
        this.isDebug = opts.debug;
        this.isMessage = true;
        this.isError = true;
        this.isWarning = true;

        this.latestLength = 0;
    }

    _createClass(CliUtils, [{
        key: '_getCaller',
        value: function _getCaller(depth) {
            var reStackTrace = /at .+ \(([^:]+:[0-9]+:[0-9]+)\)/g;

            var n = depth + 2;

            var _ref = new Error(),
                stack = _ref.stack;

            var result = void 0;
            while ((result = reStackTrace.exec(stack)) !== null) {
                if (--n <= 0) {
                    return path.join(path.basename(path.dirname(result[1])), path.basename(result[1]));
                }
            }
            return '';
        }
    }, {
        key: '_hook',
        value: function _hook() {
            var _this = this;

            var stdoutWrite = process.stdout.write;
            var stderrWrite = process.stderr.write;
            var exit = process.exit;

            var rotateIndex = 0;

            // Fixme: it can not be stopped while using hooks because it uses setInterval.
            var timer = setInterval(function () {
                var indicator = '|/-\\'.substr(rotateIndex, 1);
                if (++rotateIndex >= 4) {
                    rotateIndex = 0;
                }

                stdoutWrite.apply(process.stdout, [indicator + '\r']);
            }, 50);

            var _reset = function _reset() {
                clearInterval(timer);
                process.stdout.write = stdoutWrite;
                process.stderr.write = stderrWrite;
                process.exit = exit;
                if (_this.latestLength > 0) {
                    process.stdout.write(' '.repeat(_this.latestLength) + '\r');
                    _this.latestLength = 0;
                }
            };

            process.exit = function () {
                _reset();
                process.exit.apply(process, arguments);
            };

            process.stdout.write = function () {
                var _process$stdout;

                _reset();
                (_process$stdout = process.stdout).write.apply(_process$stdout, arguments);
            };

            process.stderr.write = function () {
                var _process$stderr;

                _reset();
                (_process$stderr = process.stderr).write.apply(_process$stderr, arguments);
            };
        }

        /**
         *
         * @param {string} [mesg]
         * @param {number} [depth]
         */

    }, {
        key: 'verbose',
        value: function verbose() {
            var mesg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
            var depth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

            var header = '';
            var caller = this._getCaller(depth + 1);
            if (this.isDebug && caller) {
                header = 'verbose ' + caller;
            } else {
                header = 'verbose';
            }

            if (this.isVerbose) {
                console.log('\x1B[33m' + header + ':\x1B[m ' + mesg);
            } else {
                process.stdout.write('  ' + mesg + '\r');
                this.latestLength = mesg.length + 2;
                this._hook();
            }
        }

        /**
         *
         * @param {string} [mesg]
         * @param {number} [depth]
         */

    }, {
        key: 'debug',
        value: function debug() {
            var mesg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
            var depth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

            if (this.isDebug) {
                var header = 'debug ' + this._getCaller(depth + 1);
                console.log('\x1B[36m' + header + ':\x1B[m ' + mesg);
            }
        }

        /**
         *
         * @param {string} [mesg]
         * @param {number} [depth]
         */

    }, {
        key: 'message',
        value: function message() {
            var mesg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
            var depth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

            if (this.isMessage) {
                var header = '';
                if (this.isDebug) {
                    console.log('\x1B[32m' + this._getCaller(depth + 1) + '\x1B[m: ' + mesg);
                } else {
                    console.log(mesg);
                }
            }
        }

        /**
         *
         * @param {string} [mesg]
         * @param {number} [depth]
         */

    }, {
        key: 'warning',
        value: function warning() {
            var mesg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
            var depth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

            if (this.isWarning) {
                var header = '';
                if (this.isDebug) {
                    header = 'warning ' + this._getCaller(depth + 1);
                } else {
                    header = 'warning';
                }
                console.log('\x1B[33m' + header + ':\x1B[m ' + mesg);
            }
        }
    }, {
        key: 'error',
        value: function error() {
            var mesg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
            var depth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

            if (this.isError) {
                var header = '';
                if (this.isDebug) {
                    header = 'error ' + this._getCaller(depth + 1);
                } else {
                    header = 'error';
                }
                console.log('\x1B[33m' + header + ':\x1B[m ' + mesg);
            }
        }
    }]);

    return CliUtils;
}();

module.exports = CliUtils;
//# sourceMappingURL=utils.js.map