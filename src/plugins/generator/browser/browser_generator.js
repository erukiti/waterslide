'use strict'

const path = require('path')

const createHtml = prefix =>
`<!DOCTYPE html>
<html lang="ja">
<meta charset="utf-8">

<body>
    <div id="root"></div>

    <script src="./${prefix}.js"></script>
</body>

</html>
`

const createJS = () =>
`'use strict'

const div = document.getElementById('root')
div.outerHTML = '<div>HOGE</div>'
`

class BrowserGenerator {
    constructor(operator) {
        this.operator = operator
        this.sources = []
    }

    generate(name, opts = {}) {
        const dirname = path.dirname(name)
        const prefix = path.basename(name, '.js')

        this.sources.push({
                path: path.join(dirname, `${prefix}.html`),
                text: createHtml(prefix),
                opts: {type: 'copy'}
        })
        this.sources.push({
                path: path.join(dirname, `${prefix}.js`),
                text: createJS(),
                opts
        })
    }

    process() {

    }
    output() {
        return this.sources
    }
}

module.exports = BrowserGenerator
