'use strict'

let logger = null

const waterslider = {
    getConfig: () => require('./config'),
    Plugin: require('./plugin'),
    getLogger: () => {
        if (!logger) {
            const klass = require('./logger')
            logger = new klass()
        }
        return logger
    },
    Build: require('./build/build'),
    Watch: require('./build/watch'),
    NewProject: require('./new/project'),

}

module.exports = waterslider
