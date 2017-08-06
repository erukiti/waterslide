'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fs = require('fs');
var path = require('path');
var process = require('process');
var Mustache = require('mustache');

var ReactReduxGenerator = function () {
    function ReactReduxGenerator(operator) {
        _classCallCheck(this, ReactReduxGenerator);

        this.operator = operator;
    }

    _createClass(ReactReduxGenerator, [{
        key: 'generate',
        value: function () {
            var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(name) {
                var _this = this;

                var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var toLower, toUpper, createPrefix, upperPrefix, lowerPrefix, obj, render;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                toLower = function toLower(s) {
                                    return s.charAt(0).toLowerCase() + s.slice(1);
                                };

                                toUpper = function toUpper(s) {
                                    return s.charAt(0).toUpperCase() + s.slice(1);
                                };

                                createPrefix = function createPrefix(s) {
                                    return s.split('-').map(function (v) {
                                        return toUpper(v);
                                    }).join('');
                                };

                                upperPrefix = createPrefix(path.basename(name));
                                lowerPrefix = toLower(upperPrefix);
                                obj = {
                                    action: upperPrefix + 'Action',
                                    component: upperPrefix + 'Component',
                                    reducer: lowerPrefix + 'Reducer',
                                    name: lowerPrefix
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
                                                        return _this.operator.writeFile(path.join(name, '' + outFile), content);

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

                                _context2.next = 9;
                                return render('action.js', 'action.js');

                            case 9:
                                _context2.next = 11;
                                return render('component.jsx', 'component.jsx');

                            case 11:
                                _context2.next = 13;
                                return render('container.js', 'index.js');

                            case 13:
                                _context2.next = 15;
                                return render('reducer.js', 'reducer.js');

                            case 15:
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

    return ReactReduxGenerator;
}();

module.exports = ReactReduxGenerator;
//# sourceMappingURL=index.js.map