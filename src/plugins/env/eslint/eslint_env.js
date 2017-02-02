'use strict'

const eslintIgnoreText =
`node_modules/
build/
`

const eslintrc = {
    "parser": "babel-eslint",
    "rules": {
        "semi": [
            1,
            "never"
        ],
        "quotes": [
            2,
            "single"
        ],
        "linebreak-style": [
            1,
            "unix"
        ],
        "no-console": 0,
        "arrow-spacing": 1,
        "generator-star-spacing": 1,
        "no-useless-constructor": 1,
        "no-var": 2,
        "no-unused-vars": 0,
        "object-shorthand": 1,
        "prefer-arrow-callback": 0,
        "prefer-const": 0,
        "prefer-reflect": 1,
        "prefer-rest-params": 1,
        "prefer-spread": 1,
        "prefer-template": 1,
        "require-yield": 1,
        "template-curly-spacing": 1,
        "yield-star-spacing": 1,
        "complexity": [1, 20],
        "eqeqeq": 2,
        "no-shadow": 1
    },
    "ecmaFeatures": {
        "jsx": true
    },
    "env": {
        "es6": true,
        "browser": true,
        "node": true,
        "mocha": true
    },
    "globals": {
        "assert": true
    },
    "extends": "eslint:recommended"
}

class eslintEnv {
    constructor(operator) {
        this.operator = operator
        this.operator.requireProvider('js')
        this.operator.requireProvider('babel')
    }

    process() {
        const babelProvider = this.operator.getProvider('babel')
        babelProvider.addPlugin('babel-eslint')

        const jsProvider = this.operator.getProvider('js')
        jsProvider.addDevPackage('eslint')
        jsProvider.addDevPackage('babel-eslint')

        this.operator.addSource('.eslintignore', eslintIgnoreText)
        this.operator.addSource('.eslintrc', JSON.stringify(eslintrc, null, '  '))

    }
}

module.exports = eslintEnv
