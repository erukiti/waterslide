'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = require('../../waterslide'),
    utils = _require.utils;

var EslintTester = function () {
    function EslintTester() {
        _classCallCheck(this, EslintTester);
    }

    _createClass(EslintTester, [{
        key: 'test',
        value: function test() {
            return utils.execSync('./node_modules/.bin/eslint --color --max-warnings 0 src');
        }
    }]);

    return EslintTester;
}();

module.exports = EslintTester;
//# sourceMappingURL=tester.js.map