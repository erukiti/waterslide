'use strict'

const {utils} = require('../../../waterslide')

class MochaTester {
    test() {
        return utils.execSync('./node_modules/.bin/mocha -c test')
    }

}

module.exports = MochaTester
