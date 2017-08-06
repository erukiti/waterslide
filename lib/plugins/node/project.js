'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var indexJsText = '\'use strict\'\n\nconsole.log(\'Hello, Node.js World.\')\n';

var NodeProject = function () {
    function NodeProject(operator) {
        _classCallCheck(this, NodeProject);

        this.operator = operator;
        operator.setTarget('node');
    }

    _createClass(NodeProject, [{
        key: 'install',
        value: function () {
            var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                var jsInstaller;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.operator.getInstaller('js');

                            case 2:
                                jsInstaller = _context.sent;

                                jsInstaller.setMain('lib/index.js');

                                _context.next = 6;
                                return this.operator.setDirectory('src', 'source', 'source code directory');

                            case 6:
                                _context.next = 8;
                                return this.operator.setDirectory('lib', 'destination', 'build directory');

                            case 8:
                                _context.next = 10;
                                return this.operator.writeFile('src/index.js', indexJsText, { type: 'node' });

                            case 10:
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

    return NodeProject;
}();

module.exports = NodeProject;
//# sourceMappingURL=project.js.map