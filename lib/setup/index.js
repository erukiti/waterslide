'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const process = require('process');
const fs = require('fs');

const { getConfig, Plugin } = require('../waterslide');
const config = getConfig();
const plugin = new Plugin();
const Fsio = require('./fsio');
const Command = require('./command');
const Operator = require('./operator');
const CliUtils = require('../cli/utils');

// FIXME


// export interface Installer {
//     install: () => {},
//     setDirectory?: (path: string, description?: string) => void
// }

class Setup {

    constructor(cliUtils) {
        this.fsio = new Fsio();
        this.cliUtils = cliUtils;
        this.command = new Command(require('child_process'));
        this.projectDir = null; // FIXME
        this.installers = {};
        this.generators = {};
        this.noOpt = [];
        this.noUse = [];

        this.postInstalls = [];

        this.directories = config.getLocal('directories') || {};
        this.entries = config.getLocal('entries') || [];
        this.finalizer = config.getLocal('finalizer');
        this.builders = config.getLocal('builders') || [];
        this.testers = config.getLocal('testers') || [];
        this.opt = config.getLocal('opt') || [];
        this.info = config.getLocal('info') || [];

        this.operator = new Operator(this);

        this.operator.addBuilder('copy');
    }

    setProjectDir(name) {
        this.projectDir = name;
    }

    setOpt(opt) {
        if (this.opt.length > 0) {
            this.cliUtils.error('warning: opt is already set.');
        }

        this.opt = opt;
        config.writeLocal('opt', this.opt);
    }

    setNoOpt(noOpt) {
        if (this.noOpt.length > 0) {
            this.cliUtils.error('warning: noOpts is already set.');
        }

        this.noOpt = noOpt;
    }

    setNoUse(noUse) {
        if (this.noUse.length > 0) {
            this.cliUtils.error('warning: noUse is already set.');
        }

        this.noUse = noUse;
    }

    install() {
        var _this = this;

        return _asyncToGenerator(function* () {
            let processed = [];

            const getNotProcessedKey = function () {
                return Object.keys(_this.installers).filter(function (key) {
                    return !processed.includes(key);
                });
            };

            let notProcessed;
            while ((notProcessed = getNotProcessedKey()).length > 0) {
                for (let key of notProcessed) {
                    yield _this.installers[key].install();
                }
                processed = processed.concat(notProcessed);
            }

            yield Promise.all(_this.postInstalls.map(function (cb) {
                return cb();
            }));

            yield _this.command.execAll(function (command) {
                return _this.cliUtils.verbose(command);
            });
        })();
    }
}

module.exports = Setup;
//# sourceMappingURL=index.js.map