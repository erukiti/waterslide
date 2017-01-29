'use strict'

const fs = require('fs')
const os = require('os')
const path = require('path')

class SettingReader {
    constructor() {
        this.configPath = path.join(os.homedir(), '.waterslider.json')
        this.config = {}
        try {
            this.config = JSON.parse(fs.readFileSync(this.configPath))
            console.dir(config)
        } catch(e) {
            // nice catch
        }
    }

    get(key) {
        return this.config[key]
    }

    getAll() {
        return this.config
    }
}

module.exports = SettingReader
