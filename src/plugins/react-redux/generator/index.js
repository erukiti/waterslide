'use strict'

const fs = require('fs')
const path = require('path')
const process = require('process')
const Mustache = require('mustache')

class ReactReduxGenerator {
    constructor(operator) {
        this.operator = operator
    }

    async generate(name, opts = {}) {
        const toLower = s => s.charAt(0).toLowerCase() + s.slice(1)
        const toUpper = s => s.charAt(0).toUpperCase() + s.slice(1)
        const createPrefix = s => s.split('-').map(v => toUpper(v)).join('')

        const upperPrefix = createPrefix(path.basename(name))
        const lowerPrefix = toLower(upperPrefix)

        const obj = {
            action: `${upperPrefix}Action`,
            component: `${upperPrefix}Component`,
            reducer: `${lowerPrefix}Reducer`,
            name: lowerPrefix
        }

        const render = async (inFile, outFile) => {
            const templ = fs.readFileSync(path.join(__dirname, `${inFile}.mst`)).toString()
            const content = Mustache.render(templ, obj)
            await this.operator.writeFile(path.join(name, `${outFile}`), content)
        }

        await render('action.js', 'action.js')
        await render('component.jsx', 'component.jsx')
        await render('container.js', 'index.js')
        await render('reducer.js', 'reducer.js')
    }
}

module.exports = ReactReduxGenerator
