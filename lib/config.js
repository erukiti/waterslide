'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var os = require('os');
var path = require('path');
var process = require('process');
var fs = require('fs');

var JsonFileName = '.innocentia.json';

var Config = function () {
    function Config() {
        _classCallCheck(this, Config);

        this.globalConfigPath = path.join(os.homedir(), JsonFileName);
        this.globalConfig = this._configRead(this.globalConfigPath);
        this.localConfig = {};
    }

    _createClass(Config, [{
        key: 'isExists',
        value: function isExists() {
            try {
                var stat = fs.statSync(path.join(process.cwd(), JsonFileName));
                return stat && typeof stat !== 'undefined';
            } catch (e) {
                return false;
            }
        }
    }, {
        key: 'startLocal',
        value: function startLocal() {
            this.localConfigPath = path.join(process.cwd(), JsonFileName);
            this.localConfig = this._configRead(this.localConfigPath);
        }
    }, {
        key: '_configRead',
        value: function _configRead(filePath) {
            try {
                return JSON.parse(fs.readFileSync(filePath).toString());
            } catch (e) {
                return {};
            }
        }
    }, {
        key: '_configWrite',
        value: function _configWrite(filePath, config) {
            fs.writeFileSync(filePath, JSON.stringify(config, null, '  ') + '\n');
        }
    }, {
        key: 'getLocal',
        value: function getLocal(key) {
            return this.localConfig[key];
        }
    }, {
        key: 'getGlobal',
        value: function getGlobal(key) {
            return this.globalConfig[key];
        }
    }, {
        key: 'getAuthor',
        value: function getAuthor() {
            if (this.globalConfig.author) {
                return this.globalConfig.author;
            } else {
                var author = {};
                if (this.globalConfig.name) {
                    author.name = this.globalConfig.name;
                }
                if (this.globalConfig.email) {
                    author.email = this.globalConfig.email;
                }
                if (this.globalConfig.homepage) {
                    author.url = this.globalConfig.homepage;
                }

                return author;
            }
        }
    }, {
        key: 'writeLocal',
        value: function writeLocal(key, value) {
            this.localConfig[key] = value;
            this._configWrite(this.localConfigPath, this.localConfig);
        }
    }, {
        key: 'writeGlobal',
        value: function writeGlobal(key, value) {
            this.globalConfig[key] = value;
            this._configWrite(this.globalConfigPath, this.globalConfig);
        }
    }]);

    return Config;
}();

var config = new Config();

module.exports = config;
//# sourceMappingURL=config.js.map