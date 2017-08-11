'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var createReadme = function createReadme(projectDir, directoriesText) {
    return '# ' + projectDir + '\n\n## directories\n\n' + directoriesText + '\n\n';
};

var DocumentInstaller = function () {
    function DocumentInstaller(operator) {
        _classCallCheck(this, DocumentInstaller);

        this.operator = operator;
        this.directories = [];
    }

    _createClass(DocumentInstaller, [{
        key: 'setDirectory',
        value: function setDirectory(path, description) {
            this.directories.push({ path: path, description: description });
        }
    }, {
        key: '_getDirectoriesText',
        value: function _getDirectoriesText() {
            var text = '| directory | description |\n';
            text += '| --------- | ----------- |\n';
            this.directories.forEach(function (directory) {
                text += '| ' + directory.path + ' | ' + directory.description + ' |\n';
            });
            return text;
        }
    }, {
        key: 'install',
        value: function () {
            var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
                var _this = this;

                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                this.operator.postInstall(_asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                                    var text;
                                    return regeneratorRuntime.wrap(function _callee$(_context) {
                                        while (1) {
                                            switch (_context.prev = _context.next) {
                                                case 0:
                                                    text = createReadme(_this.operator.getProjectDir(), _this._getDirectoriesText());
                                                    _context.next = 3;
                                                    return _this.operator.writeFile('README.md', text);

                                                case 3:
                                                case 'end':
                                                    return _context.stop();
                                            }
                                        }
                                    }, _callee, _this);
                                })));

                            case 1:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function install() {
                return _ref.apply(this, arguments);
            }

            return install;
        }()
    }], [{
        key: 'getInstaller',
        value: function () {
            var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(operator) {
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                _context3.next = 2;
                                return operator.checkExists('README.md');

                            case 2:
                                if (!_context3.sent) {
                                    _context3.next = 4;
                                    break;
                                }

                                return _context3.abrupt('return', null);

                            case 4:
                                return _context3.abrupt('return', new this(operator));

                            case 5:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));

            function getInstaller(_x) {
                return _ref3.apply(this, arguments);
            }

            return getInstaller;
        }()
    }]);

    return DocumentInstaller;
}();

module.exports = DocumentInstaller;
//# sourceMappingURL=installer.js.map