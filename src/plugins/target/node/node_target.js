'use strict'

const indexJsText =
`'use strict'

console.log('Hello, Node.js World.')
`

class ElectronTarget {
    constructor(operator) {
        this.operator = operator
        operator.setFinalizer('node')
    }

    process() {
        const jsGenerator = this.operator.getGenerator('js')
        jsGenerator.setMain('src/index.js')

        this.operator.setDirectory('src', 'source', 'source code directory')
        // this.operator.setDirectory('build', 'destination', 'build directory')
    }

    output() {
        return [
            {path: 'src/index.js', text: indexJsText, opts: {type: 'node'}}
        ]
    }
}

module.exports = ElectronTarget
