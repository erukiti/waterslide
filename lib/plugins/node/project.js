'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const indexJsText = `'use strict'

console.log('Hello, Node.js World.')
`;

class NodeProject {
    constructor(operator) {
        this.operator = operator;
        operator.setTarget('node');
    }

    install() {
        var _this = this;

        return _asyncToGenerator(function* () {
            const jsInstaller = yield _this.operator.getInstaller('js');
            jsInstaller.setMain('lib/index.js');

            yield _this.operator.setDirectory('src', 'source', 'source code directory');
            yield _this.operator.setDirectory('lib', 'destination', 'build directory');

            yield _this.operator.writeFile('src/index.js', indexJsText, { type: 'node' });
        })();
    }
}

module.exports = NodeProject;
//# sourceMappingURL=project.js.map