'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const process = require('process');
const path = require('path');
const fs = require('fs');

const Setup = require('../setup');
const Plugin = require('../plugin');
const config = require('../config');
const CliUtils = require('./utils');

const generate = (() => {
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

        yield setup.operator.getGenerator(argv.generatorName).generate(argv.args[0]);

        yield setup.install().catch(function (e) {
            return console.dir(e);
        });
        cliUtils.message('generate finish.');
    });

    return function generate(_x, _x2) {
        return _ref.apply(this, arguments);
    };
})();

const generateCommand = () => {
    return {
        command: 'generate [options] <generatorName> <args...>',
        describe: 'generate file',
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
                console.log('If you want to generate file, you need to setup waterslide');
                process.exit(1);
            }

            const cliUtils = new CliUtils({ verbose: argv.verbose, debug: argv.debug });
            generate(cliUtils, argv).catch(e => console.dir(e));
        }
    };
};

module.exports = generateCommand;
//# sourceMappingURL=generate.js.map