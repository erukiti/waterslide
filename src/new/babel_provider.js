'use strict'

class BabelProvider {
    constructor(operator) {
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

    outputs() {
        const values = {
            presets: this.presets,
            plugins: this.plugins
        }
        return [{
            path: '.babelrc',
            text: JSON.stringify(values, null, '  ')
        }]
    }
}

module.exports = BabelProvider