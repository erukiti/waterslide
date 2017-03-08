'use strict'

const path = require('path')
const process = require('process')

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

    static getInstaller(operator) {
        return new this(operator)
    }

    static getUsage() {
        return `
generate JavaScript & HTML for web browser.
  waterslider generate browser <filename>`
    }

    fromCli(argv, opts) {
        if (argv.length < 1) {
            this.operator.message('Usage: waterslider generate browser <filename>')
            process.exit(1)
        }

        const opts2 = {type: 'web'}

        this.generate(argv[0], opts2)
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

    async install() {
        this.operator.postInstall(async () => {
            await Promise.all(this.sources.map(source => {
                this.operator.writeFile(source.path, source.text, source.opts)
            }))
        })
    }
}

module.exports = BrowserGenerator
