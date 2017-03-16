'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class BrowserProject {
    constructor(operator) {
        this.operator = operator;
        operator.setFinalizer('browser');
    }

    install() {
        var _this = this;

        return _asyncToGenerator(function* () {
            yield _this.operator.getInstaller('js');
            const g = _this.operator.getGenerator('browser');
            yield g.generate('src/index.js', { type: 'web' });

            yield _this.operator.setDirectory('src', 'source', 'source code directory');
            yield _this.operator.setDirectory('build', 'destination', 'build directory');
        })();
    }
}

module.exports = BrowserProject;
//# sourceMappingURL=project.js.map