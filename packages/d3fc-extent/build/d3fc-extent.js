(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3-array')) :
  typeof define === 'function' && define.amd ? define(['exports', 'd3-array'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.fc = global.fc || {}, global.d3));
}(this, (function (exports, d3Array) { 'use strict';

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it;

    if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;

        var F = function () {};

        return {
          s: F,
          n: function () {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function (e) {
            throw e;
          },
          f: F
        };
      }

      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    var normalCompletion = true,
        didErr = false,
        err;
    return {
      s: function () {
        it = o[Symbol.iterator]();
      },
      n: function () {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function (e) {
        didErr = true;
        err = e;
      },
      f: function () {
        try {
          if (!normalCompletion && it.return != null) it.return();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }

  function linearExtent () {
    var accessors = [function (d) {
      return d;
    }];
    var pad = [0, 0];
    var padUnit = 'percent';
    var symmetricalAbout = null;
    var include = [];

    var instance = function instance(data) {
      var values = new Array(data.length);

      var _iterator = _createForOfIteratorHelper(accessors),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var accessor = _step.value;

          for (var i = 0; i < data.length; i++) {
            var value = accessor(data[i], i);

            if (Array.isArray(value)) {
              values.push.apply(values, _toConsumableArray(value));
            } else {
              values.push(value);
            }
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      var extent = [d3Array.min(values), d3Array.max(values)];
      extent[0] = extent[0] == null ? d3Array.min(include) : d3Array.min([extent[0]].concat(_toConsumableArray(include)));
      extent[1] = extent[1] == null ? d3Array.max(include) : d3Array.max([extent[1]].concat(_toConsumableArray(include)));

      if (symmetricalAbout != null) {
        var halfRange = Math.max(Math.abs(extent[1] - symmetricalAbout), Math.abs(extent[0] - symmetricalAbout));
        extent[0] = symmetricalAbout - halfRange;
        extent[1] = symmetricalAbout + halfRange;
      }

      switch (padUnit) {
        case 'domain':
          {
            extent[0] -= pad[0];
            extent[1] += pad[1];
            break;
          }

        case 'percent':
          {
            var delta = extent[1] - extent[0];
            extent[0] -= pad[0] * delta;
            extent[1] += pad[1] * delta;
            break;
          }

        default:
          throw new Error("Unknown padUnit: ".concat(padUnit));
      }

      return extent;
    };

    instance.accessors = function () {
      if (!arguments.length) {
        return accessors;
      }

      accessors = arguments.length <= 0 ? undefined : arguments[0];
      return instance;
    };

    instance.pad = function () {
      if (!arguments.length) {
        return pad;
      }

      pad = arguments.length <= 0 ? undefined : arguments[0];
      return instance;
    };

    instance.padUnit = function () {
      if (!arguments.length) {
        return padUnit;
      }

      padUnit = arguments.length <= 0 ? undefined : arguments[0];
      return instance;
    };

    instance.include = function () {
      if (!arguments.length) {
        return include;
      }

      include = arguments.length <= 0 ? undefined : arguments[0];
      return instance;
    };

    instance.symmetricalAbout = function () {
      if (!arguments.length) {
        return symmetricalAbout;
      }

      symmetricalAbout = arguments.length <= 0 ? undefined : arguments[0];
      return instance;
    };

    return instance;
  }

  function time () {
    var accessors = [];
    var pad = [0, 0];
    var padUnit = 'percent';
    var symmetricalAbout = null;
    var include = [];
    var extent = linearExtent();

    var valueOf = function valueOf(date) {
      return date != null ? date.valueOf() : null;
    };

    var instance = function instance(data) {
      var adaptedAccessors = accessors.map(function (accessor) {
        return function () {
          var value = accessor.apply(void 0, arguments);
          return Array.isArray(value) ? value.map(valueOf) : valueOf(value);
        };
      });
      extent.accessors(adaptedAccessors).pad(pad).padUnit(padUnit).symmetricalAbout(symmetricalAbout != null ? symmetricalAbout.valueOf() : null).include(include.map(function (date) {
        return date.valueOf();
      }));
      return extent(data).map(function (value) {
        return new Date(value);
      });
    };

    instance.accessors = function () {
      if (!arguments.length) {
        return accessors;
      }

      accessors = arguments.length <= 0 ? undefined : arguments[0];
      return instance;
    };

    instance.pad = function () {
      if (!arguments.length) {
        return pad;
      }

      pad = arguments.length <= 0 ? undefined : arguments[0];
      return instance;
    };

    instance.padUnit = function () {
      if (!arguments.length) {
        return padUnit;
      }

      padUnit = arguments.length <= 0 ? undefined : arguments[0];
      return instance;
    };

    instance.include = function () {
      if (!arguments.length) {
        return include;
      }

      include = arguments.length <= 0 ? undefined : arguments[0];
      return instance;
    };

    instance.symmetricalAbout = function () {
      if (!arguments.length) {
        return symmetricalAbout;
      }

      symmetricalAbout = arguments.length <= 0 ? undefined : arguments[0];
      return instance;
    };

    return instance;
  }

  exports.extentDate = time;
  exports.extentLinear = linearExtent;
  exports.extentTime = time;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
