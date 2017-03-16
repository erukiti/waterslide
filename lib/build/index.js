'use strict';

const { EventEmitter } = require('events');

const config = require('../config');
const Plugin = require('../plugin');
const plugin = new Plugin();

const Builder = require('./builder');

class Build {
    /**
     *
     * @param {CliUtis} cliUtils
     * @param {*} opts
     */
    constructor(cliUtils, opts) {
        config.startLocal();

        this.builder = new Builder(this);
        this.cliUtils = cliUtils;

        this.isBuild = opts.build;
        this.isRun = opts.run;
        this.isTest = opts.test;
        this.isWatch = opts.watch;
        this.env = opts.env || 'development';

        this.entries = config.getLocal('entries');
        this.testers = [];
        this.builders = config.getLocal('builders').map(name => {
            const Klass = plugin.requireBuilder(name);
            return new Klass(this.builder);
        });
    }

    _compiled() {
        if (this.builders.find(builder => !builder.isCompiled)) {
            return;
        }

        this._test();

        if (this.isBuild || this.isRun) {
            // assert if (config.getLocal('finalizer')) {

            if (!config.getLocal('finalizer')) {
                this.cliUtils.message('build complete.');
                return;
            }

            if (!this.finalizer) {
                const Klass = plugin.requireFinalizer(config.getLocal('finalizer'));
                this.finalizer = new Klass(this.builder);
            }
            // assertFalse(this.isBuild && this.isRun)

            if (this.isBuild) {
                this.finalizer.build();
            } else if (this.isRun) {
                this.cliUtils.message('run application');
                this.finalizer.run();
            }
        }
    }

    _test() {
        if (this.isTest && this.testers.length > 0) {
            this.testers.forEach(tester => {
                const result = tester.test();
                const className = tester.constructor.name;
                if (result.isError) {
                    this.builder.error(className);
                    if (result.stdout) {
                        this.builder.error(result.stdout);
                    }
                    if (result.stderr) {
                        this.builder.error(result.stderr);
                    }
                } else {
                    this.builder.message(`${className}: no error`);
                }
            });
        }
    }

    process() {
        if (this.isTest) {
            const testers = config.getLocal('testers') || [];

            testers.forEach(name => {
                const Klass = plugin.requireTester(name);
                const tester = new Klass(this.builder);
                // if (this.isWatch) {
                //     tester.watch()
                // } else {
                this.testers.push(tester);
                // }
            });

            if (!this.isRun && !this.isBuild) {
                this._test();
                return;
            }
        }

        this.builders.forEach(builder => {
            const entries = this.entries.filter(entry => entry.opts && builder.getTypes().includes(entry.opts.type));

            if (this.isWatch) {
                builder.watch(entries);
            } else {
                builder.run(entries);
            }
        });
    }
}

module.exports = Build;
//# sourceMappingURL=index.js.map