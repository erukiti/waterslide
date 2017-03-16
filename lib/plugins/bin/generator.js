'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const fs = require('fs');
const path = require('path');

class BinGenerator {
    constructor(operator) {
        this.operator = operator;
    }

    generate(name, opts = {}) {
        var _this = this;

        return _asyncToGenerator(function* () {
            const binText = fs.readFileSync(path.join(__dirname, 'bin.js'));
            _this.operator.writeFile(`bin/${name}`, binText, { mode: 0o755 });

            const jsInstaller = yield _this.operator.getInstaller('js');
            jsInstaller.addBin(`bin/${name}`);
        })();
    }
}

module.exports = BinGenerator;
//# sourceMappingURL=generator.js.map