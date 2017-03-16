'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');
const sass = require('node-sass');

class SassBuilder {
    constructor(builder) {
        this.builder = builder;
        this.src = builder.getDirectory('source');
        this.dest = builder.getDirectory('destination');
        this.isCompiled = false;
    }

    getTypes() {
        return ['sass'];
    }

    _sass(src) {
        const reSrc = new RegExp(`^${this.src}/`);

        const dest = src.replace(reSrc, `${this.dest}/`).replace(/(\.scss|\.sass)$/, '.css');

        this.builder.debug(`sass: ${src} -> ${dest}`);

        mkdirp.sync(path.dirname(dest));

        return new Promise((resolve, reject) => {
            sass.render({ file: src, outFile: dest }, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    fs.writeFileSync(dest, result.css);
                    resolve();
                }
            });
        });
    }

    _run(entries) {
        var _this = this;

        return _asyncToGenerator(function* () {
            const files = entries.map(function (entry) {
                return entry.path;
            });

            _this.builder.verbose(`sass builder: ${files.join(', ')}`);

            for (let filePath of files) {
                yield _this._sass(filePath);
            }

            _this.isCompiled = true;
            _this.builder.compiled();

            return files;
        })();
    }

    run(entries) {
        this._run(entries);
    }

    watch(entries) {}
}

module.exports = SassBuilder;
//# sourceMappingURL=builder.js.map