'use strict'

const path = require('path')
const fs = require('fs')

class RiotLoaderInstaller {
    constructor(operator) {
        this.operator = operator

        const generator = {
            generate: async (name, opts = {}) => {
                const render = async (inFile, outFile, opts2 = {}) => {
                    const fn = path.join(__dirname, inFile)
                    const content = fs.readFileSync(fn).toString()
                    await this.operator.writeFile(outFile, content, opts2)
                }

                const dir = path.dirname(name)
                await render('riot-index.html', `${dir}/index.html`, {type: 'copy'})
                await render('riot-index.js', `${dir}/index.js`, opts)

                await this.operator.getGenerator('riot').generate(`${dir}/app.tag`)
            }
        }

        this.operator.replaceGenerator('browser', generator)
    }

    static getInstaller(operator) {
        return new this(operator)
    }

    async install() {
        const jsInstaller = await this.operator.getInstaller('js')
        jsInstaller.addPackage('riot')
        jsInstaller.addDevPackage('tag-loader')
        // jsInstaller.addDevPackage('riotjs-loader', 1)

        const webpackInstaller = await this.operator.getInstaller('webpack')
        webpackInstaller.addLoader('\\.tag', [
            {loader: 'babel-loader', options: {sourceMap: true}},
            {loader: 'tag-loader'}
        ])

    }
}

module.exports = RiotLoaderInstaller
