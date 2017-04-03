'use strict'
// @flow

const config = require('../config')
const Build = require('./')

class Builder {
    parent: Build

    /**
     *
     * @param {Build} parent
     */
    constructor(parent: Build) {
        this.parent = parent
    }

    /**
     * @return {string} environment variable - NODE_ENV
     */
    getEnv() {
        return this.parent.env
    }

    /**
     *
     * @param {string} mesg
     */
    message(mesg: string) {
        this.parent.cliUtils.message(mesg, 1)
    }

    /**
     *
     * @param {string} mesg
     */
    verbose(mesg: string) {
        this.parent.cliUtils.verbose(mesg, 1)
    }

    /**
     *
     * @param {string} mesg
     */
    debug(mesg: string) {
        this.parent.cliUtils.debug(mesg, 1)
    }

    /**
     *
     * @param {string} err
     */
    error(err: string) {
        this.parent.cliUtils.error(err, 1)
    }

    /**
     *
     * @param {string} details
     */
    compileError(details: string) {
        this.parent.cliUtils.message('compile error')
        this.parent.cliUtils.error(details, 1)
    }

    /**
     *
     * @param {string} details
     */
    warning(details: string) {
        this.parent.cliUtils.message('compile warning')
        this.parent.cliUtils.error(details, 1)
    }

    /**
     *
     * @param {string} type
     * @returns {string}
     */
    getDirectory(type: string) {
        return config.getLocal('directories')[type]
    }

    compiled() {
        this.parent._compiled()
    }

}

module.exports = Builder
