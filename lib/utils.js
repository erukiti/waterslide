'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const childProcess = require('child_process');
const fs = require('fs');

const waitStream = stream => new Promise(resolve => {
    stream.on('end', () => resolve());
});

let cachePackageJson = null;

const utils = {
    execSync: cmd => {
        try {
            const stdout = childProcess.execSync(cmd).toString('utf-8');
            return { isError: false, stdout };
        } catch (e) {
            const stdout = e.stdout.toString('utf-8');
            const stderr = e.stderr.toString('utf-8');
            return { isError: true, stdout, stderr };
        }
    },
    exec: cmd => new Promise((resolve, reject) => {
        const child = childProcess.exec(cmd);

        let stdout = '';
        let stderr = '';

        child.stdout.on('data', chunk => {
            stdout += chunk.toString();
        });

        child.stderr.on('data', chunk => {
            stderr += chunk.toString();
        });

        child.on('error', err => {
            reject(err);
        });
        child.on('exit', (() => {
            var _ref = _asyncToGenerator(function* (code, signal) {
                // await waitStream(child.stdout)
                // await waitStream(child.stderr)
                resolve({ code, stdout, stderr });
            });

            return function (_x, _x2) {
                return _ref.apply(this, arguments);
            };
        })());
    }),
    readNpmVersion: name => {
        const result = childProcess.execSync('npm list --depth=0').toString();
        const ind = result.indexOf(`${name}@`);
        if (ind !== -1) {
            return result.substr(ind + name.length + 1).split('\n')[0];
        } else {
            return null;
        }
    },
    checkExistsNpm: name => {
        if (!cachePackageJson) {
            try {
                cachePackageJson = JSON.parse(fs.readFileSync('package.json').toString());
            } catch (e) {
                return false;
            }
        }

        if (cachePackageJson.dependencies && cachePackageJson.dependencies[name]) {
            return true;
        }

        if (cachePackageJson.devDependencies && cachePackageJson.devDependencies[name]) {
            return true;
        }
        return false;
    }
};

module.exports = utils;
//# sourceMappingURL=utils.js.map