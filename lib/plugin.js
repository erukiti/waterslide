'use strict';

const process = require('process');
const fs = require('fs');

class Plugin {
    requireLocal(name) {
        try {
            return require(`${process.cwd()}/node_modules/${name}`);
        } catch (e) {
            return require(name);
        }
    }

    requireProject(name) {
        return require(`./plugins/${name}`).project;
    }

    requireInstaller(name) {
        return require(`./plugins/${name}`).installer;
    }

    requireGenerator(name) {
        return require(`./plugins/${name}`).generator;
    }
}

module.exports = Plugin;
//# sourceMappingURL=plugin.js.map