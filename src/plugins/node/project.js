'use strict'

const indexJsText =
`'use strict'

console.log('Hello, Node.js World.')
`

class NodeProject {
    constructor(operator) {
        this.operator = operator
        operator.setTarget('node')
    }

    async install() {
        const jsInstaller = await this.operator.getInstaller('js')
        jsInstaller.setMain('lib/index.js')

        await this.operator.setDirectory('src', 'source', 'source code directory')
        await this.operator.setDirectory('lib', 'destination', 'build directory')

        await this.operator.writeFile('src/index.js', indexJsText, {type: 'node'})
    }
}

module.exports = NodeProject
