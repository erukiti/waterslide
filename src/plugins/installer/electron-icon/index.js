'use strict'

class ElectronIconInstaller {
    constructor(operator) {
        this.operator = operator
    }

    static async getInstaller(operator) {
        return new this(operator)
    }

    async install() {
        this.operator.addBuilder('electron-icon')

        const jsInstaller = await this.operator.getInstaller('js')
        jsInstaller.addDevPackage('jimp')
        jsInstaller.addDevPackage('icon-gen')
    }
}

module.exports = ElectronIconInstaller