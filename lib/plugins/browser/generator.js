'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const fs = require('fs');
const path = require('path');
const process = require('process');
const Mustache = require('mustache');

class BrowserGenerator {
    constructor(operator) {
        this.operator = operator;
    }

    generate(name, opts = {}) {
        var _this = this;

        return _asyncToGenerator(function* () {
            const dirname = path.dirname(name);
            const prefix = path.basename(name, '.js');

            const templateHtml = fs.readFileSync(path.join(__dirname, 'sample.html.mst')).toString();
            const html = Mustache.render(templateHtml, { prefix });

            const sampleJs = fs.readFileSync(path.join(__dirname, 'sample.js'));

            _this.operator.writeFile(path.join(dirname, `${prefix}.html`), html, { type: 'copy' });
            _this.operator.writeFile(path.join(dirname, `${prefix}.js`), sampleJs, opts);
        })();
    }
}

module.exports = BrowserGenerator;
//# sourceMappingURL=generator.js.map