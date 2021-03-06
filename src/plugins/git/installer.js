'use strict'

const GithubApi = require('github-api')
const fs = require('fs')
const path = require('path')
const {utils, getConfig} = require('../../waterslide')

class GitInstaller {
    constructor(operator) {
        this.operator = operator
        this.ignoreFiles = ['node_modules/', 'npm-debug.log', 'build/']

        const config = getConfig()
        this.token = config.getGlobal('github_token')
    }

    static async getInstaller(operator) {
        try {
            fs.existsSync(path.join(this.operator.getProjectDir(), '.git'))
            console.log('alread installed')
            process.exit(1)
        } catch (e) {
            //
        }
        return new this(operator)
    }

    addIgnore(path) {
        this.ignoreFiles.push(path)
    }

    getGithubRepository() {
        return this.githubRepository
    }

    getGithubRepositoryUrl() {
        return this.githubRepositoryUrl
    }

    getGithubUsername() {
        return this.githubUsername
    }

    async install() {
        if (this.githubUser) {
            this.githubUser.createRepo({
                name: this.githubRepository,
                private: true
            }).catch(err => console.dir(err))
        }

        this.operator.addCommand(9, 'git init')
        this.operator.addCommand(9, 'git add .')
        this.operator.addCommand(9, 'git commit -m \'first commited by waterslide. see. http://github.com/erukiti/waterslide/\'')

        await this.operator.writeFile('.gitignore', this.ignoreFiles.join('\n'))
    }
}

module.exports = GitInstaller
