(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3-scale'), require('d3-selection'), require('@d3fc/d3fc-data-join'), require('@d3fc/d3fc-shape'), require('@d3fc/d3fc-rebind'), require('@d3fc/d3fc-series'), require('d3-shape')) :
    typeof define === 'function' && define.amd ? define(['exports', 'd3-scale', 'd3-selection', '@d3fc/d3fc-data-join', '@d3fc/d3fc-shape', '@d3fc/d3fc-rebind', '@d3fc/d3fc-series', 'd3-shape'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.fc = global.fc || {}, global.d3, global.d3, global.fc, global.fc, global.fc, global.fc, global.d3));
}(this, (function (exports, d3Scale, d3Selection, d3fcDataJoin, d3fcShape, d3fcRebind, d3fcSeries, d3Shape) { 'use strict';

    var constant = (function (value) {
      return typeof value === 'function' ? value : function () {
        return value;
      };
    });

    var band = (function () {
      var xScale = d3Scale.scaleIdentity();
      var yScale = d3Scale.scaleIdentity();
      var orient = 'horizontal';

      var fromValue = function fromValue(d) {
        return d.from;
      };

      var toValue = function toValue(d) {
        return d.to;
      };

      var decorate = function decorate() {};

      var join = d3fcDataJoin.dataJoin('g', 'annotation-band');
      var pathGenerator = d3fcShape.shapeBar().horizontalAlign('center').verticalAlign('center').x(0).y(0);

      var instance = function instance(selection) {
        if (d3fcDataJoin.isTransition(selection)) {
          join.transition(selection);
        }

        if (orient !== 'horizontal' && orient !== 'vertical') {
          throw new Error('Invalid orientation');
        }

        var horizontal = orient === 'horizontal';
        var translation = horizontal ? function (a, b) {
          return "translate(".concat(a, ", ").concat(b, ")");
        } : function (a, b) {
          return "translate(".concat(b, ", ").concat(a, ")");
        }; // the value scale which the annotation 'value' relates to, the crossScale
        // is the other. Which is which depends on the orienation!

        var crossScale = horizontal ? xScale : yScale;
        var valueScale = horizontal ? yScale : xScale;
        var crossScaleRange = crossScale.range();
        var crossScaleSize = crossScaleRange[1] - crossScaleRange[0];
        var valueAxisDimension = horizontal ? 'height' : 'width';
        var crossAxisDimension = horizontal ? 'width' : 'height';

        var containerTransform = function containerTransform() {
          return translation((crossScaleRange[1] + crossScaleRange[0]) / 2, (valueScale(toValue.apply(void 0, arguments)) + valueScale(fromValue.apply(void 0, arguments))) / 2);
        };

        pathGenerator[crossAxisDimension](crossScaleSize);
        pathGenerator[valueAxisDimension](function () {
          return valueScale(toValue.apply(void 0, arguments)) - valueScale(fromValue.apply(void 0, arguments));
        });
        selection.each(function (data, index, nodes) {
          var g = join(d3Selection.select(nodes[index]), data);
          g.enter().attr('transform', containerTransform).append('path').classed('band', true);
          g.attr('class', "annotation-band ".concat(orient)).attr('transform', containerTransform).select('path') // the path generator is being used to render a single path, hence
          // an explicit index is provided
          .attr('d', function (d, i) {
            return pathGenerator([d], i);
          });
          decorate(g, data, index);
        });
      };

      instance.xScale = function () {
        if (!arguments.length) {
          return xScale;
        }

        xScale = arguments.length <= 0 ? undefined : arguments[0];
        return instance;
      };

      instance.yScale = function () {
        if (!arguments.length) {
          return yScale;
        }

        yScale = arguments.length <= 0 ? undefined : arguments[0];
        return instance;
      };

      instance.orient = function () {
        if (!arguments.length) {
          return orient;
        }

        orient = arguments.length <= 0 ? undefined : arguments[0];
        return instance;
      };

      instance.decorate = function () {
        if (!arguments.length) {
          return decorate;
        }

        decorate = arguments.length <= 0 ? undefined : arguments[0];
        return instance;
      };

      instance.fromValue = function () {
        if (!arguments.length) {
          return fromValue;
        }

        fromValue = constant(arguments.length <= 0 ? undefined : arguments[0]);
        return instance;
      };

      instance.toValue = function () {
        if (!arguments.length) {
          return toValue;
        }

        toValue = constant(arguments.length <= 0 ? undefined : arguments[0]);
        return instance;
      };

      return instance;
    });

    var band$1 = (function () {
      var xScale = d3Scale.scaleIdentity();
      var yScale = d3Scale.scaleIdentity();
      var orient = 'horizontal';

      var fromValue = function fromValue(d) {
        return d.from;
      };

      var toValue = function toValue(d) {
        return d.to;
      };

      var decorate = function decorate() {};

      var pathGenerator = d3fcShape.shapeBar().horizontalAlign('right').verticalAlign('top');

      var instance = function instance(data) {
        if (orient !== 'horizontal' && orient !== 'vertical') {
          throw new Error('Invalid orientation');
        }

        var context = pathGenerator.context();
        var horizontal = orient === 'horizontal'; // the value scale which the annotation 'value' relates to, the crossScale
        // is the other. Which is which depends on the orienation!

        var crossScale = horizontal ? xScale : yScale;
        var valueScale = horizontal ? yScale : xScale;
        var crossScaleRange = crossScale.range();
        var crossScaleSize = crossScaleRange[1] - crossScaleRange[0];
        var valueAxisStart = horizontal ? 'x' : 'y';
        var crossAxisStart = horizontal ? 'y' : 'x';
        var valueAxisDimension = horizontal ? 'height' : 'width';
        var crossAxisDimension = horizontal ? 'width' : 'height';
        data.forEach(function (d, i) {
          context.save();
          context.beginPath();
          context.strokeStyle = 'transparent';
          pathGenerator[crossAxisStart](valueScale(fromValue(d)));
          pathGenerator[valueAxisStart](crossScaleRange[0]);
          pathGenerator[crossAxisDimension](crossScaleSize);
          pathGenerator[valueAxisDimension](valueScale(toValue(d)) - valueScale(fromValue(d)));
          decorate(context, d, i);
          pathGenerator.context(context)([d], i);
          context.fill();
          context.stroke();
          context.closePath();
          context.restore();
        });
      };

      instance.xScale = function () {
        if (!arguments.length) {
          return xScale;
        }

        xScale = arguments.length <= 0 ? undefined : arguments[0];
        return instance;
      };

      instance.yScale = function () {
        if (!arguments.length) {
          return yScale;
        }

        yScale = arguments.length <= 0 ? undefined : arguments[0];
        return instance;
      };

      instance.orient = function () {
        if (!arguments.length) {
          return orient;
        }

        orient = arguments.length <= 0 ? undefined : arguments[0];
        return instance;
      };

      instance.decorate = function () {
        if (!arguments.length) {
          return decorate;
        }

        decorate = arguments.length <= 0 ? undefined : arguments[0];
        return instance;
      };

      instance.fromValue = function () {
        if (!arguments.length) {
          return fromValue;
        }

        fromValue = constant(arguments.length <= 0 ? undefined : arguments[0]);
        return instance;
      };

      instance.toValue = function () {
        if (!arguments.length) {
          return toValue;
        }

        toValue = constant(arguments.length <= 0 ? undefined : arguments[0]);
        return instance;
      };

      d3fcRebind.rebind(instance, pathGenerator, 'context');
      return instance;
    });

    var annotationLine = (function () {
      var xScale = d3Scale.scaleIdentity();
      var yScale = d3Scale.scaleIdentity();

      var value = function value(d) {
        return d;
      };

      var label = value;

      var decorate = function decorate() {};

      var orient = 'horizontal';
      var join = d3fcDataJoin.dataJoin('g', 'annotation-line');

      var instance = function instance(selection) {
        if (d3fcDataJoin.isTransition(selection)) {
          join.transition(selection);
        }

        if (orient !== 'horizontal' && orient !== 'vertical') {
          throw new Error('Invalid orientation');
        }

        var horizontal = orient === 'horizontal';
        var translation = horizontal ? function (a, b) {
          return "translate(".concat(a, ", ").concat(b, ")");
        } : function (a, b) {
          return "translate(".concat(b, ", ").concat(a, ")");
        };
        var lineProperty = horizontal ? 'x2' : 'y2'; // the value scale which the annotation 'value' relates to, the crossScale
        // is the other. Which is which depends on the orienation!

        var crossScale = horizontal ? xScale : yScale;
        var valueScale = horizontal ? yScale : xScale;
        var handleOne = horizontal ? 'left-handle' : 'bottom-handle';
        var handleTwo = horizontal ? 'right-handle' : 'top-handle';
        var textOffsetX = horizontal ? '9' : '0';
        var textOffsetY = horizontal ? '0' : '9';
        var textOffsetDeltaY = horizontal ? '0.32em' : '0.71em';
        var textAnchor = horizontal ? 'start' : 'middle';
        var scaleRange = crossScale.range(); // the transform that sets the 'origin' of the annotation

        var containerTransform = function containerTransform() {
          return translation(scaleRange[0], valueScale(value.apply(void 0, arguments)));
        };

        var scaleWidth = scaleRange[1] - scaleRange[0];
        selection.each(function (data, selectionIndex, nodes) {
          var g = join(d3Selection.select(nodes[selectionIndex]), data); // create the outer container and line

          var enter = g.enter().attr('transform', containerTransform).style('stroke', '#bbb');
          enter.append('line').attr(lineProperty, scaleWidth); // create containers at each end of the annotation

          enter.append('g').classed(handleOne, true).style('stroke', 'none');
          enter.append('g').classed(handleTwo, true).style('stroke', 'none').attr('transform', translation(scaleWidth, 0)).append('text').attr('text-anchor', textAnchor).attr('x', textOffsetX).attr('y', textOffsetY).attr('dy', textOffsetDeltaY); // Update

          g.attr('class', "annotation-line ".concat(orient)); // translate the parent container to the left hand edge of the annotation

          g.attr('transform', containerTransform); // update the elements that depend on scale width

          g.select('line').attr(lineProperty, scaleWidth);
          g.select('g.' + handleTwo).attr('transform', translation(scaleWidth, 0)); // Update the text label

          g.select('text').text(label);
          decorate(g, data, selectionIndex);
        });
      };

      instance.xScale = function () {
        if (!arguments.length) {
          return xScale;
        }

        xScale = arguments.length <= 0 ? undefined : arguments[0];
        return instance;
      };

      instance.yScale = function () {
        if (!arguments.length) {
          return yScale;
        }

        yScale = arguments.length <= 0 ? undefined : arguments[0];
        return instance;
      };

      instance.value = function () {
        if (!arguments.length) {
          return value;
        }

        value = constant(arguments.length <= 0 ? undefined : arguments[0]);
        return instance;
      };

      instance.label = function () {
        if (!arguments.length) {
          return label;
        }

        label = constant(arguments.length <= 0 ? undefined : arguments[0]);
        return instance;
      };

      instance.decorate = function () {
        if (!arguments.length) {
          return decorate;
        }

        decorate = arguments.length <= 0 ? undefined : arguments[0];
        return instance;
      };

      instance.orient = function () {
        if (!arguments.length) {
          return orient;
        }

        orient = arguments.length <= 0 ? undefined : arguments[0];
        return instance;
      };

      return instance;
    });

    function crosshair () {
      var x = function x(d) {
        return d.x;
      };

      var y = function y(d) {
        return d.y;
      };

      var xScale = d3Scale.scaleIdentity();
      var yScale = d3Scale.scaleIdentity();

      var decorate = function decorate() {};

      var join = d3fcDataJoin.dataJoin('g', 'annotation-crosshair');
      var point = d3fcSeries.seriesSvgPoint();
      var horizontalLine = annotationLine();
      var verticalLine = annotationLine().orient('vertical'); // The line annotations and point series used to render the crosshair are positioned using
      // screen coordinates. This function constructs an identity scale for these components.

      var xIdentity = d3Scale.scaleIdentity();
      var yIdentity = d3Scale.scaleIdentity();
      var multi = d3fcSeries.seriesSvgMulti().series([horizontalLine, verticalLine, point]).xScale(xIdentity).yScale(yIdentity).mapping(function (data) {
        return [data];
      });

      var instance = function instance(selection) {
        if (d3fcDataJoin.isTransition(selection)) {
          join.transition(selection);
        }

        selection.each(function (data, index, nodes) {
          var g = join(d3Selection.select(nodes[index]), data); // Prevent the crosshair triggering pointer events on itself

          g.enter().style('pointer-events', 'none'); // Assign the identity scales an accurate range to allow the line annotations to cover
          // the full width/height of the chart.

          xIdentity.range(xScale.range());
          yIdentity.range(yScale.range());
          point.crossValue(x).mainValue(y);
          horizontalLine.value(y);
          verticalLine.value(x);
          g.call(multi);
          decorate(g, data, index);
        });
      }; // Don't use the xValue/yValue convention to indicate that these values are in screen
      // not domain co-ordinates and are therefore not scaled.


      instance.x = function () {
        if (!arguments.length) {
          return x;
        }

        x = arguments.length <= 0 ? undefined : arguments[0];
        return instance;
      };

      instance.y = function () {
        if (!arguments.length) {
          return y;
        }

        y = arguments.length <= 0 ? undefined : arguments[0];
        return instance;
      };

      instance.xScale = function () {
        if (!arguments.length) {
          return xScale;
        }

        xScale = arguments.length <= 0 ? undefined : arguments[0];
        return instance;
      };

      instance.yScale = function () {
        if (!arguments.length) {
          return yScale;
        }

        yScale = arguments.length <= 0 ? undefined : arguments[0];
        return instance;
      };

      instance.decorate = function () {
        if (!arguments.length) {
          return decorate;
        }

        decorate = arguments.length <= 0 ? undefined : arguments[0];
        return instance;
      };

      var lineIncludes = d3fcRebind.include('label');
      d3fcRebind.rebindAll(instance, horizontalLine, lineIncludes, d3fcRebind.prefix('y'));
      d3fcRebind.rebindAll(instance, verticalLine, lineIncludes, d3fcRebind.prefix('x'));
      return instance;
    }

    var annotationLine$1 = (function () {
      var xScale = d3Scale.scaleIdentity();
      var yScale = d3Scale.scaleIdentity();

      var value = function value(d) {
        return d;
      };

      var label = value;

      var decorate = function decorate() {};

      var orient = 'horizontal';
      var lineData = d3Shape.line();

      var instance = function instance(data) {
        if (orient !== 'horizontal' && orient !== 'vertical') {
          throw new Error('Invalid orientation');
        }

        var horizontal = orient === 'horizontal';
        var context = lineData.context(); // the value scale which the annotation 'value' relates to, the crossScale
        // is the other. Which is which depends on the orienation!

        var crossScale = horizontal ? xScale : yScale;
        var valueScale = horizontal ? yScale : xScale;
        var crossDomain = crossScale.domain();
        var textOffsetX = horizontal ? 9 : 0;
        var textOffsetY = horizontal ? 0 : 9;
        var textAlign = horizontal ? 'left' : 'center';
        var textBaseline = horizontal ? 'middle' : 'hanging';
        data.forEach(function (d, i) {
          context.save();
          context.beginPath();
          context.strokeStyle = '#bbb';
          context.fillStyle = '#000';
          context.textAlign = textAlign;
          context.textBaseline = textBaseline;
          decorate(context, d, i); // Draw line

          lineData.context(context)(crossDomain.map(function (extent) {
            var point = [crossScale(extent), valueScale(value(d))];
            return horizontal ? point : point.reverse();
          })); // Draw label

          var x = horizontal ? crossScale(crossDomain[1]) : valueScale(value(d));
          var y = horizontal ? valueScale(value(d)) : crossScale(crossDomain[1]);
          context.fillText(label(d), x + textOffsetX, y + textOffsetY);
          context.fill();
          context.stroke();
          context.closePath();
          context.restore();
        });
      };

      instance.xScale = function () {
        if (!arguments.length) {
          return xScale;
        }

        xScale = arguments.length <= 0 ? undefined : arguments[0];
        return instance;
      };

      instance.yScale = function () {
        if (!arguments.length) {
          return yScale;
        }

        yScale = arguments.length <= 0 ? undefined : arguments[0];
        return instance;
      };

      instance.value = function () {
        if (!arguments.length) {
          return value;
        }

        value = constant(arguments.length <= 0 ? undefined : arguments[0]);
        return instance;
      };

      instance.label = function () {
        if (!arguments.length) {
          return label;
        }

        label = constant(arguments.length <= 0 ? undefined : arguments[0]);
        return instance;
      };

      instance.decorate = function () {
        if (!arguments.length) {
          return decorate;
        }

        decorate = arguments.length <= 0 ? undefined : arguments[0];
        return instance;
      };

      instance.orient = function () {
        if (!arguments.length) {
          return orient;
        }

        orient = arguments.length <= 0 ? undefined : arguments[0];
        return instance;
      };

      d3fcRebind.rebind(instance, lineData, 'context');
      return instance;
    });

    var crosshair$1 = (function () {
      var x = function x(d) {
        return d.x;
      };

      var y = function y(d) {
        return d.y;
      };

      var xScale = d3Scale.scaleIdentity();
      var yScale = d3Scale.scaleIdentity();
      var point = d3fcSeries.seriesCanvasPoint();
      var horizontalLine = annotationLine$1();
      var verticalLine = annotationLine$1().orient('vertical'); // The line annotations and point series used to render the crosshair are positioned using
      // screen coordinates. This function constructs an identity scale for these components.

      var xIdentity = d3Scale.scaleIdentity();
      var yIdentity = d3Scale.scaleIdentity();
      var multi = d3fcSeries.seriesCanvasMulti().series([horizontalLine, verticalLine, point]).xScale(xIdentity).yScale(yIdentity).mapping(function (data) {
        return [data];
      });

      var instance = function instance(data) {
        data.forEach(function (d) {
          // Assign the identity scales an accurate range to allow the line annotations to cover
          // the full width/height of the chart.
          xIdentity.range(xScale.range());
          yIdentity.range(yScale.range());
          point.crossValue(x).mainValue(y);
          horizontalLine.value(y);
          verticalLine.value(x);
          multi(d);
        });
      }; // Don't use the xValue/yValue convention to indicate that these values are in screen
      // not domain co-ordinates and are therefore not scaled.


      instance.x = function () {
        if (!arguments.length) {
          return x;
        }

        x = arguments.length <= 0 ? undefined : arguments[0];
        return instance;
      };

      instance.y = function () {
        if (!arguments.length) {
          return y;
        }

        y = arguments.length <= 0 ? undefined : arguments[0];
        return instance;
      };

      instance.xScale = function () {
        if (!arguments.length) {
          return xScale;
        }

        xScale = arguments.length <= 0 ? undefined : arguments[0];
        return instance;
      };

      instance.yScale = function () {
        if (!arguments.length) {
          return yScale;
        }

        yScale = arguments.length <= 0 ? undefined : arguments[0];
        return instance;
      };

      var lineIncludes = d3fcRebind.include('label', 'decorate');
      d3fcRebind.rebindAll(instance, horizontalLine, lineIncludes, d3fcRebind.prefix('y'));
      d3fcRebind.rebindAll(instance, verticalLine, lineIncludes, d3fcRebind.prefix('x'));
      d3fcRebind.rebind(instance, point, 'decorate');
      d3fcRebind.rebind(instance, multi, 'context');
      return instance;
    });

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

    var ticks = (function () {
      var scale = d3Scale.scaleIdentity();
      var tickArguments = [10];
      var tickValues = null;

      var ticks = function ticks() {
        var _scale;

        return tickValues != null ? tickValues : scale.ticks ? (_scale = scale).ticks.apply(_scale, _toConsumableArray(tickArguments)) : scale.domain();
      };

      ticks.scale = function () {
        if (!arguments.length) {
          return scale;
        }

        scale = arguments.length <= 0 ? undefined : arguments[0];
        return ticks;
      };

      ticks.ticks = function () {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        tickArguments = args;
        return ticks;
      };

      ticks.tickArguments = function () {
        if (!arguments.length) {
          return tickArguments;
        }

        tickArguments = arguments.length <= 0 ? undefined : arguments[0];
        return ticks;
      };

      ticks.tickValues = function () {
        if (!arguments.length) {
          return tickValues;
        }

        tickValues = arguments.length <= 0 ? undefined : arguments[0];
        return ticks;
      };

      return ticks;
    });

    var identity = function identity(d) {
      return d;
    };

    var gridline = (function () {
      var xDecorate = function xDecorate() {};

      var yDecorate = function yDecorate() {};

      var xTicks = ticks();
      var yTicks = ticks();
      var xJoin = d3fcDataJoin.dataJoin('line', 'gridline-y').key(identity);
      var yJoin = d3fcDataJoin.dataJoin('line', 'gridline-x').key(identity);

      var instance = function instance(selection) {
        if (d3fcDataJoin.isTransition(selection)) {
          xJoin.transition(selection);
          yJoin.transition(selection);
        }

        selection.each(function (data, index, nodes) {
          var element = nodes[index];
          var container = d3Selection.select(nodes[index]);
          var xScale = xTicks.scale();
          var yScale = yTicks.scale(); // Stash a snapshot of the scale, and retrieve the old snapshot.

          var xScaleOld = element.__x_scale__ || xScale;
          element.__x_scale__ = xScale.copy();
          var xData = xTicks();
          var xLines = xJoin(container, xData);
          xLines.enter().attr('x1', xScaleOld).attr('x2', xScaleOld).attr('y1', yScale.range()[0]).attr('y2', yScale.range()[1]).attr('stroke', '#bbb');
          xLines.attr('x1', xScale).attr('x2', xScale).attr('y1', yScale.range()[0]).attr('y2', yScale.range()[1]);
          xLines.exit().attr('x1', xScale).attr('x2', xScale);
          xDecorate(xLines, xData, index); // Stash a snapshot of the scale, and retrieve the old snapshot.

          var yScaleOld = element.__y_scale__ || yScale;
          element.__y_scale__ = yScale.copy();
          var yData = yTicks();
          var yLines = yJoin(container, yData);
          yLines.enter().attr('y1', yScaleOld).attr('y2', yScaleOld).attr('x1', xScale.range()[0]).attr('x2', xScale.range()[1]).attr('stroke', '#bbb');
          yLines.attr('y1', yScale).attr('y2', yScale).attr('x1', xScale.range()[0]).attr('x2', xScale.range()[1]);
          yLines.exit().attr('y1', yScale).attr('y2', yScale);
          yDecorate(yLines, yData, index);
        });
      };

      instance.yDecorate = function () {
        if (!arguments.length) {
          return yDecorate;
        }

        yDecorate = arguments.length <= 0 ? undefined : arguments[0];
        return instance;
      };

      instance.xDecorate = function () {
        if (!arguments.length) {
          return xDecorate;
        }

        xDecorate = arguments.length <= 0 ? undefined : arguments[0];
        return instance;
      };

      d3fcRebind.rebindAll(instance, xJoin, d3fcRebind.includeMap({
        'key': 'xKey'
      }));
      d3fcRebind.rebindAll(instance, yJoin, d3fcRebind.includeMap({
        'key': 'yKey'
      }));
      d3fcRebind.rebindAll(instance, xTicks, d3fcRebind.prefix('x'));
      d3fcRebind.rebindAll(instance, yTicks, d3fcRebind.prefix('y'));
      return instance;
    });

    var gridline$1 = (function () {
      var xDecorate = function xDecorate() {};

      var yDecorate = function yDecorate() {};

      var xTicks = ticks();
      var yTicks = ticks();
      var lineData = d3Shape.line();

      var instance = function instance() {
        var context = lineData.context();
        var xScale = xTicks.scale();
        var yScale = yTicks.scale();
        xTicks().forEach(function (xTick, i) {
          context.save();
          context.beginPath();
          context.strokeStyle = '#bbb';
          context.fillStyle = 'transparent';
          xDecorate(context, xTick, i);
          lineData.context(context)(yScale.domain().map(function (d) {
            return [xScale(xTick), yScale(d)];
          }));
          context.fill();
          context.stroke();
          context.closePath();
          context.restore();
        });
        yTicks().forEach(function (yTick, i) {
          context.save();
          context.beginPath();
          context.strokeStyle = '#bbb';
          context.fillStyle = 'transparent';
          yDecorate(context, yTick, i);
          lineData.context(context)(xScale.domain().map(function (d) {
            return [xScale(d), yScale(yTick)];
          }));
          context.fill();
          context.stroke();
          context.closePath();
          context.restore();
        });
      };

      instance.yDecorate = function () {
        if (!arguments.length) {
          return yDecorate;
        }

        yDecorate = arguments.length <= 0 ? undefined : arguments[0];
        return instance;
      };

      instance.xDecorate = function () {
        if (!arguments.length) {
          return xDecorate;
        }

        xDecorate = arguments.length <= 0 ? undefined : arguments[0];
        return instance;
      };

      d3fcRebind.rebindAll(instance, xTicks, d3fcRebind.prefix('x'));
      d3fcRebind.rebindAll(instance, yTicks, d3fcRebind.prefix('y'));
      d3fcRebind.rebind(instance, lineData, 'context');
      return instance;
    });

    exports.annotationCanvasBand = band$1;
    exports.annotationCanvasCrosshair = crosshair$1;
    exports.annotationCanvasGridline = gridline$1;
    exports.annotationCanvasLine = annotationLine$1;
    exports.annotationSvgBand = band;
    exports.annotationSvgCrosshair = crosshair;
    exports.annotationSvgGridline = gridline;
    exports.annotationSvgLine = annotationLine;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
