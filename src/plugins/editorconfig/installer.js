'use strict'

const fs = require('fs')
const path = require('path')

class EditorconfigInstaller {
    constructor(operator) {
        this.operator = operator
    }

    static async getInstaller(operator) {
        if (await operator.checkExists('.editorconfig')) {
            return null
        }
        return new this(operator)
    }

    async install() {
        const config = fs.readFileSync(path.join(__dirname, 'editorconfig'))
        await this.operator.writeFile('.editorconfig', config)
    }
}

module.exports = EditorconfigInstaller
