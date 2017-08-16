'use strict'

const {utils, getConfig} = require('../../waterslide')
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

        this.isYarn = this.operator.getOpt().includes('yarn')
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
                start: 'innocentia run',
                build: 'innocentia build',
                watch: 'innocentia watch',
                test: 'innocentia test'
            },
            bin: {},
            innocentia: {},
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
    }

    addDevPackage(name) {
        if (utils.checkExistsNpm(name)) {
            return
        }

        this.devPackages.push(name)
    }

    addBin(binPath) {
        this.values.bin[path.basename(binPath)] = binPath
    }

    setMain(name) {
        this.values.main = name
    }

    setInnocentiaConfig(key, obj) {
        this.values.innocentia[key] = obj
    }

    setBuildConfig(obj) {
        this.values.build = obj
    }

    async install() {
        this.addDevPackage('innocentia')

        if (!this.operator.getIsUse()) {
            const noUse = this.operator.getNoUse()
            const defaultUse = ['ava', 'eslint']

            await Promise.all(defaultUse.filter(value => !noUse.includes(value)).map(async value => await this.operator.getInstaller(value)))
        }

        const webpackInstaller = await this.operator.getInstaller('webpack')
        webpackInstaller.addLoader('\\.jsx?$', [
            {loader: 'babel-loader', options: {sourceMap: true}}
        ])
        await this.operator.getInstaller('babel')

        this.operator.postInstall(async () => {
            await this.operator.writeFile('package.json', `${JSON.stringify(this.values, null, '  ')}\n`, {isRewritable: true})


            if (this.isYarn) {
                if (this.packages.length > 0) {
                    this.operator.addCommand(3, `yarn add ${this.packages.join(' ')} -S`)
                }
                if (this.devPackages.length > 0) {
                    this.operator.addCommand(3, `yarn add ${this.devPackages.join(' ')} -D`)
                }
            } else {
                if (this.packages.length > 0) {
                    this.operator.addCommand(3, `npm i ${this.packages.join(' ')} -S`)
                }
                if (this.devPackages.length > 0) {
                    this.operator.addCommand(3, `npm i ${this.devPackages.join(' ')} -D`)
                }
            }

        })
    }
}

module.exports = JsInstaller
