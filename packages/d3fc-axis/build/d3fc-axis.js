(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@d3fc/d3fc-rebind'), require('d3-selection'), require('d3-shape'), require('@d3fc/d3fc-data-join')) :
  typeof define === 'function' && define.amd ? define(['exports', '@d3fc/d3fc-rebind', 'd3-selection', 'd3-shape', '@d3fc/d3fc-data-join'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.fc = global.fc || {}, global.fc, global.d3, global.d3, global.fc));
}(this, (function (exports, d3fcRebind, d3Selection, d3Shape, d3fcDataJoin) { 'use strict';

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
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

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  // these utilities capture some of the relatively complex logic within d3-axis which 
  // determines the ticks and tick formatter based on various axis and scale
  // properties: https://github.com/d3/d3-axis#axis_ticks 
  var identity = function identity(d) {
    return d;
  };

  var tryApply = function tryApply(scale, fn, args, defaultVal) {
    return scale[fn] ? scale[fn].apply(scale, args) : defaultVal;
  };

  var ticksArrayForAxis = function ticksArrayForAxis(axis) {
    var _axis$tickValues;

    return (_axis$tickValues = axis.tickValues()) !== null && _axis$tickValues !== void 0 ? _axis$tickValues : tryApply(axis.scale(), 'ticks', axis.tickArguments(), axis.scale().domain());
  };

  var tickFormatterForAxis = function tickFormatterForAxis(axis) {
    var _axis$tickFormat;

    return (_axis$tickFormat = axis.tickFormat()) !== null && _axis$tickFormat !== void 0 ? _axis$tickFormat : tryApply(axis.scale(), 'tickFormat', axis.tickArguments(), identity);
  };

  var identity$1 = function identity(d) {
    return d;
  };

  var axisBase = function axisBase(orient, scale) {
    var custom = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var tickArguments = [10];
    var tickValues = null;

    var decorate = function decorate() {};

    var tickFormat = null;
    var tickSizeOuter = 6;
    var tickSizeInner = 6;
    var tickPadding = 3;
    var svgDomainLine = d3Shape.line();

    var dataJoin = d3fcDataJoin.dataJoin('g', 'tick').key(identity$1);

    var domainPathDataJoin = d3fcDataJoin.dataJoin('path', 'domain');

    var defaultLabelOffset = function defaultLabelOffset() {
      return {
        offset: [0, tickSizeInner + tickPadding]
      };
    };

    var defaultTickPath = function defaultTickPath() {
      return {
        path: [[0, 0], [0, tickSizeInner]]
      };
    };

    var labelOffset = custom.labelOffset || defaultLabelOffset;
    var tickPath = custom.tickPath || defaultTickPath; // returns a function that creates a translation based on
    // the bound data

    var containerTranslate = function containerTranslate(scale, trans) {
      var offset = 0;

      if (scale.bandwidth) {
        offset = scale.bandwidth() / 2;

        if (scale.round()) {
          offset = Math.round(offset);
        }
      }

      return function (d) {
        return trans(scale(d) + offset, 0);
      };
    };

    var translate = function translate(x, y) {
      return isVertical() ? "translate(".concat(y, ", ").concat(x, ")") : "translate(".concat(x, ", ").concat(y, ")");
    };

    var pathTranspose = function pathTranspose(arr) {
      return isVertical() ? arr.map(function (d) {
        return [d[1], d[0]];
      }) : arr;
    };

    var isVertical = function isVertical() {
      return orient === 'left' || orient === 'right';
    };

    var axis = function axis(selection) {
      if (d3fcDataJoin.isTransition(selection)) {
        dataJoin.transition(selection);
        domainPathDataJoin.transition(selection);
      }

      selection.each(function (data, index, group) {
        var element = group[index];
        var container = d3Selection.select(element);

        if (!element.__scale__) {
          container.attr('fill', 'none').attr('font-size', 10).attr('font-family', 'sans-serif').attr('text-anchor', orient === 'right' ? 'start' : orient === 'left' ? 'end' : 'middle');
        } // Stash a snapshot of the new scale, and retrieve the old snapshot.


        var scaleOld = element.__scale__ || scale;
        element.__scale__ = scale.copy();
        var ticksArray = ticksArrayForAxis(axis);
        var tickFormatter = tickFormatterForAxis(axis);
        var sign = orient === 'bottom' || orient === 'right' ? 1 : -1;

        var withSign = function withSign(_ref) {
          var _ref2 = _slicedToArray(_ref, 2),
              x = _ref2[0],
              y = _ref2[1];

          return [x, sign * y];
        }; // add the domain line


        var range = scale.range();
        var domainPathData = pathTranspose([[range[0], sign * tickSizeOuter], [range[0], 0], [range[1], 0], [range[1], sign * tickSizeOuter]]);
        var domainLine = domainPathDataJoin(container, [data]);
        domainLine.enter().attr('stroke', '#000');
        domainLine.attr('d', svgDomainLine(domainPathData));
        var g = dataJoin(container, ticksArray);
        var labelOffsets = ticksArray.map(function (d, i) {
          return labelOffset(d, i, ticksArray);
        });
        var tickPaths = ticksArray.map(function (d, i) {
          return tickPath(d, i, ticksArray);
        }); // enter

        g.enter().attr('transform', containerTranslate(scaleOld, translate)).append('path').attr('stroke', '#000');
        g.enter().append('text').attr('transform', function (d, i) {
          return translate.apply(void 0, _toConsumableArray(withSign(labelOffsets[i].offset)));
        }).attr('fill', '#000'); // exit

        g.exit().attr('transform', containerTranslate(scale, translate)); // update

        g.select('path').attr('visibility', function (d, i) {
          return tickPaths[i].hidden && 'hidden';
        }).attr('d', function (d, i) {
          return svgDomainLine(pathTranspose(tickPaths[i].path.map(withSign)));
        });
        g.select('text').attr('visibility', function (d, i) {
          return labelOffsets[i].hidden && 'hidden';
        }).attr('transform', function (d, i) {
          return translate.apply(void 0, _toConsumableArray(withSign(labelOffsets[i].offset)));
        }).attr('dy', function () {
          var offset = '0em';

          if (isVertical()) {
            offset = '0.32em';
          } else if (orient === 'bottom') {
            offset = '0.71em';
          }

          return offset;
        }).text(tickFormatter);
        g.attr('transform', containerTranslate(scale, translate));
        decorate(g, data, index);
      });
    };

    axis.tickFormat = function () {
      if (!arguments.length) {
        return tickFormat;
      }

      tickFormat = arguments.length <= 0 ? undefined : arguments[0];
      return axis;
    };

    axis.tickSize = function () {
      if (!arguments.length) {
        return tickSizeInner;
      }

      tickSizeInner = tickSizeOuter = Number(arguments.length <= 0 ? undefined : arguments[0]);
      return axis;
    };

    axis.tickSizeInner = function () {
      if (!arguments.length) {
        return tickSizeInner;
      }

      tickSizeInner = Number(arguments.length <= 0 ? undefined : arguments[0]);
      return axis;
    };

    axis.tickSizeOuter = function () {
      if (!arguments.length) {
        return tickSizeOuter;
      }

      tickSizeOuter = Number(arguments.length <= 0 ? undefined : arguments[0]);
      return axis;
    };

    axis.tickPadding = function () {
      if (!arguments.length) {
        return tickPadding;
      }

      tickPadding = arguments.length <= 0 ? undefined : arguments[0];
      return axis;
    };

    axis.decorate = function () {
      if (!arguments.length) {
        return decorate;
      }

      decorate = arguments.length <= 0 ? undefined : arguments[0];
      return axis;
    };

    axis.scale = function () {
      if (!arguments.length) {
        return scale;
      }

      scale = arguments.length <= 0 ? undefined : arguments[0];
      return axis;
    };

    axis.ticks = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      tickArguments = [].concat(args);
      return axis;
    };

    axis.tickArguments = function () {
      if (!arguments.length) {
        return tickArguments !== null ? tickArguments.slice() : null;
      }

      tickArguments = (arguments.length <= 0 ? undefined : arguments[0]) == null ? [] : _toConsumableArray(arguments.length <= 0 ? undefined : arguments[0]);
      return axis;
    };

    axis.tickValues = function () {
      if (!arguments.length) {
        return tickValues !== null ? tickValues.slice() : null;
      }

      tickValues = (arguments.length <= 0 ? undefined : arguments[0]) == null ? [] : _toConsumableArray(arguments.length <= 0 ? undefined : arguments[0]);
      return axis;
    };

    axis.orient = function () {
      return orient;
    };

    return axis;
  };

  var axis = function axis(orient, scale) {
    var tickCenterLabel = false;

    var labelOffset = function labelOffset(tick, index, ticksArray) {
      var x = 0;
      var y = base.tickSizeInner() + base.tickPadding();
      var hidden = false;

      if (tickCenterLabel) {
        var thisPosition = scale(tick);
        var nextPosition = index < ticksArray.length - 1 ? scale(ticksArray[index + 1]) : scale.range()[1];
        x = (nextPosition - thisPosition) / 2;
        y = base.tickPadding();
        hidden = index === ticksArray.length - 1 && thisPosition === nextPosition;
      }

      return {
        offset: [x, y],
        hidden: hidden
      };
    };

    var base = axisBase(orient, scale, {
      labelOffset: labelOffset
    });

    var axis = function axis(selection) {
      return base(selection);
    };

    axis.tickCenterLabel = function () {
      if (!arguments.length) {
        return tickCenterLabel;
      }

      tickCenterLabel = arguments.length <= 0 ? undefined : arguments[0];
      return axis;
    };

    d3fcRebind.rebindAll(axis, base);
    return axis;
  };

  var axisTop = function axisTop(scale) {
    return axis('top', scale);
  };
  var axisBottom = function axisBottom(scale) {
    return axis('bottom', scale);
  };
  var axisLeft = function axisLeft(scale) {
    return axis('left', scale);
  };
  var axisRight = function axisRight(scale) {
    return axis('right', scale);
  };

  var axisOrdinal = function axisOrdinal(orient, scale) {
    var tickOffset = null;

    var step = function step(tick, index, ticksArray) {
      if (scale.step) {
        // Use the scale step size
        return scale.step();
      }

      var thisPosition = scale(tick);

      if (index < ticksArray.length - 1) {
        // Distance between ticks
        return scale(ticksArray[index + 1]) / thisPosition;
      } else {
        // 2* distance to end
        return (scale.range()[1] - thisPosition) * 2;
      }
    };

    var tickPath = function tickPath(tick, index, ticksArray) {
      var x = 0;

      if (tickOffset) {
        x = tickOffset(tick, index);
      } else {
        x = step(tick, index, ticksArray) / 2;
      }

      return {
        path: [[x, 0], [x, base.tickSizeInner()]],
        hidden: index === ticksArray.length - 1
      };
    };

    var labelOffset = function labelOffset() {
      // Don't include the tickSizeInner in the label positioning
      return {
        offset: [0, base.tickPadding()]
      };
    };

    var base = axisBase(orient, scale, {
      labelOffset: labelOffset,
      tickPath: tickPath
    });

    var axis = function axis(selection) {
      base(selection);
    };

    axis.tickOffset = function () {
      if (!arguments.length) {
        return tickOffset;
      }

      tickOffset = arguments.length <= 0 ? undefined : arguments[0];
      return axis;
    };

    d3fcRebind.rebindAll(axis, base);
    return axis;
  };

  var axisOrdinalTop = function axisOrdinalTop(scale) {
    return axisOrdinal('top', scale);
  };
  var axisOrdinalBottom = function axisOrdinalBottom(scale) {
    return axisOrdinal('bottom', scale);
  };
  var axisOrdinalLeft = function axisOrdinalLeft(scale) {
    return axisOrdinal('left', scale);
  };
  var axisOrdinalRight = function axisOrdinalRight(scale) {
    return axisOrdinal('right', scale);
  };

  var measureLabels = (function (axis) {
    var measure = function measure(selection) {
      var ticks = ticksArrayForAxis(axis);
      var tickFormatter = tickFormatterForAxis(axis);
      var labels = ticks.map(tickFormatter);
      var tester = selection.append('text');
      var boundingBoxes = labels.map(function (l) {
        return tester.text(l).node().getBBox();
      });
      var maxHeight = Math.max.apply(Math, _toConsumableArray(boundingBoxes.map(function (b) {
        return b.height;
      })));
      var maxWidth = Math.max.apply(Math, _toConsumableArray(boundingBoxes.map(function (b) {
        return b.width;
      })));
      tester.remove();
      return {
        maxHeight: maxHeight,
        maxWidth: maxWidth,
        labelCount: labels.length
      };
    };

    return measure;
  });

  var axisLabelRotate = (function (adaptee) {
    var labelRotate = 'auto';

    var decorate = function decorate() {};

    var isVertical = function isVertical() {
      return adaptee.orient() === 'left' || adaptee.orient() === 'right';
    };

    var sign = function sign() {
      return adaptee.orient() === 'top' || adaptee.orient() === 'left' ? -1 : 1;
    };

    var labelAnchor = function labelAnchor() {
      switch (adaptee.orient()) {
        case 'top':
        case 'right':
          return 'start';

        default:
          return 'end';
      }
    };

    var calculateRotation = function calculateRotation(s) {
      var _measureLabels = measureLabels(adaptee)(s),
          maxHeight = _measureLabels.maxHeight,
          maxWidth = _measureLabels.maxWidth,
          labelCount = _measureLabels.labelCount;

      var measuredSize = labelCount * maxWidth; // The more the overlap, the more we rotate

      var rotate;

      if (labelRotate === 'auto') {
        var range = adaptee.scale().range()[1];
        rotate = range < measuredSize ? 90 * Math.min(1, (measuredSize / range - 0.8) / 2) : 0;
      } else {
        rotate = labelRotate;
      }

      return {
        rotate: isVertical() ? Math.floor(sign() * (90 - rotate)) : Math.floor(-rotate),
        maxHeight: maxHeight,
        maxWidth: maxWidth,
        anchor: rotate ? labelAnchor() : 'middle'
      };
    };

    var decorateRotation = function decorateRotation(sel) {
      var _calculateRotation = calculateRotation(sel),
          rotate = _calculateRotation.rotate,
          maxHeight = _calculateRotation.maxHeight,
          anchor = _calculateRotation.anchor;

      var text = sel.select('text');
      var existingTransform = text.attr('transform');
      var offset = sign() * Math.floor(maxHeight / 2);
      var offsetTransform = isVertical() ? "translate(".concat(offset, ", 0)") : "translate(0, ".concat(offset, ")");
      text.style('text-anchor', anchor).attr('transform', "".concat(existingTransform, " ").concat(offsetTransform, " rotate(").concat(rotate, " 0 0)"));
    };

    var axisLabelRotate = function axisLabelRotate(arg) {
      adaptee(arg);
    };

    adaptee.decorate(function (s) {
      decorateRotation(s);
      decorate(s);
    });

    axisLabelRotate.decorate = function () {
      if (!arguments.length) {
        return decorate;
      }

      decorate = arguments.length <= 0 ? undefined : arguments[0];
      return axisLabelRotate;
    };

    axisLabelRotate.labelRotate = function () {
      if (!arguments.length) {
        return labelRotate;
      }

      labelRotate = arguments.length <= 0 ? undefined : arguments[0];
      return axisLabelRotate;
    };

    d3fcRebind.rebindAll(axisLabelRotate, adaptee, d3fcRebind.exclude('decorate'));
    return axisLabelRotate;
  });

  var axisLabelOffset = (function (adaptee) {
    var labelOffsetDepth = 'auto';

    var decorate = function decorate() {};

    var isVertical = function isVertical() {
      return adaptee.orient() === 'left' || adaptee.orient() === 'right';
    };

    var sign = function sign() {
      return adaptee.orient() === 'top' || adaptee.orient() === 'left' ? -1 : 1;
    };

    var decorateOffset = function decorateOffset(sel) {
      var _measureLabels = measureLabels(adaptee)(sel),
          maxHeight = _measureLabels.maxHeight,
          maxWidth = _measureLabels.maxWidth,
          labelCount = _measureLabels.labelCount;

      var range = adaptee.scale().range()[1];
      var offsetLevels = labelOffsetDepth === 'auto' ? Math.floor((isVertical() ? maxHeight : maxWidth) * labelCount / range) + 1 : labelOffsetDepth;
      var text = sel.select('text');
      var existingTransform = text.attr('transform');

      var transform = function transform(i) {
        return isVertical() ? "translate(".concat(i % offsetLevels * maxWidth * sign(), ", 0)") : "translate(0, ".concat(i % offsetLevels * maxHeight * sign(), ")");
      };

      text.attr('transform', function (_, i) {
        return "".concat(existingTransform, " ").concat(transform(i));
      });
    };

    var axisLabelOffset = function axisLabelOffset(arg) {
      return adaptee(arg);
    };

    adaptee.decorate(function (s) {
      decorateOffset(s);
      decorate(s);
    });

    axisLabelOffset.decorate = function () {
      if (!arguments.length) {
        return decorate;
      }

      decorate = arguments.length <= 0 ? undefined : arguments[0];
      return axisLabelOffset;
    };

    axisLabelOffset.labelOffsetDepth = function () {
      if (!arguments.length) {
        return labelOffsetDepth;
      }

      labelOffsetDepth = arguments.length <= 0 ? undefined : arguments[0];
      return axisLabelOffset;
    };

    d3fcRebind.rebindAll(axisLabelOffset, adaptee, d3fcRebind.exclude('decorate'));
    return axisLabelOffset;
  });

  exports.axisBottom = axisBottom;
  exports.axisLabelOffset = axisLabelOffset;
  exports.axisLabelRotate = axisLabelRotate;
  exports.axisLeft = axisLeft;
  exports.axisOrdinalBottom = axisOrdinalBottom;
  exports.axisOrdinalLeft = axisOrdinalLeft;
  exports.axisOrdinalRight = axisOrdinalRight;
  exports.axisOrdinalTop = axisOrdinalTop;
  exports.axisRight = axisRight;
  exports.axisTop = axisTop;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
