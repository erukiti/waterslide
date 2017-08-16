'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const createReadme = (projectDir, directoriesText) => `# ${projectDir}

## directories

${directoriesText}

`;

class DocumentInstaller {
    constructor(operator) {
        this.operator = operator;
        this.directories = [];
    }

    static getInstaller(operator) {
        var _this = this;

        return _asyncToGenerator(function* () {
            if (yield operator.checkExists('README.md')) {
                return null;
            }

            return new _this(operator);
        })();
    }

    setDirectory(path, description) {
        this.directories.push({ path, description });
    }

    _getDirectoriesText() {
        let text = '| directory | description |\n';
        text += '| --------- | ----------- |\n';
        this.directories.forEach(directory => {
            text += `| ${directory.path} | ${directory.description} |\n`;
        });
        return text;
    }

    install() {
        var _this2 = this;

        return _asyncToGenerator(function* () {
            _this2.operator.postInstall(_asyncToGenerator(function* () {
                const text = createReadme(_this2.operator.getProjectDir(), _this2._getDirectoriesText());
                yield _this2.operator.writeFile('README.md', text);
            }));
        })();
    }
}

module.exports = DocumentInstaller;
//# sourceMappingURL=installer.js.map