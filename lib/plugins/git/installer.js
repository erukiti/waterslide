'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GithubApi = require('github-api');
var fs = require('fs');
var path = require('path');

var _require = require('../../waterslide'),
    utils = _require.utils,
    getConfig = _require.getConfig;

var GitInstaller = function () {
    function GitInstaller(operator) {
        _classCallCheck(this, GitInstaller);

        this.operator = operator;
        this.ignoreFiles = ['node_modules/', 'npm-debug.log', 'build/'];

        var config = getConfig();
        this.token = config.getGlobal('github_token');
    }

    _createClass(GitInstaller, [{
        key: 'addIgnore',
        value: function addIgnore(path) {
            this.ignoreFiles.push(path);
        }
    }, {
        key: 'getGithubRepository',
        value: function getGithubRepository() {
            return this.githubRepository;
        }
    }, {
        key: 'getGithubRepositoryUrl',
        value: function getGithubRepositoryUrl() {
            return this.githubRepositoryUrl;
        }
    }, {
        key: 'getGithubUsername',
        value: function getGithubUsername() {
            return this.githubUsername;
        }
    }, {
        key: 'install',
        value: function () {
            var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                if (this.githubUser) {
                                    this.githubUser.createRepo({
                                        name: this.githubRepository,
                                        private: true
                                    }).catch(function (err) {
                                        return console.dir(err);
                                    });
                                }

                                this.operator.addCommand(9, 'git init');
                                this.operator.addCommand(9, 'git add .');
                                this.operator.addCommand(9, 'git commit -m \'first commited by waterslide. see. http://github.com/erukiti/waterslide/\'');

                                _context.next = 6;
                                return this.operator.writeFile('.gitignore', this.ignoreFiles.join('\n'));

                            case 6:
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
    }], [{
        key: 'getInstaller',
        value: function () {
            var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(operator) {
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                try {
                                    fs.existsSync(path.join(this.operator.getProjectDir(), '.git'));
                                    console.log('alread installed');
                                    process.exit(1);
                                } catch (e) {
                                    //
                                }
                                return _context2.abrupt('return', new this(operator));

                            case 2:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function getInstaller(_x) {
                return _ref2.apply(this, arguments);
            }

            return getInstaller;
        }()
    }]);

    return GitInstaller;
}();

module.exports = GitInstaller;
//# sourceMappingURL=installer.js.map