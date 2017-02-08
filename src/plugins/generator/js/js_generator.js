'use strict'

const {getConfig} = require('../../../waterslider')
const path = require('path')
const fs = require('fs')

class JsGenerator {
    constructor(operator) {
        this.operator = operator

        try {
            this.values = JSON.parse(fs.readFileSync('./package.json'))
        } catch(e) {
            this.values = {}
        }

        this.packages = []
        this.devPackages = []
        this.main = ''
        this.bin = {}
    }

    addPackage(name) {
        this.packages.push(name)
    }

    addDevPackage(name){
        this.devPackages.push(name)
    }

    addBin(binPath) {
        this.bin[path.basename(binPath)] = binPath
    }

    setMain(name) {
        this.main = name
    }

    process() {
        this.operator.getGenerator('babel')

        this.addDevPackage('babel-core')
        this.addDevPackage('babel-loader')

        if (this.operator.getOpts().includes('es2015')) {
            this.addDevPackage('babel-preset-es2015')
            this.operator.getGenerator('babel').addPreset('es2015')
        } else {
            this.addDevPackage('babel-preset-es2016')
            this.operator.getGenerator('babel').addPreset('es2016')
        }
    }

    output() {
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

        this.packages.forEach(name => {
            this.operator.addCommand(0, `npm install ${name} -S`)
        })

        this.devPackages.forEach(name => {
            this.operator.addCommand(0, `npm install ${name} -D`)
        })

        return [{
            path: 'package.json',
            text: JSON.stringify(this.values, null, '  ') + '\n'
        }]
    }
}

module.exports = JsGenerator
