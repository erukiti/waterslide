'use strict'

const path = require('path')
const fs = require('fs')
const Mustache = require('mustache')

class ReactReduxInstaller {
    constructor(operator) {
        this.operator = operator

        const thisDir = path.dirname(require.resolve('./index.jsx.mst'))

        const generator = {
            generate: async (name, opts = {}) => {
                const prefix = path.basename(name, '.js')
                const obj = { prefix }
                const render = async (inFile, outFile, opts2 = {}) => {
                    const fn = path.join(thisDir, `${inFile}.mst`)
                    const templ = fs.readFileSync(fn).toString()
                    const content = Mustache.render(templ, obj)
                    await this.operator.writeFile(outFile, content, opts2)
                }

                const dir = path.dirname(name)
                await render('actions.js', `${dir}/actions.js`)
                await render(`index.html`, `${dir}/${prefix}.html`, { type: 'copy'})
                await render(`index.jsx`, `${dir}/${prefix}.jsx`, opts)
                await render(`reducers.js`, `${dir}/reducers.js`)

                await this.operator.getGenerator('react-redux').generate(`${dir}/app`)
            }
        }

        this.operator.replaceGenerator('browser', generator)
    }

    static getInstaller(operator) {
        return new this(operator)
    }

    async install() {
        const babelInstaller = await this.operator.getInstaller('babel')
        babelInstaller.addPreset('react')
        babelInstaller.addPlugin('babel-plugin-syntax-jsx')

        const jsInstaller = await this.operator.getInstaller('js')
        jsInstaller.addDevPackage('babel-preset-react')
        jsInstaller.addDevPackage('babel-plugin-syntax-jsx')
        jsInstaller.addPackage('react')
        jsInstaller.addPackage('react-dom')
        jsInstaller.addPackage('react-redux')
        jsInstaller.addPackage('redux')
    }
}

module.exports = ReactReduxInstaller
