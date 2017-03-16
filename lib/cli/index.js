'use strict';

const process = require('process');
const yargs = require('yargs');

const buildCommand = require('./build');

const cli = () => {
    yargs.detectLocale(false).version().help().usage('Usage: ws [options...] <subcommand> [args...]').option('verbose', {
        default: false,
        type: 'boolean'
    }).option('debug', {
        default: false,
        type: 'boolean'
    }).command(require('./new')()).command(require('./install')()).command(require('./generate')()).command(require('./config')()).command(buildCommand('run')).command(buildCommand('build')).command(buildCommand('watch')).command(buildCommand('test')).demandCommand(1, 'Need subcommand.').argv;
};

module.exports = cli;
//# sourceMappingURL=index.js.map