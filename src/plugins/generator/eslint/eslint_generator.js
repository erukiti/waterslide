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

class eslintGenerator {
    constructor(operator) {
        this.operator = operator
    }

    process() {
        const jsGenerator = this.operator.getGenerator('js')
        jsGenerator.addDevPackage('eslint')
        jsGenerator.addDevPackage('babel-eslint')
    }
    output() {
        return [
            {path: '.eslintignore', text: eslintIgnoreText},
            {path: '.eslintrc', text: JSON.stringify(eslintrc, null, '  ') + '\n'}
        ]
    }
}

module.exports = eslintGenerator
