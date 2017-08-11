'use strict';

var waterslide = {
    getConfig: function getConfig() {
        return require('./config');
    },
    utils: require('./utils'),
    Plugin: require('./plugin'),
    cli: require('./cli')
};

module.exports = waterslide;
//# sourceMappingURL=waterslide.js.map