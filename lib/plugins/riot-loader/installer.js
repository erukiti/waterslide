'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const path = require('path');
const fs = require('fs');

class RiotLoaderInstaller {
    constructor(operator) {
        var _this = this;

        this.operator = operator;

        const generator = {
            generate: (() => {
                var _ref = _asyncToGenerator(function* (name, opts = {}) {
                    const render = (() => {
                        var _ref2 = _asyncToGenerator(function* (inFile, outFile, opts2 = {}) {
                            const fn = path.join(__dirname, inFile);
                            const content = fs.readFileSync(fn).toString();
                            yield _this.operator.writeFile(outFile, content, opts2);
                        });

                        return function render(_x2, _x3) {
                            return _ref2.apply(this, arguments);
                        };
                    })();

                    const dir = path.dirname(name);
                    yield render('sample.html', `${dir}/index.html`, { type: 'copy' });
                    yield render('sample.js', `${dir}/index.js`, opts);

                    yield _this.operator.getGenerator('riot-loader').generate(`${dir}/app.tag`);
                });

                return function generate(_x) {
                    return _ref.apply(this, arguments);
                };
            })()
        };

        this.operator.replaceGenerator('browser', generator);
    }

    static getInstaller(operator) {
        return new this(operator);
    }

    install() {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            const jsInstaller = yield _this2.operator.getInstaller('js');
            jsInstaller.addPackage('riot');
            jsInstaller.addDevPackage('tag-loader');

            const webpackInstaller = yield _this2.operator.getInstaller('webpack');
            webpackInstaller.addLoader('\\.tag', [{ loader: 'babel-loader', options: { sourceMap: true } }, { loader: 'tag-loader' }]);
        })();
    }
}

module.exports = RiotLoaderInstaller;
//# sourceMappingURL=installer.js.map