'use strict'

const os = require('os')
const path = require('path')
const process = require('process')
const fs = require('fs')

class Config {
    constructor() {
        this.globalConfigPath = path.join(os.homedir(), '.waterslide.json')
        this.globalConfig = this._configRead(this.globalConfigPath)
        this.localConfig = {}
    }

    isExists() {
        try {
            const stat = fs.statSync(path.join(process.cwd(), '.waterslide.json'))
            return stat && typeof stat !== 'undefined'
        } catch (e) {
            return false
        }
    }

    startLocal() {
        this.localConfigPath = path.join(process.cwd(), '.waterslide.json')
        this.localConfig = this._configRead(this.localConfigPath)
    }

    _configRead(filePath) {
        try {
            return JSON.parse(fs.readFileSync(filePath))
        } catch (e) {
            return {}
        }
    }

    _configWrite(filePath, config) {
        fs.writeFileSync(filePath, `${JSON.stringify(config, null, '  ')}\n`)
    }

    getLocal(key) {
        return this.localConfig[key]
    }

    getGlobal(key) {
        return this.globalConfig[key]
    }

    getAuthor() {
        if (this.globalConfig.author) {
            return this.globalConfig.author
        } else {
            const author = {}
            if (this.globalConfig.name) {
                author.name = this.globalConfig.name
            }
            if (this.globalConfig.email) {
                author.email = this.globalConfig.email
            }
            if (this.globalConfig.homepage) {
                author.url = this.globalConfig.homepage
            }

            return author
        }
    }

    writeLocal(key, value) {
        this.localConfig[key] = value
        this._configWrite(this.localConfigPath, this.localConfig)
    }

    writeGlobal(key, value) {
        this.globalConfig[key] = value
        this._configWrite(this.globalConfigPath, this.globalConfig)
    }

}

const config = new Config()

module.exports = config
