'use strict'

const {utils} = require('../../../waterslider')

class MochaTester {
    test() {
        return utils.execSync('./node_modules/.bin/mocha -c test')
    }

}

module.exports = MochaTester
