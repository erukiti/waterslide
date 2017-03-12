'use strict'

require('babel-register')({
    presets: ['es2016', 'stage-3'],
    plugins: ['unassert'],
    only: filename => filename.substr(0, __dirname.length) === __dirname
})

const waterslide = {
    getConfig: () => require('./config'),
    utils: require('./utils'),
    Plugin: require('./plugin'),
    cli: require('./cli'),
}

module.exports = waterslide
