'use strict'

class BabelGenerator {
    constructor(operator) {
        this.operator = operator
        this.presets = []
        this.plugins = []
    }
    addPreset(name) {
        // こいつがpackage.jsonにpluginを追加すべきかどうか？
        this.presets.push(name)
    }
    addPlugin(name) {
        this.plugins.push(name)
    }

    async install() {
        const values = {
            presets: this.presets,
            plugins: this.plugins
        }

        this.operator.postInstall(async () => {
            await this.operator.writeFile('.babelrc', JSON.stringify(values, null, '  '))
        })
    }
}

module.exports = BabelGenerator
