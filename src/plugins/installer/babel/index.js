'use strict'

class BabelInstaller {
    constructor(operator) {
        this.operator = operator

        this.values = JSON.parse(operator.readFileSync('.babelrc')) || {presets: [], plugins: []}
    }

    static getInstaller(operator) {
        return new this(operator)
    }

    addPreset(name) {
        if (this.values.presets.includes(name)) {
            return
        }

        this.values.presets.push(name)
    }

    addPlugin(name) {
        if (this.values.plugins.includes(name)) {
            return
        }

        this.values.plugins.push(name)
    }

    async install() {
        this.operator.postInstall(async () => {
            await this.operator.writeFile('.babelrc', JSON.stringify(this.values, null, '  ') + '\n', { isRewritable: true})
        })
    }
}

module.exports = BabelInstaller
