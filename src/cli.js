const process = require('process')

const NewProject = require('./new/project')
const Setting = require('./setting')
const Watch = require('./build/watch')

if (process.argv.length <= 2) {
    console.error('need args')
    process.exit(1)
}

if (process.argv[2] === 'new') {
    const newProject = new NewProject()
    newProject.run(process.argv.slice(3))
}

if (process.argv[2] === 'setting') {
    const setting = new Setting()
    setting.run(process.argv.slice(3))
}

if (process.argv[2] === 'watch') {
    const watch = new Watch()
    watch.run()
}
