'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');

const { Plugin } = require('../../waterslide');
const plugin = new Plugin();
const icongen = plugin.requireLocal('icon-gen');
const Jimp = plugin.requireLocal('jimp');

class ElectronIconBuilder {
    constructor(builder) {
        this.builder = builder;
        this.src = builder.getDirectory('source');
        this.dest = builder.getDirectory('destination');
        this.isCompiled = false;
    }

    getTypes() {
        return ['electron-icon'];
    }

    _run(entries) {
        var _this = this;

        return _asyncToGenerator(function* () {
            yield Promise.all(entries.map((() => {
                var _ref = _asyncToGenerator(function* (entry) {
                    const temp = fs.mkdtempSync('/tmp/ws-');
                    yield Jimp.read(entry.path).then((() => {
                        var _ref2 = _asyncToGenerator(function* (image) {
                            yield Promise.all([16, 24, 32, 48, 64, 128, 256, 512, 1024].map(function (size) {
                                return new Promise(function (resolve, reject) {
                                    image.clone().resize(size, size).write(path.join(temp, `${size}.png`), function () {
                                        resolve();
                                    });
                                });
                            }));
                        });

                        return function (_x2) {
                            return _ref2.apply(this, arguments);
                        };
                    })());

                    const dest = path.dirname(entry.path.replace(_this.src, _this.dest));
                    const name = path.basename(entry.path, '.png');

                    return icongen(temp, dest, {
                        type: 'png',
                        modes: ['ico', 'icns'],
                        names: { ico: name, icns: name }
                    });
                });

                return function (_x) {
                    return _ref.apply(this, arguments);
                };
            })()));

            _this.isCompiled = true;
            _this.builder.compiled();
        })();
    }

    run(entries) {
        this._run(entries).catch(e => console.dir(e));
    }

    watch(entries) {
        // this._run(entries).forEach(filepath => {
        //     fs.watch(filepath, (event, filename) => {
        //         this._copy(filepath)
        //         this.isCompiled = true
        //         this.builder.compiled()
        //     })
        // })
    }
}

module.exports = ElectronIconBuilder;
//# sourceMappingURL=builder.js.map