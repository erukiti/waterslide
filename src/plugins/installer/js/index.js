'use strict'

const {utils, getConfig} = require('../../../waterslide')
const path = require('path')
const fs = require('fs')

class JsInstaller {
    constructor(operator) {
        this.operator = operator

        try {
            const json = operator.readFileSync('package.json')
            if (!json) {
                this._init()
            } else {
                this.values = JSON.parse(json)
            }
        } catch (e) {
            this._init()
        }

        this.packages = []
        this.devPackages = []
    }

    _init() {
        const config = getConfig()

        const getProjectName = () => this.operator.getProjectDir()
        // FIXME: project dir -> project name

        this.values = {
            main: '',
            name: getProjectName(),
            version: '0.0.1',
            description: '',
            author: config.getAuthor(),
            license: config.getGlobal('license'),
            keywords: [],
            scripts: {
                start: 'ws run',
                build: 'ws build',
                watch: 'ws watch',
                test: 'ws test'
            },
            bin: {},
        }
    }

    static getInstaller(operator) {
        return new this(operator)
    }

    addPackage(name) {
        if (utils.checkExistsNpm(name)) {
            return
        }

        this.packages.push(name)
        this.operator.addCommand(0, `npm install ${name} -S`)
    }

    addDevPackage(name) {
        if (utils.checkExistsNpm(name)) {
            return
        }

        this.devPackages.push(name)
        this.operator.addCommand(0, `npm install ${name} -D`)
    }

    addBin(binPath) {
        this.values.bin[path.basename(binPath)] = binPath
    }

    setMain(name) {
        this.values.main = name
    }

    async install() {
        this.addDevPackage('babel-core')
        this.addDevPackage('babel-loader')

        const babelInstaller = await this.operator.getInstaller('babel')
        if (this.operator.getOpt().includes('es2015')) {
            this.addDevPackage('babel-preset-es2015')
            babelInstaller.addPreset('es2015')
        } else {
            this.addDevPackage('babel-preset-es2016')
            babelInstaller.addPreset('es2016')
        }

        const noUse = this.operator.getNoUse()
        const defaultUse = ['power-assert', 'ava', 'eslint']
        await Promise.all(defaultUse.filter(value => !noUse.includes(value)).map(async value => await this.operator.getInstaller(value)))

        const webpackInstaller = await this.operator.getInstaller('webpack')
        webpackInstaller.addLoader('\\.jsx?$', [
            {loader: 'babel-loader', options: {sourceMap: true}}
        ])

        this.operator.postInstall(async () => {
            await this.operator.writeFile('package.json', `${JSON.stringify(this.values, null, '  ')}\n`, {isRewritable: true})
        })
    }
}

module.exports = JsInstaller
