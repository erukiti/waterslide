'use strict'

const GitProvider = require('./git_provider')

class GitEnv {
    constructor(operator) {
        this.operator = operator
        this.gitProvider = new GitProvider(operator)
        operator.addProvider('git', this.gitProvider)
        operator.requireProvider('git')
    }

    process() {
        // FIXME: git リポジトリがまだ存在しないことを確認する必要がある
        this.operator.addCommand(9, 'git init')
        this.operator.addCommand(9, 'git add .')
        this.operator.addCommand(9, "git commit -m 'first commited by waterslider. see. http://github.com/erukiti/waterslider/'")
    }
}

module.exports = GitEnv
