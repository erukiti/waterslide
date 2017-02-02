'use strict'

const createReadme = (projectDir, directoriesText) =>
`# ${projectDir}

## directories

${directoriesText}

`

class DocumentGenerator {
    constructor(operator) {
        this.operator = operator
        this.directories = []
    }

    setDirectory(path, description) {
        this.directories.push({path, description})
    }

    _getDirectoriesText() {
        let text = '| directory | description |\n'
        text +=    '| --------- | ----------- |\n'
        this.directories.forEach(directory => {
            text += `| ${directory.path} | ${directory.description} |\n`
        })
        return text
    }

    process() {

    }

    output() {
        const text = createReadme(this.operator.getProjectDir(), this._getDirectoriesText())
        return [
            {path: 'README.md', text}
        ]
    }
}

module.exports = DocumentGenerator
