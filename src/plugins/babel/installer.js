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
        const jsInstaller = await this.operator.getInstaller('js')
        jsInstaller.addDevPackage('babel-core')
        jsInstaller.addDevPackage('babel-loader')
        jsInstaller.addDevPackage('babel-preset-env')
        this.addPreset('env')

        this.operator.postInstall(async () => {
            await this.operator.writeFile('.babelrc', `${JSON.stringify(this.values, null, '  ')}\n`, {isRewritable: true})
        })
    }
}

module.exports = BabelInstaller
