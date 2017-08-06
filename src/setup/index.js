'use strict'
// @flow

const process = require('process')
const fs = require('fs')

const {getConfig, Plugin} = require('../waterslide')
const config = getConfig()
const plugin = new Plugin()
const Fsio = require('./fsio')
const Command = require('./command')
const Operator = require('./operator')
const CliUtils = require('../cli/utils')

import type {Entry} from '../config'

export interface Generator {
    generate(name: string, opts?: Object): void
}

// FIXME
export type Installer = any

// export interface Installer {
//     install: () => {},
//     setDirectory?: (path: string, description?: string) => void
// }

type Info = {
    title: string,
    message: string
}


class Setup {
    fsio: Fsio
    command: Command
    cliUtils: CliUtils
    projectDir: ?string
    installers: {[string]: Installer}
    noOpt: Array<string>
    noUse: Array<string>
    opt: Array<string>
    isUse: boolean
    postInstalls: Array<() => void>
    directories: {[string]: string}
    generators: {[string]: Generator}
    entries: Array<Entry>
    operator: Operator
    target: ?string
    builders: Array<string>
    testers: {[string]: string}
    info: Array<Info>

    constructor(cliUtils: CliUtils) {
        this.fsio = new Fsio()
        this.cliUtils = cliUtils
        this.command = new Command(require('child_process'), cliUtils)
        this.projectDir = null // FIXME
        this.installers = {}
        this.generators = {}
        this.noOpt = []
        this.noUse = []
        this.isUse = false

        this.postInstalls = []

        this.directories = config.getLocal('directories') || {}
        this.entries = config.getLocal('entries') || []
        this.target = config.getLocal('target')
        this.builders = config.getLocal('builders') || []
        this.testers = config.getLocal('testers') || {}
        this.opt = config.getLocal('opt') || []
        this.info = config.getLocal('info') || []

        this.operator = new Operator(this)

        this.operator.addBuilder('copy')
    }

    setProjectDir(name: string) {
        this.projectDir = name
    }

    setUse() {
        this.isUse = true
    }

    setOpt(opt: Array<string>) {
        if (this.opt.length > 0) {
            this.cliUtils.error('warning: opt is already set.')
        }

        this.opt = opt
        config.writeLocal('opt', this.opt)
    }

    setNoOpt(noOpt: Array<string>) {
        if (this.noOpt.length > 0) {
            this.cliUtils.error('warning: noOpts is already set.')
        }

        this.noOpt = noOpt
    }

    setNoUse(noUse: Array<string>) {
        if (this.noUse.length > 0) {
            this.cliUtils.error('warning: noUse is already set.')
        }

        this.noUse = noUse
    }

    async install() {
        let processed = []

        const getNotProcessedKey = () => Object.keys(this.installers).filter(key => !processed.includes(key))

        let notProcessed
        while ((notProcessed = getNotProcessedKey()).length > 0) {
            for (let key of notProcessed) {
                await this.installers[key].install()
            }
            processed = processed.concat(notProcessed)
        }

        await Promise.all(this.postInstalls.map(cb => cb()))

        await this.command.execAll(command => this.cliUtils.verbose(command))
    }
}

module.exports = Setup
