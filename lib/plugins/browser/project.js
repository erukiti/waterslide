'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BrowserProject = function () {
    function BrowserProject(operator) {
        _classCallCheck(this, BrowserProject);

        this.operator = operator;
        operator.setTarget('browser');
    }

    _createClass(BrowserProject, [{
        key: 'install',
        value: function () {
            var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                var g;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.operator.getInstaller('js');

                            case 2:
                                g = this.operator.getGenerator('browser');
                                _context.next = 5;
                                return g.generate('src/index.js', { type: 'web' });

                            case 5:
                                _context.next = 7;
                                return this.operator.setDirectory('src', 'source', 'source code directory');

                            case 7:
                                _context.next = 9;
                                return this.operator.setDirectory('build', 'destination', 'build directory');

                            case 9:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function install() {
                return _ref.apply(this, arguments);
            }

            return install;
        }()
    }]);

    return BrowserProject;
}();

module.exports = BrowserProject;
//# sourceMappingURL=project.js.map