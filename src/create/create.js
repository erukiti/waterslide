const process = require('process')
const path = require('path')
const fs = require('fs')
const mkdirp = require('mkdirp')
const childProcess = require('child_process')

/**
 * creator()が生成するPromiseを非同期かつ直列的に実行する
 * var creator  Promiseを返すコールバック
 * return       creatorが生成したPromise
 */

let p = Promise.resolve()
const doSerial = creator => p = p.then(creator)


const createReadme = projectDir =>
`# ${projectDir}



`

class DocumentProvider {
    constructor(operator) {
        this.operator = operator
    }
    outputs() {
        return [
            {path: 'README.md', text: createReadme(operator.getProjectDir())}
        ]
    }
}

class Operator {
    constructor(projectDir) {
        this.providers = {}
        this.required = {}
        this.commands = []
        this.projectDir = projectDir

        this.makeProjectDir = () => {
            fs.mkdirSync(projectDir)
            process.chdir(projectDir)
        }

        this.outputFile = (filename, text) => new Promise((resolve, reject) => {
            if (path.dirname(filename)) {
                mkdirp.sync(path.dirname(filename))
            }

            fs.writeFile(filename, text, { flag: 'wx' }, err => {
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            })
        })

        this.command = command => new Promise((resolve, reject) => {
            console.log(command)
            const child = childProcess.exec(command)
            child.on('error', err => reject(err))
            child.on('exit', (code, signal) => {
                if (code) {
                    child.stdout.pipe(process.stdout)
                    child.stderr.pipe(process.stdout)
                    reject()
                } else {
                    resolve()
                }
            })
        })

        this.addProvider('document', new DocumentProvider(this))
    }

    getProjectDir() {
        return this.projectDir
    }

    addProvider(name, provider) {
        this.providers[name] = provider
    }

    requireProvider(name) {
        this.required[name] = true
    }

    isRequiredProvider(name) {
        return this.required[name]
    }

    addCommand(priority, command) {
        if (this.commands[priority] === undefined) {
            this.commands[priority] = []
        }

        this.commands[priority].push(command)
    }

    output() {
        this.makeProjectDir()

        const outputFiles = []
        Object.keys(this.providers).forEach(key => {
            this.providers[key].outputs().forEach(provided => {
                outputFiles.push(this.outputFile(provided.path, provided.text))
            })
        })

        doSerial(() => Promise.all(outputFiles))

        this.commands.forEach(commands => {
            commands.forEach(command => {
                doSerial(() => this.command(command))
            })
        })
        doSerial(() => {
            console.log()
            console.log(`  project \x1b[32m${this.projectDir}\x1b[m was created.`)
            console.log(`  see. \x1b[36m${this.projectDir}/README.md\x1b[m`)
        }).catch(err => console.error(err))
    }

    getProvider(name) {
        return this.providers[name]
    }
}

class JSProvider {
    constructor(operator) {
        this.operator = operator

        this.packages = []
        this.devPackages = []

        const getProjectName = () => operator.getProjectDir()
            // FIXME: いい感じに変換する仕組みを考える
            //        大文字小文字や区切りをいじったり

        const getVersion = () => '1.0.0'
        const getDescription = () => ''
        const getMain = () => 'src/index.js'

        this.values = {
            name: getProjectName(),
            version: getVersion(),
            description: getDescription(),
            main: getMain()
        }

    }

    addPackage(name) {
        this.packages.push(name)
    }

    addDevPackage(name){
        this.devPackages.push(name)
    }

    outputs() {
        this.packages.forEach(name => {
            this.operator.addCommand(0, `npm install ${name} -S`)
        })

        this.devPackages.forEach(name => {
            this.operator.addCommand(0, `npm install ${name} -D`)
        })

        return [{
            path: 'package.json',
            text: JSON.stringify(this.values, null, '  ')
        }]
    }
}

class BabelProvider {
    constructor(operator) {
        this.presets = []
        this.plugins = []
    }
    addPreset(name) {
        // こいつがpackage.jsonにpluginを追加すべきかどうか？
        this.presets.push(name)
    }
    addPlugin(name) {
        this.plugins.push(name)
    }

    outputs() {
        const values = {
            presets: this.presets,
            plugins: this.plugins
        }
        return [{
            path: '.babelrc',
            text: JSON.stringify(values, null, '  ')
        }]
    }
}

class JSEnv {
    constructor(operator) {
        const jsProvider = new JSProvider(operator)
        operator.addProvider('js', jsProvider)
        operator.addProvider('babel', new BabelProvider(operator))
        operator.requireProvider('js')
    }

    process() {
    }
}

class ES2016Env {
    constructor(operator) {
        this.operator = operator
        operator.requireProvider('js')
        operator.requireProvider('babel')
    }
    process() {
        const jsProvider = this.operator.getProvider('js')
        jsProvider.addDevPackage('babel-core')
        jsProvider.addDevPackage('babel-loader')
        jsProvider.addDevPackage('babel-preset-es2016')
        this.operator.getProvider('babel').addPreset('es2016')
    }
}

class GitProvider {
    constructor(operator) {
        this.ignoreFiles = ['node_modules/', 'npm-debug.log']
    }

    addIgnore(path) {
        this.ignoreFiles.push(path)
    }

    outputs() {
        return [{
            path: '.gitignore',
            text: this.ignoreFiles.join('\n')
        }]
    }
}

class GitEnv {
    constructor(operator) {
        operator.addProvider('git', new GitProvider(operator))
        operator.requireProvider('git')

        // これらのコマンド、他を全部終えてからじゃないとダメ
        // FIXME: git リポジトリがまだ存在しないことを確認する必要がある
        operator.addCommand(9, 'git init')
        operator.addCommand(9, 'git add .')
        operator.addCommand(9, "git commit -m 'first commited by waterslider.'")
    }
    process() {
    }
}

class ElectronProvider {
    constructor(operator) {

    }
    outputs() {
        const values = {'main': 'browser/app.js'}
        return [{
            path: 'src/package.json',
            text: JSON.stringify(values, null, '  ')
        }]
    }
}

class ElectronEnv {
    constructor(operator) {
        this.operator = operator
        operator.addProvider('electron', new ElectronProvider(operator))
        operator.requireProvider('js')
        operator.requireProvider('electron')
    }
    process() {
        this.operator.getProvider('js').addDevPackage('electron')
    }
}

class ReactReduxEnv {
    constructor(operator) {
        this.operator = operator
        operator.requireProvider('js')
        operator.requireProvider('babel')

    }
    process() {
        const babelProvider = this.operator.getProvider('babel')
        babelProvider.addPreset('react')
        babelProvider.addPlugin('babel-plugin-syntax-jsx')

        const jsProvider = this.operator.getProvider('js')
        jsProvider.addDevPackage('babel-preset-react')
        jsProvider.addDevPackage('babel-plugin-syntax-jsx')
        jsProvider.addPackage('react')
        jsProvider.addPackage('react-dom')
        jsProvider.addPackage('react-redux')
        jsProvider.addPackage('redux')
    }
}

class WebpackEnv {
    constructor(operator) {
        this.operator = operator
    }
    process() {
        const jsProvider = this.operator.getProvider('js')
        jsProvider.addDevPackage('webpack')
        // jsProvider.addDevPackage('file-loader')
        // jsProvider.addDevPackage('webpack-unassert-loader')
        // jsProvider.addDevPackage('url-loader')
        // jsProvider.addDevPackage('style-loader')
        // jsProvider.addDevPackage('strip-loader')
        // jsProvider.addDevPackage('sass-loader')
        // jsProvider.addDevPackage('file-loader')
        // jsProvider.addDevPackage('json-loader')
        // jsProvider.addDevPackage('')
        // jsProvider.addDevPackage('')
        if (this.operator.isRequiredProvider('babel')) {
            jsProvider.addDevPackage('babel-loader')
        }
    }
}


class EditorConfigEnv {}
class PowerAssertEnv {}
class MochaEnv {}
class EslintEnv {}
class JSBeautifyEnv {}

const create = projectDir => {
    const operator = new Operator(projectDir)

    const jsEnv = new JSEnv(operator)
    const webpackEnv = new WebpackEnv(operator)
    const es2016Env = new ES2016Env(operator)
    const gitEnv = new GitEnv(operator)
    const electronEnv = new ElectronEnv(operator)
    const reactReduxEnv = new ReactReduxEnv(operator)
    jsEnv.process()
    webpackEnv.process()
    es2016Env.process()
    gitEnv.process()
    electronEnv.process()
    reactReduxEnv.process()

    operator.output()
}

module.exports = create

