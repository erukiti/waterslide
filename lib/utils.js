'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var childProcess = require('child_process');
var fs = require('fs');

var waitStream = function waitStream(stream) {
    return new Promise(function (resolve) {
        stream.on('end', function () {
            return resolve();
        });
    });
};

var cachePackageJson = null;

var utils = {
    execSync: function execSync(cmd) {
        try {
            var stdout = childProcess.execSync(cmd).toString('utf-8');
            return { isError: false, stdout: stdout };
        } catch (e) {
            var _stdout = e.stdout.toString('utf-8');
            var stderr = e.stderr.toString('utf-8');
            return { isError: true, stdout: _stdout, stderr: stderr };
        }
    },
    exec: function exec(cmd) {
        return new Promise(function (resolve, reject) {
            var child = childProcess.exec(cmd);

            var stdout = '';
            var stderr = '';

            child.stdout.on('data', function (chunk) {
                stdout += chunk.toString();
            });

            child.stderr.on('data', function (chunk) {
                stderr += chunk.toString();
            });

            child.on('error', function (err) {
                reject(err);
            });
            child.on('exit', function () {
                var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(code, signal) {
                    return regeneratorRuntime.wrap(function _callee$(_context) {
                        while (1) {
                            switch (_context.prev = _context.next) {
                                case 0:
                                    // await waitStream(child.stdout)
                                    // await waitStream(child.stderr)
                                    resolve({ code: code, stdout: stdout, stderr: stderr });

                                case 1:
                                case 'end':
                                    return _context.stop();
                            }
                        }
                    }, _callee, undefined);
                }));

                return function (_x, _x2) {
                    return _ref.apply(this, arguments);
                };
            }());
        });
    },
    readNpmVersion: function readNpmVersion(name) {
        var result = childProcess.execSync('npm list --depth=0').toString();
        var ind = result.indexOf(name + '@');
        if (ind !== -1) {
            return result.substr(ind + name.length + 1).split('\n')[0];
        } else {
            return null;
        }
    },
    checkExistsNpm: function checkExistsNpm(name) {
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