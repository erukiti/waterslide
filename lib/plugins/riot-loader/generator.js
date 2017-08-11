'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var path = require('path');
var fs = require('fs');
var Mustache = require('mustache');

var RiotLoaderGenerator = function () {
    function RiotLoaderGenerator(operator) {
        _classCallCheck(this, RiotLoaderGenerator);

        this.operator = operator;
    }

    _createClass(RiotLoaderGenerator, [{
        key: 'generate',
        value: function () {
            var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(name) {
                var _this = this;

                var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var obj, render;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                obj = {
                                    name: path.basename(name, '.tag')
                                };

                                render = function () {
                                    var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(inFile, outFile) {
                                        var templ, content;
                                        return regeneratorRuntime.wrap(function _callee$(_context) {
                                            while (1) {
                                                switch (_context.prev = _context.next) {
                                                    case 0:
                                                        templ = fs.readFileSync(path.join(__dirname, inFile + '.mst')).toString();
                                                        content = Mustache.render(templ, obj);
                                                        _context.next = 4;
                                                        return _this.operator.writeFile(outFile, content);

                                                    case 4:
                                                    case 'end':
                                                        return _context.stop();
                                                }
                                            }
                                        }, _callee, _this);
                                    }));

                                    return function render(_x3, _x4) {
                                        return _ref2.apply(this, arguments);
                                    };
                                }();

                                _context2.next = 4;
                                return render('sample.tag', name);

                            case 4:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function generate(_x2) {
                return _ref.apply(this, arguments);
            }

            return generate;
        }()
    }]);

    return RiotLoaderGenerator;
}();

module.exports = RiotLoaderGenerator;
//# sourceMappingURL=generator.js.map