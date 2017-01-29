const process = require('process')

const newProject = require('./new/project')
const setting = require('./setting/index')

if (process.argv.length <= 2) {
    console.error('need args')
    process.exit(1)
}

if (process.argv[2] === 'new') {
    newProject(process.argv.slice(3))
}

if (process.argv[2] == 'setting') {
    setting(process.argv.slice(3))
}
