'use strict'

const fs = require('fs')
const os = require('os')
const path = require('path')

class SettingWriter {
    constructor() {
        this.configPath = path.join(os.homedir(), '.waterslider.json')
    }

    write(key, value) {
        let config = {}
        try {
            config = JSON.parse(fs.readFileSync(this.configPath))
            console.dir(config)
        } catch(e) {
            // nice catch
        }
        config[key] = value

        fs.writeFileSync(this.configPath, JSON.stringify(config, null, '  ') + '\n')
    }
}

module.exports = SettingWriter
