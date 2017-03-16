'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const { utils } = require('../../waterslide');

class SassInstaller {
    constructor(operator) {
        this.operator = operator;
    }

    static getInstaller(operator) {
        return new this(operator);
    }

    install() {
        var _this = this;

        return _asyncToGenerator(function* () {
            _this.operator.addBuilder('sass');
        })();
    }
}

module.exports = SassInstaller;
//# sourceMappingURL=installer.js.map