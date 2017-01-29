'use strict'

const GitProvider = require('./git_provider')

class GitEnv {
    constructor(operator) {
        operator.addProvider('git', new GitProvider(operator))
        operator.requireProvider('git')

        // これらのコマンド、他を全部終えてからじゃないとダメ
        // FIXME: git リポジトリがまだ存在しないことを確認する必要がある
        operator.addCommand(9, 'git init')
        operator.addCommand(9, 'git add .')
        operator.addCommand(9, "git commit -m 'first commited by waterslider. see. http://github.com/erukiti/waterslider/'")
    }
    process() {
    }
}

module.exports = GitEnv
