'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const { utils, getConfig } = require('../../waterslide');
const config = getConfig();

class WebpackInstaller {
    constructor(operator) {
        this.operator = operator;
        this.values = config.getLocal('webpack') || { rules: [] };
    }

    static getInstaller(operator) {
        return new this(operator);
    }

    addLoader(test, use) {
        const found = this.values.rules.findIndex(value => value.test === test);
        if (found !== -1) {
            use.forEach(({ loader, options }) => {
                if (!this.values.rules[found].use.find(value => value.loader === loader)) {
                    this.values.rules[found].use.push({ loader, options, exclude: 'node_modules' });
                }
            });

            return;
        }
        this.values.rules.push({ test, use });
        getConfig().writeLocal('webpack', this.values);
    }

    install() {
        var _this = this;

        return _asyncToGenerator(function* () {
            _this.operator.addBuilder('webpack');
            const jsInstaller = yield _this.operator.getInstaller('js');
            jsInstaller.addDevPackage('webpack');
            jsInstaller.addDevPackage('babel-loader');
        })();
    }
}

module.exports = WebpackInstaller;
//# sourceMappingURL=installer.js.map