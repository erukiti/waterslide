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

const setupProject = (() => {
    var _ref = _asyncToGenerator(function* (cliUtils, argv) {
        const projectType = argv.projectType;

        cliUtils.message(`create a new project of ${projectType}`);

        let projectDir = null;
        let projectName = null;

        if (argv.projectDir) {
            projectDir = argv.projectDir;
            if (projectDir.indexOf('/') !== -1 || projectDir === '.' || projectDir === '..') {
                cliUtils.error('invalid projectDir.');
                process.exit(1);
            }

            projectName = projectDir;
            fs.mkdirSync(projectDir);
            process.chdir(projectDir);
            config.startLocal();
        } else {
            projectName = generateName();
            projectDir = projectName.toLowerCase().replace(' ', '-');
            fs.mkdirSync(projectDir);
            cliUtils.message(`directory \x1b[32m${projectDir}\x1b[m was created.`);
            process.chdir(projectDir);
            config.startLocal();
            config.writeLocal('sillyname', projectDir);
        }

        const setup = new Setup(cliUtils);
        setup.setProjectDir(projectDir);

        const parseOpt = function (name) {
            if (!argv[name]) {
                return [];
            } else if (typeof argv[name] === 'string') {
                return [argv[name]];
            } else {
                return argv[name];
            }
        };

        const noUse = parseOpt('noUse');
        setup.setNoUse(noUse);

        setup.setOpt(parseOpt('opt'));
        setup.setNoOpt(parseOpt('noOpt'));

        const envs = parseOpt('use').filter(function (v) {
            return !noUse.includes(v);
        });

        if (!setup.operator.getNoOpt().includes('recommend')) {
            ['editorconfig', 'git'].filter(function (v) {
                return !noUse.includes(v);
            }).forEach(function (v) {
                envs.push(v);
            });
        }

        const plugin = new Plugin();
        const Klass = plugin.requireProject(projectType);
        const obj = new Klass(setup.operator);

        for (let name of envs) {
            yield setup.operator.getInstaller(name);
        }

        yield obj.install();

        yield setup.install().catch(function (e) {
            return console.dir(e);
        });

        cliUtils.message();
        cliUtils.message(`  project \x1b[32m${projectDir}\x1b[m was created.`);
        cliUtils.message(`  see. \x1b[36m${projectDir}/README.md\x1b[m`);
    });

    return function setupProject(_x, _x2) {
        return _ref.apply(this, arguments);
    };
})();

const newCommand = () => {
    return {
        command: 'new <projectType> [projectDir]',
        describe: 'create a new project',
        builder: yargs => {
            yargs.option('use', {
                describe: 'use install plugin',
                type: 'string'
            }).option('no-use', {
                describe: 'disable install plugin',
                type: 'string'
            }).option('opt', {
                describe: 'set option',
                type: 'string'
            }).option('no-opt', {
                describe: 'disable option',
                type: 'string'
            });
        },
        handler: argv => {
            const cliUtils = new CliUtils({ verbose: argv.verbose, debug: argv.debug });
            setupProject(cliUtils, argv).catch(e => console.dir(e));
        }
    };
};

module.exports = newCommand;
//# sourceMappingURL=new.js.map