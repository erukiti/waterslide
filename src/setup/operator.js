'use strict'

const {getConfig, Plugin} = require('../waterslide')

const config = getConfig()
const plugin = new Plugin()

class Operator {
    constructor(setup) {
        this.setup = setup
    }

    // FIXME
    getOpt() {
        return this.setup.opt
    }

    getNoOpt() {
        return this.setup.noOpt
    }

    getNoUse() {
        return this.setup.noUse
    }

    /**
     * @returns {string}
     */
    getProjectDir() {
        return this.setup.projectDir
    }

    /**
     *
     * @param {number} priority [0..9]
     * @param {string} command
     */
    addCommand(priority, command) {
        this.setup.command.addCommand(priority, command)
    }


    /**
     *
     * @param {string} directory
     * @param {string} type
     * @param {string} description
     */
    // FIXME
    async setDirectory(directory, type, description) {
        const documentInstaller = await this.setup.operator.getInstaller('document')
        documentInstaller.setDirectory(directory, description)
        if (type) {
            this.setup.directories[type] = directory
            config.writeLocal('directories', this.setup.directories)
        }
    }

    /**
     *
     * @param {string} name
     */
    getGenerator(name) {
        if (!this.setup.generators[name]) {
            const Generator = plugin.requireGenerator(name)
            this.setup.generators[name] = new Generator(this.setup.operator)
        }
        return this.setup.generators[name]
    }

    /**
     *
     * @param {string} name
     * @param {Generator} generator
     */
    replaceGenerator(name, generator) {
        if (this.setup.generators[name]) {
            this.setup.operator.error(`${name} generator is already used.`)
        } else {
            this.setup.generators[name] = generator
        }
    }

    /**
     *
     * @param {string} name
     * @returns {Installer}
     */
    async getInstaller(name) {
        if (!this.setup.installers[name]) {
            const klass = plugin.requireInstaller(name)
            const installer = await klass.getInstaller(this.setup.operator)
            if (!installer) {
                this.setup.cliUtils.verbose(`${name} installer is ignored.`)
                return null
            }

            this.setup.cliUtils.verbose(`installer: ${name}`, 1)
            this.setup.installers[name] = installer
        }

        return this.setup.installers[name]
    }

    /**
     *
     * @param {string} name
     * @returns {boolean}
     */
    isInstalled(name) {
        return this.setup.installers[name] !== null
    }

    /**
     *
     * @param {string} name
     */
    setFinalizer(name) {
        this.setup.finalizer = name
        config.writeLocal('finalizer', this.setup.finalizer)
    }

    /**
     *
     * @param {string} name
     */
    addBuilder(name) {
        if (this.setup.builders.includes(name)) {
            return
        }
        this.setup.builders.push(name)
        config.writeLocal('builders', this.setup.builders)
    }

    /**
     *
     * @param {string} name
     */
    addTester(name) {
        if (this.setup.testers.includes(name)) {
            return
        }

        this.setup.testers.push(name)
        config.writeLocal('testers', this.setup.testers)
    }

    /**
     *
     * @param {string} name
     * @returns {Promise<Buffer>}
     */
    readFile(name) {
        return this.setup.fsio.readFile(name)
    }

    /**
     *
     * @param {string} name
     * @returns {Buffer}
     */
    readFileSync(name) {
        return this.setup.fsio.readFileSync(name)
    }

    /**
     *
     * @param {string} name
     * @returns {boolean}
     */
    checkExists(name) {
        return this.setup.fsio.checkExists(name)
    }

    /**
     *
     * @param {string} name
     * @param {string|Buffer} content
     * @param {Object} opts
     */
    writeFile(name, content, opts = {}) {
        this.setup.entries.push({path: name, text: content, opts})

        config.writeLocal('entries', this.setup.entries.filter(entry => entry.opts && entry.opts.type).map(entry => {
            return {path: entry.path, opts: entry.opts}
        }))

        return this.setup.fsio.writeFile(name, content, opts).then(isWrote => {
            if (isWrote) {
                this.setup.cliUtils.verbose(`wrote ${name}`, 1)
            }
        })
    }

    /**
     *
     * @param {function} cb
     */
    postInstall(cb) {
        this.setup.postInstalls.push(cb)
    }

    /**
     *
     * @param {string} title
     * @param {string} message
     */
    setInfo(title, message) {
        this.setup.info.push({title, message})
        config.writeLocal('info', this.setup.info)
    }

    /**
     *
     * @param {string} message
     */
    verbose(message) {
        this.setup.cliUtils.verbose(message, 1)
    }

    /**
     *
     * @param {string} message
     */
    message(message) {
        this.setup.cliUtils.message(message, 1)
    }

    /**
     *
     * @param {string} message
     */
    error(message) {
        this.setup.cliUtils.error(message, 1)
    }
}

module.exports = Operator
