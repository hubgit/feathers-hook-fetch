'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (options) {
  return function (hook) {
    // return a promise that resolves to the hook
    return computeResults(hook.result, options).then(result => {
      hook.result = result;
      return hook;
    });

    // returns a promise that resolves to an item (or array of items)
    function computeResults(item, options) {
      // an object with paginated items
      if (Array.isArray(item.data)) {
        // process each item concurrently
        return Promise.all(item.data.map(item => {
          return computeProperties(item, options);
        }));
      }

      // a single item
      return computeProperties(item, options);
    }

    // returns a promise that resolves to the item
    function computeProperties(item, options) {
      const properties = Object.keys(options);

      // process each property
      properties.forEach((() => {
        var _ref = _asyncToGenerator(function* (property) {
          const propertyOptions = options[property];

          let data = yield fetchProperty(propertyOptions.$fetch, item);

          delete propertyOptions.$fetch;

          if (data !== null) {
            data = yield computeResults(data, propertyOptions);
          }

          item[property] = data;
        });

        return function (_x) {
          return _ref.apply(this, arguments);
        };
      })());

      return Promise.resolve(item);
    }

    // returns a promise that resolves to the data
    function fetchProperty(fetcher, item) {
      try {
        return fetcher.call(item, hook.app);
      } catch (e) {
        // console.error(e)
        debug(e);
        return Promise.resolve(null);
      }
    }
  };
};

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const debug = require('debug')('feathers-hook-fetch');

module.exports = exports['default'];
//# sourceMappingURL=index.js.map