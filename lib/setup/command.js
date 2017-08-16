'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const ChildProcess = require('child_process');

const CliUtils = require('../cli/utils');

class Command {

    constructor(childProcess, cliUtils) {
        this.childProcess = childProcess;
        this.commands = [[], [], [], [], [], [], [], [], [], []];
        this.cliUtils = cliUtils;
    }

    addCommand(priority, command) {
        this.commands[priority].push(command);
    }

    exec(command) {
        return new Promise((resolve, reject) => {
            this.cliUtils.message(command);
            const child = this.childProcess.exec(command);
            // child.stdout.pipe(process.stdout)
            // child.stderr.pipe(process.stdout)
            child.on('error', err => reject(err));
            child.on('exit', (code, signal) => {
                if (code) {
                    reject(new Error(`error '${command}' is failed. ${code}`));
                } else {
                    resolve();
                }
            });
        });
    }

    execAll(cb) {
        var _this = this;

        return _asyncToGenerator(function* () {
            for (let commands of _this.commands) {
                for (let command of commands) {
                    cb && cb(command);
                    yield _this.exec(command);
                }
            }
        })();
    }
}

module.exports = Command;
//# sourceMappingURL=command.js.map