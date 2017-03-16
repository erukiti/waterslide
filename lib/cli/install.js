'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const generateName = require('sillyname');
const process = require('process');
const path = require('path');
const fs = require('fs');

const Setup = require('../setup');
const Plugin = require('../plugin');
const config = require('../config');
const CliUtils = require('./utils');

const install = (() => {
    var _ref = _asyncToGenerator(function* (cliUtils, argv) {
        config.startLocal();

        const setup = new Setup(cliUtils);

        const parseOpt = function (name) {
            if (!argv[name]) {
                return [];
            } else if (typeof argv[name] === 'string') {
                return [argv[name]];
            } else {
                return argv[name];
            }
        };

        setup.setOpt(parseOpt('opt'));
        setup.setNoOpt(parseOpt('noOpt'));

        for (let name of argv.pluginNames) {
            const installer = yield setup.operator.getInstaller(name);
            if (!installer) {
                cliUtils.error(`${name} is not installed. already installed or installing file is already exists.`);
            }
        }

        yield setup.install().catch(function (e) {
            return console.dir(e);
        });
        cliUtils.message('install finish.');
    });

    return function install(_x, _x2) {
        return _ref.apply(this, arguments);
    };
})();

const installCommand = () => {
    return {
        command: 'install [options] <pluginNames...>',
        describe: 'install to project',
        builder: yargs => {
            yargs.option('opt', {
                describe: 'set option',
                type: 'string'
            }).option('no-opt', {
                describe: 'disable option',
                type: 'string'
            });
        },
        handler: argv => {
            if (!config.isExists()) {
                console.log('If you want to install, you need to setup waterslide');
                process.exit(1);
            }

            const cliUtils = new CliUtils({ verbose: argv.verbose, debug: argv.debug });
            install(cliUtils, argv).catch(e => console.dir(e));
        }
    };
};

module.exports = installCommand;
//# sourceMappingURL=install.js.map