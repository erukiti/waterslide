'use strict'
// @flow

const os = require('os')
const path = require('path')
const process = require('process')
const fs = require('fs')

export type Entry = {
    path: string,
    opts?: {[string]: string}
}

const JsonFileName = '.innocentia.json'

class Config {
    globalConfigPath: string
    globalConfig: Object
    localConfigPath: string
    localConfig: Object

    constructor() {
        this.globalConfigPath = path.join(os.homedir(), JsonFileName)
        this.globalConfig = this._configRead(this.globalConfigPath)
        this.localConfig = {}
    }

    isExists() {
        try {
            const stat = fs.statSync(path.join(process.cwd(), JsonFileName))
            return stat && typeof stat !== 'undefined'
        } catch (e) {
            return false
        }
    }

    startLocal() {
        this.localConfigPath = path.join(process.cwd(), JsonFileName)
        this.localConfig = this._configRead(this.localConfigPath)
    }

    _configRead(filePath: string) {
        try {
            return JSON.parse(fs.readFileSync(filePath).toString())
        } catch (e) {
            return {}
        }
    }

    _configWrite(filePath: string, config: any) {
        fs.writeFileSync(filePath, `${JSON.stringify(config, null, '  ')}\n`)
    }

    getLocal(key: string) {
        return this.localConfig[key]
    }

    getGlobal(key: string) {
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

    writeLocal(key: string, value: any) {
        this.localConfig[key] = value
        this._configWrite(this.localConfigPath, this.localConfig)
    }

    writeGlobal(key: string, value: any) {
        this.globalConfig[key] = value
        this._configWrite(this.globalConfigPath, this.globalConfig)
    }

}

const config = new Config()

module.exports = config
