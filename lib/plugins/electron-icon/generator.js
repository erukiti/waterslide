'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fs = require('fs');
var path = require('path');

var ElectronIconGenerator = function () {
    function ElectronIconGenerator(operator) {
        _classCallCheck(this, ElectronIconGenerator);

        this.operator = operator;
    }

    _createClass(ElectronIconGenerator, [{
        key: 'generate',
        value: function () {
            var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(name) {
                var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var src;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.operator.getInstaller('electron-icon');

                            case 2:
                                src = fs.readFileSync(path.join(__dirname, 'sample.png'));
                                _context.next = 5;
                                return this.operator.writeFile(name, src, { type: 'electron-icon' });

                            case 5:
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

    return ElectronIconGenerator;
}();

module.exports = ElectronIconGenerator;
//# sourceMappingURL=generator.js.map