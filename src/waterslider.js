const process = require('process')
const generateName = require('sillyname')

const create = require('./create/create.js')

const generateProjectDirName = () => {
    return generateName().toLowerCase().replace(' ', '-')
}

if (process.argv.length <= 2) {
    console.error('need args')
    process.exit(1)
}

if (process.argv[2] === 'create') {
    if (process.argv.length > 3) {
        create(process.argv[3])
    } else {
        create(generateProjectDirName())
    }
}
