'use strict'

const indexJsText =
`'use strict'

console.log('Hello, Node.js World.')
`

class NodeProject {
    constructor(operator) {
        this.operator = operator
        operator.setFinalizer('node')
    }

    async install() {
        const jsGenerator = await this.operator.getInstaller('js')
        jsGenerator.setMain('lib/index.js')

        this.operator.setDirectory('src', 'source', 'source code directory')
        this.operator.setDirectory('lib', 'destination', 'build directory')

        await this.operator.writeFile('src/index.js', indexJsText, {type: 'node'})
    }
}

module.exports = NodeProject
