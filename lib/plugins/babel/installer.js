'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class BabelInstaller {
    constructor(operator) {
        this.operator = operator;

        this.values = JSON.parse(operator.readFileSync('.babelrc')) || { presets: [], plugins: [] };
    }

    static getInstaller(operator) {
        return new this(operator);
    }

    addPreset(name) {
        if (this.values.presets.includes(name)) {
            return;
        }

        this.values.presets.push(name);
    }

    addPlugin(name) {
        if (this.values.plugins.includes(name)) {
            return;
        }

        this.values.plugins.push(name);
    }

    install() {
        var _this = this;

        return _asyncToGenerator(function* () {
            const jsInstaller = _this.operator.getInstaller('js');
            jsInstaller.addDevPackage('babel-core');
            jsInstaller.addDevPackage('babel-loader');
            jsInstaller.addDevPackage('babel-preset-env');
            _this.addPreset('env');

            _this.operator.postInstall(_asyncToGenerator(function* () {
                yield _this.operator.writeFile('.babelrc', `${JSON.stringify(_this.values, null, '  ')}\n`, { isRewritable: true });
            }));
        })();
    }
}

module.exports = BabelInstaller;
//# sourceMappingURL=installer.js.map