'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const fs = require('fs');
const path = require('path');

class EditorconfigInstaller {
    constructor(operator) {
        this.operator = operator;
    }

    static getInstaller(operator) {
        var _this = this;

        return _asyncToGenerator(function* () {
            if (yield operator.checkExists('.editorconfig')) {
                return null;
            }
            return new _this(operator);
        })();
    }

    install() {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            const config = fs.readFileSync(path.join(__dirname, 'editorconfig'));
            yield _this2.operator.writeFile('.editorconfig', config);
        })();
    }
}

module.exports = EditorconfigInstaller;
//# sourceMappingURL=installer.js.map