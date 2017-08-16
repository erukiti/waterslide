'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const path = require('path');
const fs = require('fs');
const Mustache = require('mustache');

class ReactReduxInstaller {
    constructor(operator) {
        var _this = this;

        this.operator = operator;

        const generator = {
            generate: (() => {
                var _ref = _asyncToGenerator(function* (name, opts = {}) {
                    const prefix = path.basename(name, '.js');
                    const obj = { prefix };
                    const render = (() => {
                        var _ref2 = _asyncToGenerator(function* (inFile, outFile, opts2 = {}) {
                            const fn = path.join(__dirname, `${inFile}.mst`);
                            const templ = fs.readFileSync(fn).toString();
                            const content = Mustache.render(templ, obj);
                            yield _this.operator.writeFile(outFile, content, opts2);
                        });

                        return function render(_x2, _x3) {
                            return _ref2.apply(this, arguments);
                        };
                    })();

                    const dir = path.dirname(name);
                    yield render('actions.js', `${dir}/actions.js`);
                    yield render('index.html', `${dir}/${prefix}.html`, { type: 'copy' });
                    yield render('index.jsx', `${dir}/${prefix}.jsx`, opts);
                    yield render('reducers.js', `${dir}/reducers.js`);

                    yield _this.operator.getGenerator('react-redux').generate(`${dir}/app`);
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
            const babelInstaller = yield _this2.operator.getInstaller('babel');
            babelInstaller.addPreset('react');
            babelInstaller.addPlugin('babel-plugin-syntax-jsx');

            const jsInstaller = yield _this2.operator.getInstaller('js');
            jsInstaller.addDevPackage('babel-preset-react');
            jsInstaller.addDevPackage('babel-plugin-syntax-jsx');
            jsInstaller.addPackage('react');
            jsInstaller.addPackage('react-dom');
            jsInstaller.addPackage('react-redux');
            jsInstaller.addPackage('redux');
        })();
    }
}

module.exports = ReactReduxInstaller;
//# sourceMappingURL=index.js.map