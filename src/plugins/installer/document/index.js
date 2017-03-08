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

    static async getInstaller(operator) {
        if (await operator.checkExists('README.md')) {
            return null
        }

        return new this(operator)
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

    async install() {
        this.operator.postInstall(async () => {
            const text = createReadme(this.operator.getProjectDir(), this._getDirectoriesText())
            await this.operator.writeFile('README.md', text)
        })
    }
}

module.exports = DocumentGenerator
