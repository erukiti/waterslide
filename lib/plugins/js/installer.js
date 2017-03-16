'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const { utils, getConfig } = require('../../waterslide');
const path = require('path');
const fs = require('fs');

class JsInstaller {
    constructor(operator) {
        this.operator = operator;

        try {
            const json = operator.readFileSync('package.json');
            if (!json) {
                this._init();
            } else {
                this.values = JSON.parse(json);
            }
        } catch (e) {
            this._init();
        }

        this.packages = [];
        this.devPackages = [];

        this.isYarn = this.operator.getOpt().includes('yarn');
    }

    _init() {
        const config = getConfig();

        const getProjectName = () => this.operator.getProjectDir();
        // FIXME: project dir -> project name

        this.values = {
            main: '',
            name: getProjectName(),
            version: '0.0.1',
            description: '',
            author: config.getAuthor(),
            license: config.getGlobal('license'),
            keywords: [],
            scripts: {
                start: 'ws run',
                build: 'ws build',
                watch: 'ws watch',
                test: 'ws test'
            },
            bin: {}
        };
    }

    static getInstaller(operator) {
        return new this(operator);
    }

    addPackage(name) {
        if (utils.checkExistsNpm(name)) {
            return;
        }

        this.packages.push(name);
    }

    addDevPackage(name) {
        if (utils.checkExistsNpm(name)) {
            return;
        }

        this.devPackages.push(name);
    }

    addBin(binPath) {
        this.values.bin[path.basename(binPath)] = binPath;
    }

    setMain(name) {
        this.values.main = name;
    }

    install() {
        var _this = this;

        return _asyncToGenerator(function* () {
            _this.addDevPackage('babel-core');
            _this.addDevPackage('babel-loader');

            const babelInstaller = yield _this.operator.getInstaller('babel');
            if (_this.operator.getOpt().includes('es2015')) {
                _this.addDevPackage('babel-preset-es2015');
                babelInstaller.addPreset('es2015');
            } else {
                _this.addDevPackage('babel-preset-es2016');
                babelInstaller.addPreset('es2016');
            }

            _this.addDevPackage('waterslide');

            const noUse = _this.operator.getNoUse();
            const defaultUse = ['power-assert', 'ava', 'eslint'];
            yield Promise.all(defaultUse.filter(function (value) {
                return !noUse.includes(value);
            }).map((() => {
                var _ref = _asyncToGenerator(function* (value) {
                    return yield _this.operator.getInstaller(value);
                });

                return function (_x) {
                    return _ref.apply(this, arguments);
                };
            })()));

            const webpackInstaller = yield _this.operator.getInstaller('webpack');
            webpackInstaller.addLoader('\\.jsx?$', [{ loader: 'babel-loader', options: { sourceMap: true } }]);

            _this.operator.postInstall(_asyncToGenerator(function* () {
                yield _this.operator.writeFile('package.json', `${JSON.stringify(_this.values, null, '  ')}\n`, { isRewritable: true });

                if (_this.isYarn) {
                    if (_this.packages.length > 0) {
                        _this.operator.addCommand(3, `yarn add ${_this.packages.join(' ')} -S`);
                    }
                    if (_this.devPackages.length > 0) {
                        _this.operator.addCommand(3, `yarn add ${_this.devPackages.join(' ')} -D`);
                    }
                } else {
                    if (_this.packages.length > 0) {
                        _this.operator.addCommand(3, `npm i ${_this.packages.join(' ')} -S`);
                    }
                    if (_this.devPackages.length > 0) {
                        _this.operator.addCommand(3, `npm i ${_this.devPackages.join(' ')} -D`);
                    }
                }
            }));
        })();
    }
}

module.exports = JsInstaller;
//# sourceMappingURL=installer.js.map