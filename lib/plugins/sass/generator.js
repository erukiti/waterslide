'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fs = require('fs');
var path = require('path');

var SassGenerator = function () {
    function SassGenerator(operator) {
        _classCallCheck(this, SassGenerator);

        this.operator = operator;
    }

    _createClass(SassGenerator, [{
        key: 'generate',
        value: function () {
            var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(name) {
                var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var src;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                src = fs.readFileSync(path.join(__dirname, 'sample.scss'));

                                if (!this.operator.isInstalled('sass')) {
                                    _context.next = 6;
                                    break;
                                }

                                _context.next = 4;
                                return this.operator.writeFile(name, src, { type: 'sass' });

                            case 4:
                                _context.next = 8;
                                break;

                            case 6:
                                _context.next = 8;
                                return this.operator.writeFile(name, src);

                            case 8:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function generate(_x2) {
                return _ref.apply(this, arguments);
            }

            return generate;
        }()
    }]);

    return SassGenerator;
}();

module.exports = SassGenerator;
//# sourceMappingURL=generator.js.map