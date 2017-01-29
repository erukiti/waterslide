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
    setDirectory(path, purpose) {
        this.directories.push({path, purpose})
    }

    getDirectoriesText() {
        let text = '| directory | purpose |\n'
        text +=    '| --------- | ------- |\n'
        this.directories.forEach(directory => {
            text += `| ${directory.path} | ${directory.purpose} |\n`
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
