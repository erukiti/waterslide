'use strict'

const waterslide = {
    getConfig: () => require('./config'),
    utils: require('./utils'),
    Plugin: require('./plugin'),
    cli: require('./cli'),
}

module.exports = waterslide
