(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3-selection'), require('d3-scale'), require('d3-dispatch'), require('@d3fc/d3fc-rebind'), require('@d3fc/d3fc-data-join'), require('d3-brush')) :
    typeof define === 'function' && define.amd ? define(['exports', 'd3-selection', 'd3-scale', 'd3-dispatch', '@d3fc/d3fc-rebind', '@d3fc/d3fc-data-join', 'd3-brush'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.fc = global.fc || {}, global.d3, global.d3, global.d3, global.fc, global.fc, global.d3));
}(this, (function (exports, d3Selection, d3Scale, d3Dispatch, d3fcRebind, d3fcDataJoin, d3Brush) { 'use strict';

    var brushForOrient = function brushForOrient(orient) {
      switch (orient) {
        case 'x':
          return d3Brush.brushX();

        case 'y':
          return d3Brush.brushY();

        case 'xy':
          return d3Brush.brush();
      }
    };

    var invertRange = function invertRange(range) {
      return [range[1], range[0]];
    };

    var brushBase = function brushBase(orient) {
      var brush = brushForOrient(orient);
      var eventDispatch = d3Dispatch.dispatch('brush', 'start', 'end');
      var xScale = d3Scale.scaleIdentity();
      var yScale = d3Scale.scaleIdentity();
      var innerJoin = d3fcDataJoin.dataJoin('g', 'brush');

      var mapSelection = function mapSelection(selection, xMapping, yMapping) {
        switch (orient) {
          case 'x':
            return selection.map(xMapping);

          case 'y':
            return selection.map(yMapping);

          case 'xy':
            return [[xMapping(selection[0][0]), yMapping(selection[0][1])], [xMapping(selection[1][0]), yMapping(selection[1][1])]];
        }
      };

      var percentToSelection = function percentToSelection(percent) {
        return mapSelection(percent, d3Scale.scaleLinear().domain(xScale.range()).invert, d3Scale.scaleLinear().domain(invertRange(yScale.range())).invert);
      };

      var selectionToPercent = function selectionToPercent(selection) {
        return mapSelection(selection, d3Scale.scaleLinear().domain(xScale.range()), d3Scale.scaleLinear().domain(invertRange(yScale.range())));
      };

      var updateXDomain = function updateXDomain(selection) {
        var f = d3Scale.scaleLinear().domain(xScale.domain());

        if (orient === 'x') {
          return selection.map(f.invert);
        } else if (orient === 'xy') {
          return [f.invert(selection[0][0]), f.invert(selection[1][0])];
        }
      };

      var updateYDomain = function updateYDomain(selection) {
        var g = d3Scale.scaleLinear().domain(invertRange(yScale.domain()));

        if (orient === 'y') {
          return [selection[1], selection[0]].map(g.invert);
        } else if (orient === 'xy') {
          return [g.invert(selection[1][1]), g.invert(selection[0][1])];
        }
      };

      var transformEvent = function transformEvent(event) {
        // The render function calls brush.move, which triggers, start, brush and end events. We don't
        // really want those events so suppress them.
        if (event.sourceEvent && event.sourceEvent.type === 'draw') return;

        if (event.selection) {
          var mappedSelection = selectionToPercent(event.selection);
          eventDispatch.call(event.type, {}, {
            selection: mappedSelection,
            xDomain: updateXDomain(mappedSelection),
            yDomain: updateYDomain(mappedSelection)
          });
        } else {
          eventDispatch.call(event.type, {}, {});
        }
      };

      var base = function base(selection) {
        selection.each(function (data, index, group) {
          // set the extent
          brush.extent([[xScale.range()[0], yScale.range()[1]], [xScale.range()[1], yScale.range()[0]]]); // forwards events

          brush.on('end', function (event) {
            return transformEvent(event);
          }).on('brush', function (event) {
            return transformEvent(event);
          }).on('start', function (event) {
            return transformEvent(event);
          }); // render

          var container = innerJoin(d3Selection.select(group[index]), [data]);
          container.call(brush).call(brush.move, data ? percentToSelection(data) : null);
        });
      };

      base.xScale = function () {
        if (!arguments.length) {
          return xScale;
        }

        xScale = arguments.length <= 0 ? undefined : arguments[0];
        return base;
      };

      base.yScale = function () {
        if (!arguments.length) {
          return yScale;
        }

        yScale = arguments.length <= 0 ? undefined : arguments[0];
        return base;
      };

      d3fcRebind.rebind(base, eventDispatch, 'on');
      d3fcRebind.rebind(base, brush, 'filter', 'handleSize');
      return base;
    };

    var brushX = function brushX() {
      return brushBase('x');
    };
    var brushY = function brushY() {
      return brushBase('y');
    };
    var brush = function brush() {
      return brushBase('xy');
    };

    exports.brush = brush;
    exports.brushX = brushX;
    exports.brushY = brushY;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
