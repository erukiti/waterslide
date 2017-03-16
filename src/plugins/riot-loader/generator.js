'use strict'

const path = require('path')
const fs = require('fs')
const Mustache = require('mustache')

class RiotLoaderGenerator {
    constructor(operator) {
        this.operator = operator
    }

    async generate(name, opts = {}) {
        const obj = {
            name: path.basename(name, '.tag')
        }

        const render = async (inFile, outFile) => {
            const templ = fs.readFileSync(path.join(__dirname, `${inFile}.mst`)).toString()
            const content = Mustache.render(templ, obj)
            await this.operator.writeFile(outFile, content)
        }

        await render('sample.tag', name)
    }
}

module.exports = RiotLoaderGenerator
