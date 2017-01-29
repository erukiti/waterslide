'use strict'

const generateName = require('sillyname')

const Operator = require('./operator')
const JSEnv = require('./js_env')
const EcmaScriptEnv = require('./ecma_script_env')
const GitEnv = require('./git_env')
const ElectronEnv = require('./electron_target')
const ReactReduxEnv = require('./react_redux_env')
const WebpackEnv = require('./webpack_env')

class NewProject{
    constructor() {

    }

    run(argv) {
        const generateProjectDirName = () => {
            return generateName().toLowerCase().replace(' ', '-')
        }

        const projectDir = argv.length > 0 ? argv[0] : generateProjectDirName()

        const operator = new Operator(projectDir)

        const jsEnv = new JSEnv(operator)
        const webpackEnv = new WebpackEnv(operator)
        const ecmaScriptEnv = new EcmaScriptEnv(operator)
        const gitEnv = new GitEnv(operator)
        const electronEnv = new ElectronEnv(operator)
        const reactReduxEnv = new ReactReduxEnv(operator)
        jsEnv.process()
        webpackEnv.process()
        ecmaScriptEnv.process()
        gitEnv.process()
        electronEnv.process()
        reactReduxEnv.process()

        operator.output()

    }
}

module.exports = NewProject

