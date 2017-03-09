'use strict'

const fs = require('fs')

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
        const config = fs.readFileSync(require.resolve('./.editorconfig'))
        await this.operator.writeFile('.editorconfig', config)
    }
}

module.exports = EditorconfigInstaller
