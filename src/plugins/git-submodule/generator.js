'use strict'

const fs = require('fs')
const path = require('path')

class GitSubomduleGenerator {
    constructor(operator) {
        this.operator = operator
    }

    async generate(name, opts = {}) {
        this.operator.addCommand(9, `git submodule add ${name} vendor/${path.basename(name, '.git')}`)
    }
}

module.exports = GitSubomduleGenerator
