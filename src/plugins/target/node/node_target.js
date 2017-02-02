'use strict'

const indexJsText =
`'use strict'

console.log('hello, world.)
`

class ElectronTarget {
    constructor(operator) {
        this.operator = operator
        operator.requireProvider('js')
    }

    process() {
        const jsProvider = this.operator.getProvider('js')
        jsProvider.setMain('src/index.js')

        this.operator.setDirectory('src', 'source', 'source code directory')
        // this.operator.setDirectory('build', 'destination', 'build directory')

        return [
            {path: 'src/index.js', text: indexJsText, opts: {type: 'node'}}
        ]
    }
}

module.exports = ElectronTarget
