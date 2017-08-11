'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var path = require('path');
var fs = require('fs');
var Mustache = require('mustache');

var ReactReduxInstaller = function () {
    function ReactReduxInstaller(operator) {
        var _this = this;

        _classCallCheck(this, ReactReduxInstaller);

        this.operator = operator;

        var generator = {
            generate: function () {
                var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(name) {
                    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                    var prefix, obj, render, dir;
                    return regeneratorRuntime.wrap(function _callee2$(_context2) {
                        while (1) {
                            switch (_context2.prev = _context2.next) {
                                case 0:
                                    prefix = path.basename(name, '.js');
                                    obj = { prefix: prefix };

                                    render = function () {
                                        var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(inFile, outFile) {
                                            var opts2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
                                            var fn, templ, content;
                                            return regeneratorRuntime.wrap(function _callee$(_context) {
                                                while (1) {
                                                    switch (_context.prev = _context.next) {
                                                        case 0:
                                                            fn = path.join(__dirname, inFile + '.mst');
                                                            templ = fs.readFileSync(fn).toString();
                                                            content = Mustache.render(templ, obj);
                                                            _context.next = 5;
                                                            return _this.operator.writeFile(outFile, content, opts2);

                                                        case 5:
                                                        case 'end':
                                                            return _context.stop();
                                                    }
                                                }
                                            }, _callee, _this);
                                        }));

                                        return function render(_x4, _x5) {
                                            return _ref2.apply(this, arguments);
                                        };
                                    }();

                                    dir = path.dirname(name);
                                    _context2.next = 6;
                                    return render('actions.js', dir + '/actions.js');

                                case 6:
                                    _context2.next = 8;
                                    return render('index.html', dir + '/' + prefix + '.html', { type: 'copy' });

                                case 8:
                                    _context2.next = 10;
                                    return render('index.jsx', dir + '/' + prefix + '.jsx', opts);

                                case 10:
                                    _context2.next = 12;
                                    return render('reducers.js', dir + '/reducers.js');

                                case 12:
                                    _context2.next = 14;
                                    return _this.operator.getGenerator('react-redux').generate(dir + '/app');

                                case 14:
                                case 'end':
                                    return _context2.stop();
                            }
                        }
                    }, _callee2, _this);
                }));

                function generate(_x2) {
                    return _ref.apply(this, arguments);
                }

                return generate;
            }()
        };

        this.operator.replaceGenerator('browser', generator);
    }

    _createClass(ReactReduxInstaller, [{
        key: 'install',
        value: function () {
            var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3() {
                var babelInstaller, jsInstaller;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return this.operator.getInstaller('babel');

                            case 2:
                                babelInstaller = _context3.sent;

                                babelInstaller.addPreset('react');
                                babelInstaller.addPlugin('babel-plugin-syntax-jsx');

                                _context3.next = 7;
                                return this.operator.getInstaller('js');

                            case 7:
                                jsInstaller = _context3.sent;

                                jsInstaller.addDevPackage('babel-preset-react');
                                jsInstaller.addDevPackage('babel-plugin-syntax-jsx');
                                jsInstaller.addPackage('react');
                                jsInstaller.addPackage('react-dom');
                                jsInstaller.addPackage('react-redux');
                                jsInstaller.addPackage('redux');

                            case 14:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function install() {
                return _ref3.apply(this, arguments);
            }

            return install;
        }()
    }], [{
        key: 'getInstaller',
        value: function getInstaller(operator) {
            return new this(operator);
        }
    }]);

    return ReactReduxInstaller;
}();

module.exports = ReactReduxInstaller;
//# sourceMappingURL=index.js.map