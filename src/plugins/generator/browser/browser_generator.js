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
    }

    generateSource(name, opts = {}) {
        const dirname = path.dirname(name)
        const prefix = path.basename(name, '.js')

        return [{
                path: path.join(dirname, `${prefix}.html`),
                text: createHtml(prefix),
                opts: {type: 'copy'}
            }, {
                path: path.join(dirname, `${prefix}.js`),
                text: createJS(),
                opts
            }
        ]
    }
}

module.exports = BrowserGenerator
