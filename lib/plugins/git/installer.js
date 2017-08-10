'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const GithubApi = require('github-api');
const fs = require('fs');
const path = require('path');
const { utils, getConfig } = require('../../waterslide');

class GitInstaller {
    constructor(operator) {
        this.operator = operator;
        this.ignoreFiles = ['node_modules/', 'npm-debug.log', 'build/'];

        const config = getConfig();
        this.token = config.getGlobal('github_token');
    }

    static getInstaller(operator) {
        var _this = this;

        return _asyncToGenerator(function* () {
            try {
                fs.existsSync(path.join(_this.operator.getProjectDir(), '.git'));
                console.log('alread installed');
                process.exit(1);
            } catch (e) {
                //
            }
            return new _this(operator);
        })();
    }

    addIgnore(path) {
        this.ignoreFiles.push(path);
    }

    getGithubRepository() {
        return this.githubRepository;
    }

    getGithubRepositoryUrl() {
        return this.githubRepositoryUrl;
    }

    getGithubUsername() {
        return this.githubUsername;
    }

    install() {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            if (_this2.githubUser) {
                _this2.githubUser.createRepo({
                    name: _this2.githubRepository,
                    private: true
                }).catch(function (err) {
                    return console.dir(err);
                });
            }

            _this2.operator.addCommand(9, 'git init');
            _this2.operator.addCommand(9, 'git add .');
            _this2.operator.addCommand(9, 'git commit -m \'first commited by waterslide. see. http://github.com/erukiti/waterslide/\'');

            yield _this2.operator.writeFile('.gitignore', _this2.ignoreFiles.join('\n'));
        })();
    }
}

module.exports = GitInstaller;
//# sourceMappingURL=installer.js.map