'use strict'

const createReadme = (projectDir, directoriesText) =>
`# ${projectDir}

## directories

${directoriesText}

`

class DocumentProvider {
    constructor(operator) {
        this.operator = operator
        this.directories = []
    }
    setDirectory(path, description) {
        this.directories.push({path, description})
    }

    getDirectoriesText() {
        let text = '| directory | description |\n'
        text +=    '| --------- | ----------- |\n'
        this.directories.forEach(directory => {
            text += `| ${directory.path} | ${directory.description} |\n`
        })
        return text
    }

    outputs() {
        const text = createReadme(this.operator.getProjectDir(), this.getDirectoriesText())
        return [
            {path: 'README.md', text}
        ]
    }
}

module.exports = DocumentProvider
