'use strict';

const config = require('../config');
const Build = require('./');

class Builder {

    /**
     *
     * @param {Build} parent
     */
    constructor(parent) {
        this.parent = parent;
    }

    /**
     * @return {string} environment variable - NODE_ENV
     */
    getEnv() {
        return this.parent.env;
    }

    /**
     *
     * @param {string} mesg
     */
    message(mesg) {
        this.parent.cliUtils.message(mesg, 1);
    }

    /**
     *
     * @param {string} mesg
     */
    verbose(mesg) {
        this.parent.cliUtils.verbose(mesg, 1);
    }

    /**
     *
     * @param {string} mesg
     */
    debug(mesg) {
        this.parent.cliUtils.debug(mesg, 1);
    }

    /**
     *
     * @param {string} err
     */
    error(err) {
        this.parent.cliUtils.error(err, 1);
    }

    /**
     *
     * @param {string} details
     */
    compileError(details) {
        this.parent.cliUtils.message('compile error');
        this.parent.cliUtils.error(details, 1);
    }

    /**
     *
     * @param {string} details
     */
    warning(details) {
        this.parent.cliUtils.message('compile warning');
        this.parent.cliUtils.error(details, 1);
    }

    /**
     *
     * @param {string} type
     * @returns {string}
     */
    getDirectory(type) {
        return config.getLocal('directories')[type];
    }

    compiled() {
        this.parent._compiled();
    }

}

module.exports = Builder;
//# sourceMappingURL=builder.js.map