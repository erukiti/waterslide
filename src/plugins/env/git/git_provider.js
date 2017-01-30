'use strict'

const GithubApi = require('github-api')

class GitProvider {
    constructor(operator) {
        this.operator = operator
        this.ignoreFiles = ['node_modules/', 'npm-debug.log']

        this.token = operator.getConfig('github_token')

        // if (this.token) {
        //     this.githubRepository = `casual-${operator.getProjectDir()}`
        //     this.github = new GithubApi({token: this.token})
        //     this.githubUser = this.github.getUser()
        //     this.githubUser.getProfile().then(profile => {
        //         this.githubUsername = profile.data.login
        //         this.githubRepositoryUrl = `git+https://github.com/${this.githubUsername}/${this.githubRepository}.git`
        //     })
        // }
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

    outputs() {
        if (this.githubUser) {
            // FIXME: 制御の流れを考える。たとえばoutputsを全部Promise化
            this.githubUser.createRepo({
                name: this.githubRepository,
                private: true
            }).catch(err => console.dir(err))
        }


        return [{
            path: '.gitignore',
            text: this.ignoreFiles.join('\n')
        }]
    }
}

module.exports = GitProvider
