'use strict'

class BrowserProject {
    constructor(operator) {
        this.operator = operator
        operator.setTarget('browser')
    }

    async install() {
        await this.operator.getInstaller('js')
        const g = this.operator.getGenerator('browser')
        await g.generate('src/index.js', {type: 'web'})

        await this.operator.setDirectory('src', 'source', 'source code directory')
        await this.operator.setDirectory('build', 'destination', 'build directory')
    }
}

module.exports = BrowserProject
