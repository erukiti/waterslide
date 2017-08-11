'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var process = require('process');
var fs = require('fs');

var Plugin = function () {
    function Plugin() {
        _classCallCheck(this, Plugin);
    }

    _createClass(Plugin, [{
        key: 'requireLocal',
        value: function requireLocal(name) {
            try {
                return require(process.cwd() + '/node_modules/' + name);
            } catch (e) {
                return require(name);
            }
        }
    }, {
        key: 'requireProject',
        value: function requireProject(name) {
            return require('./plugins/' + name).project;
        }
    }, {
        key: 'requireInstaller',
        value: function requireInstaller(name) {
            return require('./plugins/' + name).installer;
        }
    }, {
        key: 'requireGenerator',
        value: function requireGenerator(name) {
            return require('./plugins/' + name).generator;
        }
    }]);

    return Plugin;
}();

module.exports = Plugin;
//# sourceMappingURL=plugin.js.map