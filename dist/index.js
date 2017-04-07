'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (options) {
  return (() => {
    var _ref = _asyncToGenerator(function* (hook) {

      // returns a promise that resolves to an item (or array of items)
      let computeResults = (() => {
        var _ref2 = _asyncToGenerator(function* (item, options) {
          // an object with paginated items
          if (Array.isArray(item.data)) {
            // process each item concurrently
            item.data = yield Promise.all(item.data.map(function (item) {
              return computeProperties(item, options);
            }));

            return item;
          }

          // a single item
          return computeProperties(item, options);
        });

        return function computeResults(_x2, _x3) {
          return _ref2.apply(this, arguments);
        };
      })();

      // returns a promise that resolves to the item


      let computeProperties = (() => {
        var _ref3 = _asyncToGenerator(function* (item, options) {
          const properties = Object.keys(options);

          // process each property
          const promises = properties.map((() => {
            var _ref4 = _asyncToGenerator(function* (property) {
              const propertyOptions = options[property];

              let data = yield fetchProperty(propertyOptions.$fetch, item);

              delete propertyOptions.$fetch;

              if (data !== null) {
                data = yield computeResults(data, propertyOptions);
              }

              item[property] = data;

              return true;
            });

            return function (_x6) {
              return _ref4.apply(this, arguments);
            };
          })());

          yield Promise.all(promises);

          return item;
        });

        return function computeProperties(_x4, _x5) {
          return _ref3.apply(this, arguments);
        };
      })();

      // returns a promise that resolves to the data


      let fetchProperty = (() => {
        var _ref5 = _asyncToGenerator(function* (fetcher, item) {
          try {
            return fetcher.call(item, hook.app);
          } catch (e) {
            console.error(e);
            debug(e);
            return null;
          }
        });

        return function fetchProperty(_x7, _x8) {
          return _ref5.apply(this, arguments);
        };
      })();

      // return a promise that resolves to the hook
      hook.result = yield computeResults(hook.result, options);

      return hook;
    });

    return function (_x) {
      return _ref.apply(this, arguments);
    };
  })();
};

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const debug = require('debug')('feathers-hook-fetch');

module.exports = exports['default'];
//# sourceMappingURL=index.js.map