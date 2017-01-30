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

class BrowserSampleSourceProvider {
    constructor(operator) {
        this.operator = operator
        this.sampleText = ''
        this.pathinfos = []
        this.addition = []
    }

    createSample(pathname, prefix) {
        this.pathinfos.push({pathname, prefix})
    }

    replaceSource(text) {
        // FIXME: replaceSource がかちあった時にエラーにする
        this.sampleText = text
    }

    addSource(pathname, text) {
        this.addition.push({pathname, text})
    }

    outputs() {
        const sources = []

        this.pathinfos.forEach(pathinfo => {
            sources.push({
                path: `${path.join(pathinfo.pathname, pathinfo.prefix)}.html`,
                text: createHtml(pathinfo.prefix)
            })

            sources.push({
                path: `${path.join(pathinfo.pathname, pathinfo.prefix)}.js`,
                text: createJS()
            })
        })

        return sources
    }
}

module.exports = BrowserSampleSourceProvider
