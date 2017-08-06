'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var path = require('path');
var mkdirp = require('mkdirp');
var fs = require('fs');

var Fsio = function () {
    function Fsio() {
        _classCallCheck(this, Fsio);

        this.cache = {};
    }

    _createClass(Fsio, [{
        key: 'writeFile',
        value: function writeFile(filename, content) {
            var _this = this;

            var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

            return new Promise(function (resolve, reject) {
                var buf = void 0;
                if (typeof content === 'string') {
                    buf = new Buffer(content);
                } else {
                    buf = content;
                }

                if (_this.cache[filename] && _this.cache[filename].equals(buf)) {
                    resolve(false);
                    return;
                } else {
                    _this.cache[filename] = buf;
                }

                if (path.dirname(filename) !== '.') {
                    mkdirp.sync(path.dirname(filename));
                }

                var options = {};
                if (opts.mode) {
                    options.mode = opts.mode;
                }
                options.flag = opts.isRewritable ? 'w' : 'wx';

                fs.writeFile(filename, buf, options, function (err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(true);
                    }
                });
            });
        }
    }, {
        key: 'readFile',
        value: function readFile(filename) {
            var _this2 = this;

            return new Promise(function (resolve, reject) {
                fs.readFile(filename, function (err, content) {
                    if (err) {
                        reject(err);
                    } else {
                        _this2.cache[filename] = content;
                        resolve(content);
                    }
                });
            });
        }
    }, {
        key: 'readFileSync',
        value: function readFileSync(filename) {
            try {
                var content = fs.readFileSync(filename);
                this.cache[filename] = content;
                return content;
            } catch (e) {
                return null;
            }
        }
    }, {
        key: 'checkExists',
        value: function checkExists(filename) {
            return new Promise(function (resolve, reject) {
                fs.stat(filename, function (err, stat) {
                    if (err) {
                        resolve(false);
                    } else {
                        resolve(true);
                    }
                });
            });
        }
    }]);

    return Fsio;
}();

module.exports = Fsio;
//# sourceMappingURL=fsio.js.map