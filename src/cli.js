const process = require('process')

const NewProject = require('./new/project')
const Config = require('./config/index')
const Watch = require('./build/watch')
const Build = require('./build/build')

if (process.argv.length <= 2) {
    console.error('need args')
    process.exit(1)
}

if (process.argv[2] === 'new') {
    const newProject = new NewProject()
    newProject.run(process.argv.slice(3))
}

if (process.argv[2] === 'config') {
    const config = new Config()
    config.run(process.argv.slice(3))
}

if (process.argv[2] === 'watch') {
    const watch = new Watch()
    watch.run()
}

if (process.argv[2] === 'build') {
    const build = new Build()
    build.run()
}
