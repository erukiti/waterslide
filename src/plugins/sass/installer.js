'use strict'

const {utils} = require('../../waterslide')

class SassInstaller {
    constructor(operator) {
        this.operator = operator
    }

    static getInstaller(operator) {
        return new this(operator)
    }

    async install() {
        this.operator.addBuilder('sass')
    }
}

module.exports = SassInstaller
