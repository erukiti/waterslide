'use strict'

const { utils, getConfig } = require('../../../waterslider')
const path = require('path')
const fs = require('fs')

class JsGenerator {
    constructor(operator) {
        this.operator = operator

        try {
            const json = operator.readFileSync('package.json')
            if (!json) {
                this.values = {}
            } else {
                this.values = JSON.parse(json)
            }
        } catch(e) {
            this.values = {}
        }

        this.packages = []
        this.devPackages = []
        this.main = ''
        this.bin = {}
    }

    static getInstaller(operator) {
        return new this(operator)
    }

    addPackage(name) {
        if (utils.checkExistsNpm(name)) {
            return
        }

        this.packages.push(name)
    }

    addDevPackage(name){
        if (utils.checkExistsNpm(name)) {
            return
        }

        this.devPackages.push(name)
    }

    addBin(binPath) {
        this.bin[path.basename(binPath)] = binPath
    }

    setMain(name) {
        this.main = name
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
        defaultUse.filter(value => !noUse.includes(value)).forEach(value => {this.operator.getInstaller(value)})
    
        const webpackInstaller = await this.operator.getInstaller('webpack')
        webpackInstaller.addLoader('\\.jsx?$', [
            {loader: 'babel-loader', options: {sourceMap: true}}
        ])

        const getProjectName = () => this.operator.getProjectDir()
        // FIXME: project dir -> project name

        const scripts = {
            start: 'waterslider run',
            build: 'waterslider build',
            watch: 'waterslider watch',
            test: 'waterslider test'
        }

        const config = getConfig()

        this.values.main = this.values.main || this.main
        this.values.name = this.values.name || getProjectName()
        this.values.version = this.values.version || '1.0.0'
        this.values.description = this.values.description || ''
        this.values.author = this.values.author || config.get('author')
        this.values.license = this.values.license || config.get('license')
        this.values.keywords = this.values.keywords || []
        this.values.scripts = this.values.scripts || scripts
        if (!this.values.bin || Object.keys(this.values.bin).length === 0) {
            this.values.bin = this.bin
        }

        this.operator.postInstall(async () => {
            this.packages.forEach(name => {
                this.operator.addCommand(0, `npm install ${name} -S`)
            })

            this.devPackages.forEach(name => {
                this.operator.addCommand(0, `npm install ${name} -D`)
            })

            await this.operator.writeFile('package.json', JSON.stringify(this.values, null, '  ') + '\n', { isRewritable: true })
        })
    }
}

module.exports = JsGenerator
