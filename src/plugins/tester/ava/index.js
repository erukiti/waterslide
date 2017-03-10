'use strict'

const {utils} = require('../../../waterslider')

class AvaTester {
    test() {
        return utils.execSync('./node_modules/.bin/ava 2>&1')
    }
}

module.exports = AvaTester


