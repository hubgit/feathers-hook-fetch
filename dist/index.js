'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (options) {
  return (() => {
    var _ref = _asyncToGenerator(function* (hook) {
      const computeProperties = (() => {
        var _ref2 = _asyncToGenerator(function* (item, options) {
          yield Promise.all(Object.keys(options).map((() => {
            var _ref3 = _asyncToGenerator(function* (property) {
              var _options$property = options[property];

              const $fetch = _options$property.$fetch,
                    propertyOptions = _objectWithoutProperties(_options$property, ['$fetch']);

              try {
                item[property] = yield $fetch.call(item, hook.app);
              } catch (e) {
                item[property] = null;
                console.error(e);
                debug(e);
                return;
              }

              yield computeResults(item[property], propertyOptions);
            });

            return function (_x4) {
              return _ref3.apply(this, arguments);
            };
          })()));
        });

        return function computeProperties(_x2, _x3) {
          return _ref2.apply(this, arguments);
        };
      })();

      const computeResults = function computeResults(item, options) {
        const items = Array.isArray(item.data) ? item.data : Array.isArray(item) ? item : [item];

        return Promise.all(items.map(function (item) {
          return computeProperties(item, options);
        }));
      };

      yield computeResults(hook.result, options);

      return hook;
    });

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  })();
};

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const debug = require('debug')('feathers-hook-fetch');

module.exports = exports['default'];
//# sourceMappingURL=index.js.map