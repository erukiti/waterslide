'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const fs = require('fs');
const path = require('path');

class ElectronProject {
    constructor(operator) {
        this.operator = operator;
        operator.setFinalizer('electron');
    }

    install() {
        var _this = this;

        return _asyncToGenerator(function* () {
            yield _this.operator.setDirectory('src', 'source', 'source code directory');
            yield _this.operator.setDirectory('src/browser', null, 'source code directory (Electron Browser Process)');
            yield _this.operator.setDirectory('src/renderer', null, 'source code directory (Electron Renderer Process)');
            yield _this.operator.setDirectory('build', 'destination', 'build directory');
            yield _this.operator.setDirectory('release', null, 'release directory');

            const jsInstaller = yield _this.operator.getInstaller('js');
            jsInstaller.addDevPackage('electron');
            jsInstaller.addDevPackage('electron-connect');
            jsInstaller.addDevPackage('electron-packager');
            jsInstaller.addDevPackage('node-7z');
            jsInstaller.setMain('src/browser/app.js');

            const browserGenerator = _this.operator.getGenerator('browser');
            yield browserGenerator.generate('src/renderer/index.js', { type: 'electron-renderer' });

            const iconGenerator = _this.operator.getGenerator('electron-icon');
            yield iconGenerator.generate('src/app.png');

            const appJsText = fs.readFileSync(path.join(__dirname, 'sample.app.js'));
            yield _this.operator.writeFile('src/browser/app.js', appJsText, { type: 'copy' });
            yield _this.operator.writeFile('src/package.json', `${JSON.stringify({ 'main': 'browser/app.js' }, null, '  ')}\n`, { type: 'copy' });

            const gitInstaller = yield _this.operator.getInstaller('git');
            gitInstaller.addIgnore('release/');
        })();
    }
}

module.exports = ElectronProject;
//# sourceMappingURL=project.js.map