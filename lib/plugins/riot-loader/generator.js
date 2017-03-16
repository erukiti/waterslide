'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const path = require('path');
const fs = require('fs');
const Mustache = require('mustache');

class RiotLoaderGenerator {
    constructor(operator) {
        this.operator = operator;
    }

    generate(name, opts = {}) {
        var _this = this;

        return _asyncToGenerator(function* () {
            const obj = {
                name: path.basename(name, '.tag')
            };

            const render = (() => {
                var _ref = _asyncToGenerator(function* (inFile, outFile) {
                    const templ = fs.readFileSync(path.join(__dirname, `${inFile}.mst`)).toString();
                    const content = Mustache.render(templ, obj);
                    yield _this.operator.writeFile(outFile, content);
                });

                return function render(_x, _x2) {
                    return _ref.apply(this, arguments);
                };
            })();

            yield render('sample.tag', name);
        })();
    }
}

module.exports = RiotLoaderGenerator;
//# sourceMappingURL=generator.js.map