(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.fc = global.fc || {}));
}(this, (function (exports) { 'use strict';

    var createReboundMethod = (function (target, source, name) {
      var method = source[name];

      if (typeof method !== 'function') {
        throw new Error("Attempt to rebind ".concat(name, " which isn't a function on the source object"));
      }

      return function () {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var value = method.apply(source, args);
        return value === source ? target : value;
      };
    });

    var rebind = (function (target, source) {
      for (var _len = arguments.length, names = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        names[_key - 2] = arguments[_key];
      }

      for (var _i = 0, _names = names; _i < _names.length; _i++) {
        var name = _names[_i];
        target[name] = createReboundMethod(target, source, name);
      }

      return target;
    });

    var createTransform = function createTransform(transforms) {
      return function (name) {
        return transforms.reduce(function (name, fn) {
          return name && fn(name);
        }, name);
      };
    };

    var rebindAll = (function (target, source) {
      for (var _len = arguments.length, transforms = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        transforms[_key - 2] = arguments[_key];
      }

      var transform = createTransform(transforms);

      for (var _i = 0, _Object$keys = Object.keys(source); _i < _Object$keys.length; _i++) {
        var name = _Object$keys[_i];
        var result = transform(name);

        if (result) {
          target[result] = createReboundMethod(target, source, name);
        }
      }

      return target;
    });

    var regexify = (function (strsOrRegexes) {
      return strsOrRegexes.map(function (strOrRegex) {
        return typeof strOrRegex === 'string' ? new RegExp("^".concat(strOrRegex, "$")) : strOrRegex;
      });
    });

    var exclude = (function () {
      for (var _len = arguments.length, exclusions = new Array(_len), _key = 0; _key < _len; _key++) {
        exclusions[_key] = arguments[_key];
      }

      exclusions = regexify(exclusions);
      return function (name) {
        return exclusions.every(function (exclusion) {
          return !exclusion.test(name);
        }) && name;
      };
    });

    var include = (function () {
      for (var _len = arguments.length, inclusions = new Array(_len), _key = 0; _key < _len; _key++) {
        inclusions[_key] = arguments[_key];
      }

      inclusions = regexify(inclusions);
      return function (name) {
        return inclusions.some(function (inclusion) {
          return inclusion.test(name);
        }) && name;
      };
    });

    var includeMap = (function (mappings) {
      return function (name) {
        return mappings[name];
      };
    });

    var capitalizeFirstLetter = function capitalizeFirstLetter(str) {
      return str[0].toUpperCase() + str.slice(1);
    };

    var prefix = (function (prefix) {
      return function (name) {
        return prefix + capitalizeFirstLetter(name);
      };
    });

    exports.exclude = exclude;
    exports.include = include;
    exports.includeMap = includeMap;
    exports.prefix = prefix;
    exports.rebind = rebind;
    exports.rebindAll = rebindAll;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
