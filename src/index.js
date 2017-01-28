const process = require('process')
const path = require('path')

class Operator {
    constructor() {
        this.providers = {}
    }

    addProvider(name, provider) {
        this.providers[name] = provider
    }

    output() {
        Object.keys(this.providers).forEach(key => {
            const provided = this.providers[key].output()
            console.log(`-- ${provided.path}`)
            console.log(provided.text)
            console.log()
        })
    }

    getProvider(name) {
        return this.providers[name]
    }
}

class PackageJsonProvider {
    constructor() {
        this.path = 'package.json'

        const getProjectName = () => {
            return path.basename(process.cwd())
            // FIXME: いい感じに変換する仕組みを考える
            //        大文字小文字や区切りをいじったり
        }

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
        console.log(`add package: ${name}`)
    }

    output() {
        return {
            path: this.path,
            text: JSON.stringify(this.values, null, '  ')
        }
    }
}

class BabelProvider {
    constructor() {
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

    output() {
        const values = {
            presets: this.presets,
            plugins: this.plugins
        }
        return {
            path: '.babelrc',
            text: JSON.stringify(values, null, '  ')
        }
    }
}

class JSEnv {
    constructor() {

    }

    process(operator) {
        const packageJsonProvider = new PackageJsonProvider()
        operator.addProvider('package.json', packageJsonProvider)
        operator.addProvider('babel', new BabelProvider())
        packageJsonProvider.addPackage('babel-core')
        packageJsonProvider.addPackage('babel-loader')
    }
}

class ES2016Env {
    constructor() {

    }
    process(operator) {
        const packageJsonProvider = operator.getProvider('package.json')
        const babelProvider = operator.getProvider('babel')
        babelProvider.addPreset('es2016')
        packageJsonProvider.addPackage('babel-preset-es2016')

    }
}

class GitProvider {
    constructor() {
        this.ignoreFiles = ['node_modules/', 'npm-debug.log']

    }

    addIgnore(path) {
        this.ignoreFiles.push(path)
    }

    output() {

        return {
            path: '.gitignore',
            text: this.ignoreFiles.join('\n')
        }
    }
}

class GitEnv {
    constructor() {

    }
    process(operator) {
        operator.addProvider('git', new GitProvider())
    }
}
class EditorConfigEnv {}
class ElectronEnv {}
class ReactReduxEnv {}
class PowerAssertEnv {}
class MochaEnv {}
class EslintEnv {}
class JSBeautifyEnv {}

const operator = new Operator()
const jsEnv = new JSEnv()
jsEnv.process(operator)
const es2016Env = new ES2016Env()
es2016Env.process(operator)
const gitEnv = new GitEnv()
gitEnv.process(operator)

operator.output()


