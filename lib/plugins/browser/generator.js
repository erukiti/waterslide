'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fs = require('fs');
var path = require('path');
var process = require('process');
var Mustache = require('mustache');

var BrowserGenerator = function () {
    function BrowserGenerator(operator) {
        _classCallCheck(this, BrowserGenerator);

        this.operator = operator;
    }

    _createClass(BrowserGenerator, [{
        key: 'generate',
        value: function () {
            var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(name) {
                var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
                var dirname, prefix, templateHtml, html, sampleJs;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                dirname = path.dirname(name);
                                prefix = path.basename(name, '.js');
                                templateHtml = fs.readFileSync(path.join(__dirname, 'sample.html.mst')).toString();
                                html = Mustache.render(templateHtml, { prefix: prefix });
                                sampleJs = fs.readFileSync(path.join(__dirname, 'sample.js'));


                                this.operator.writeFile(path.join(dirname, prefix + '.html'), html, { type: 'copy' });
                                this.operator.writeFile(path.join(dirname, prefix + '.js'), sampleJs, opts);

                            case 7:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function generate(_x2) {
                return _ref.apply(this, arguments);
            }

            return generate;
        }()
    }]);

    return BrowserGenerator;
}();

module.exports = BrowserGenerator;
//# sourceMappingURL=generator.js.map