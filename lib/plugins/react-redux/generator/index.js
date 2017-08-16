'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const fs = require('fs');
const path = require('path');
const process = require('process');
const Mustache = require('mustache');

class ReactReduxGenerator {
    constructor(operator) {
        this.operator = operator;
    }

    generate(name, opts = {}) {
        var _this = this;

        return _asyncToGenerator(function* () {
            const toLower = function (s) {
                return s.charAt(0).toLowerCase() + s.slice(1);
            };
            const toUpper = function (s) {
                return s.charAt(0).toUpperCase() + s.slice(1);
            };
            const createPrefix = function (s) {
                return s.split('-').map(function (v) {
                    return toUpper(v);
                }).join('');
            };

            const upperPrefix = createPrefix(path.basename(name));
            const lowerPrefix = toLower(upperPrefix);

            const obj = {
                action: `${upperPrefix}Action`,
                component: `${upperPrefix}Component`,
                reducer: `${lowerPrefix}Reducer`,
                name: lowerPrefix
            };

            const render = (() => {
                var _ref = _asyncToGenerator(function* (inFile, outFile) {
                    const templ = fs.readFileSync(path.join(__dirname, `${inFile}.mst`)).toString();
                    const content = Mustache.render(templ, obj);
                    yield _this.operator.writeFile(path.join(name, `${outFile}`), content);
                });

                return function render(_x, _x2) {
                    return _ref.apply(this, arguments);
                };
            })();

            yield render('action.js', 'action.js');
            yield render('component.jsx', 'component.jsx');
            yield render('container.js', 'index.js');
            yield render('reducer.js', 'reducer.js');
        })();
    }
}

module.exports = ReactReduxGenerator;
//# sourceMappingURL=index.js.map