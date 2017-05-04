"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = options => (() => {
  var _ref = _asyncToGenerator(function* (hook) {
    const computeProperties = (() => {
      var _ref2 = _asyncToGenerator(function* (item, options) {
        yield Promise.all(Object.keys(options).map((() => {
          var _ref3 = _asyncToGenerator(function* (property) {
            let fetch, properties;

            if (Array.isArray(options[property])) {
              var _options$property = _slicedToArray(options[property], 2);

              fetch = _options$property[0];
              properties = _options$property[1];
            } else {
              fetch = options[property];
            }

            try {
              item[property] = yield fetch(item);
            } catch (e) {
              item[property] = null;
              console.error(e);
              return;
            }

            if (properties) {
              yield computeResults(item[property], properties);
            }
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

module.exports = exports["default"];