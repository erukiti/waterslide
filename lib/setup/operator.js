'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const { getConfig, Plugin } = require('../waterslide');
const Setup = require('./');


const config = getConfig();
const plugin = new Plugin();

class Operator {

    constructor(setup) {
        this.setup = setup;
    }

    // FIXME
    getOpt() {
        return this.setup.opt;
    }

    getNoOpt() {
        return this.setup.noOpt;
    }

    getNoUse() {
        return this.setup.noUse;
    }

    getIsUse() {
        return this.setup.isUse;
    }

    /**
     * @returns {string}
     */
    getProjectDir() {
        return this.setup.projectDir;
    }

    /**
     *
     * @param {number} priority [0..9]
     * @param {string} command
     */
    addCommand(priority, command) {
        this.setup.command.addCommand(priority, command);
    }

    /**
     *
     * @param {string} directory
     * @param {string} type
     * @param {string} description
     */
    // FIXME
    setDirectory(directory, type, description) {
        var _this = this;

        return _asyncToGenerator(function* () {
            const documentInstaller = yield _this.getInstaller('document');
            // console.dir(typeof documentInstaller.setDirectory)
            // if (typeof documentInstaller.setDriectory !== 'function') {
            //     throw Error()
            // }

            documentInstaller.setDirectory(directory, description);
            if (type) {
                _this.setup.directories[type] = directory;
                config.writeLocal('directories', _this.setup.directories);
            }
        })();
    }

    /**
     *
     * @param {string} name
     */
    getGenerator(name) {
        if (!this.setup.generators[name]) {
            const Klass = plugin.requireGenerator(name);
            this.setup.generators[name] = new Klass(this.setup.operator);
        }
        return this.setup.generators[name];
    }

    /**
     *
     * @param {string} name
     * @param {Generator} generator
     */
    replaceGenerator(name, generator) {
        if (this.setup.generators[name]) {
            this.setup.operator.error(`${name} generator is already used.`);
        } else {
            this.setup.generators[name] = generator;
        }
    }

    /**
     *
     * @param {string} name
     * @returns {Installer}
     */
    getInstaller(name) {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            if (!_this2.setup.installers[name]) {
                const klass = plugin.requireInstaller(name);
                const installer = yield klass.getInstaller(_this2.setup.operator);
                if (!installer) {
                    _this2.setup.cliUtils.verbose(`${name} installer is ignored.`);

                    return {
                        install: function () {}
                    };
                }

                _this2.setup.cliUtils.verbose(`installer: ${name}`, 1);
                _this2.setup.installers[name] = installer;
            }

            return _this2.setup.installers[name];
        })();
    }

    /**
     *
     * @param {string} name
     * @returns {boolean}
     */
    isInstalled(name) {
        return this.setup.installers[name] !== null;
    }

    /**
     *
     * @param {string} name
     */
    setTarget(name) {
        this.setup.target = name;
        config.writeLocal('target', this.setup.target);
    }

    /**
     *
     * @param {string} name
     */
    addBuilder(name) {
        if (this.setup.builders.includes(name)) {
            return;
        }
        this.setup.builders.push(name);
        config.writeLocal('builders', this.setup.builders);
    }

    /**
     *
     * @param {string} name
     */
    addTester(name, command) {
        if (typeof this.setup.testers[name] === 'string') {
            return;
        }

        this.setup.testers[name] = command;
        config.writeLocal('testers', this.setup.testers);
    }

    /**
     *
     * @param {string} name
     * @returns {Promise<Buffer>}
     */
    readFile(name) {
        return this.setup.fsio.readFile(name);
    }

    /**
     *
     * @param {string} name
     * @returns {Buffer}
     */
    readFileSync(name) {
        return this.setup.fsio.readFileSync(name);
    }

    /**
     *
     * @param {string} name
     * @returns {boolean}
     */
    checkExists(name) {
        return this.setup.fsio.checkExists(name);
    }

    /**
     *
     * @param {string} src
     * @param {string|Buffer} content
     * @param {Object} opts
     */
    writeFile(src, content, opts = {}) {
        if ('type' in opts) {
            const opts2 = Object.assign({}, opts);
            delete opts2.type;
            this.setup.entries.push({ src, type: opts.type, opts });
        } else {
            this.setup.entries.push({ src, opts });
        }

        config.writeLocal('entries', this.setup.entries.filter(entry => entry.opts && entry.opts.type).map(entry => {
            const opts2 = Object.assign({}, entry.opts);
            delete opts2.type;
            return { src: entry.src, type: entry.opts.type, opts: opts2 };
        }));

        return this.setup.fsio.writeFile(src, content, opts).then(isWrote => {
            if (isWrote) {
                this.setup.cliUtils.message(`wrote ${src}`, 1);
            }
        });
    }

    /**
     *
     * @param {function} cb
     */
    postInstall(cb) {
        this.setup.postInstalls.push(cb);
    }

    /**
     *
     * @param {string} title
     * @param {string} message
     */
    setInfo(title, message) {
        this.setup.info.push({ title, message });
        config.writeLocal('info', this.setup.info);
    }

    /**
     *
     * @param {string} message
     */
    verbose(message) {
        this.setup.cliUtils.verbose(message, 1);
    }

    /**
     *
     * @param {string} message
     */
    message(message) {
        this.setup.cliUtils.message(message, 1);
    }

    /**
     *
     * @param {string} message
     */
    error(message) {
        this.setup.cliUtils.error(message, 1);
    }
}

module.exports = Operator;
//# sourceMappingURL=operator.js.map