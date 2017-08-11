'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fs = require('fs');
var path = require('path');

var ElectronProject = function () {
    function ElectronProject(operator) {
        _classCallCheck(this, ElectronProject);

        this.operator = operator;
        operator.setTarget('electron');
    }

    _createClass(ElectronProject, [{
        key: 'install',
        value: function () {
            var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                var jsInstaller, browserGenerator, iconGenerator, appJsText, gitInstaller;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return this.operator.setDirectory('src', 'source', 'source code directory');

                            case 2:
                                _context.next = 4;
                                return this.operator.setDirectory('src/renderer', null, 'source code directory (Electron Renderer Process)');

                            case 4:
                                _context.next = 6;
                                return this.operator.setDirectory('build', 'destination', 'build directory');

                            case 6:
                                _context.next = 8;
                                return this.operator.setDirectory('release', null, 'release directory');

                            case 8:
                                _context.next = 10;
                                return this.operator.getInstaller('js');

                            case 10:
                                jsInstaller = _context.sent;

                                jsInstaller.addDevPackage('electron');
                                jsInstaller.addDevPackage('electron-packager');
                                jsInstaller.addDevPackage('node-7z');
                                jsInstaller.setMain('build/app.js');

                                browserGenerator = this.operator.getGenerator('browser');
                                _context.next = 18;
                                return browserGenerator.generate('src/renderer/index.js', { type: 'electron-renderer' });

                            case 18:
                                iconGenerator = this.operator.getGenerator('electron-icon');
                                _context.next = 21;
                                return iconGenerator.generate('src/app.png');

                            case 21:
                                appJsText = fs.readFileSync(path.join(__dirname, 'sample.app.js'));
                                _context.next = 24;
                                return this.operator.writeFile('src/app.js', appJsText, { type: 'copy' });

                            case 24:
                                _context.next = 26;
                                return this.operator.writeFile('src/package.json', JSON.stringify({ 'main': 'browser/app.js' }, null, '  ') + '\n', { type: 'copy' });

                            case 26:
                                _context.next = 28;
                                return this.operator.getInstaller('git');

                            case 28:
                                gitInstaller = _context.sent;

                                gitInstaller.addIgnore('release/');

                            case 30:
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

    return ElectronProject;
}();

module.exports = ElectronProject;
//# sourceMappingURL=project.js.map