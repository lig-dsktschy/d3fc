(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@d3fc/d3fc-rebind'), require('d3-selection'), require('d3-scale'), require('@d3fc/d3fc-axis'), require('@d3fc/d3fc-data-join'), require('@d3fc/d3fc-element'), require('@d3fc/d3fc-series')) :
    typeof define === 'function' && define.amd ? define(['exports', '@d3fc/d3fc-rebind', 'd3-selection', 'd3-scale', '@d3fc/d3fc-axis', '@d3fc/d3fc-data-join', '@d3fc/d3fc-element', '@d3fc/d3fc-series'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.fc = global.fc || {}, global.fc, global.d3, global.d3, global.fc, global.fc, global.fc, global.fc));
}(this, (function (exports, d3fcRebind, d3Selection, d3Scale, d3fcAxis, d3fcDataJoin, d3fcElement, d3fcSeries) { 'use strict';

    var store = (function () {
      var data = {};

      var store = function store(target) {
        for (var _i = 0, _Object$keys = Object.keys(data); _i < _Object$keys.length; _i++) {
          var key = _Object$keys[_i];
          target[key].apply(null, data[key]);
        }

        return target;
      };

      for (var _len = arguments.length, names = new Array(_len), _key = 0; _key < _len; _key++) {
        names[_key] = arguments[_key];
      }

      var _loop = function _loop() {
        var name = _names[_i2];

        store[name] = function () {
          for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            args[_key2] = arguments[_key2];
          }

          if (!args.length) {
            return data[name];
          }

          data[name] = args;
          return store;
        };
      };

      for (var _i2 = 0, _names = names; _i2 < _names.length; _i2++) {
        _loop();
      }

      return store;
    });

    // Adapted from https://github.com/substack/insert-css
    var css = "d3fc-group.cartesian-chart{width:100%;height:100%;overflow:hidden;display:grid;display:-ms-grid;grid-template-columns:minmax(1em,max-content) auto 1fr auto minmax(1em,max-content);-ms-grid-columns:minmax(1em,max-content) auto 1fr auto minmax(1em,max-content);grid-template-rows:minmax(1em,max-content) auto 1fr auto minmax(1em,max-content);-ms-grid-rows:minmax(1em,max-content) auto 1fr auto minmax(1em,max-content);}\nd3fc-group.cartesian-chart>.top-label{align-self:center;-ms-grid-column-align:center;justify-self:center;-ms-grid-row-align:center;grid-column:3;-ms-grid-column:3;grid-row:1;-ms-grid-row:1;}\nd3fc-group.cartesian-chart>.top-axis{height:2em;grid-column:3;-ms-grid-column:3;grid-row:2;-ms-grid-row:2;}\nd3fc-group.cartesian-chart>.left-label{align-self:center;-ms-grid-column-align:center;justify-self:center;-ms-grid-row-align:center;grid-column:1;-ms-grid-column:1;grid-row:3;-ms-grid-row:3;}\nd3fc-group.cartesian-chart>.left-axis{width:3em;grid-column:2;-ms-grid-column:2;grid-row:3;-ms-grid-row:3;}\nd3fc-group.cartesian-chart>.plot-area{overflow:hidden;grid-column:3;-ms-grid-column:3;grid-row:3;-ms-grid-row:3;}\nd3fc-group.cartesian-chart>.right-axis{width:3em;grid-column:4;-ms-grid-column:4;grid-row:3;-ms-grid-row:3;}\nd3fc-group.cartesian-chart>.right-label{align-self:center;-ms-grid-column-align:center;justify-self:center;-ms-grid-row-align:center;grid-column:5;-ms-grid-column:5;grid-row:3;-ms-grid-row:3;}\nd3fc-group.cartesian-chart>.bottom-axis{height:2em;grid-column:3;-ms-grid-column:3;grid-row:4;-ms-grid-row:4;}\nd3fc-group.cartesian-chart>.bottom-label{align-self:center;-ms-grid-column-align:center;justify-self:center;-ms-grid-row-align:center;grid-column:3;-ms-grid-column:3;grid-row:5;-ms-grid-row:5;}\nd3fc-group.cartesian-chart>.y-label{display:flex;transform:rotate(-90deg);width:1em;white-space:nowrap;justify-content:center;}";
    var styleElement = document.createElement('style');
    styleElement.setAttribute('type', 'text/css');
    document.querySelector('head').appendChild(styleElement);

    if (styleElement.styleSheet) {
      styleElement.styleSheet.cssText += css;
    } else {
      styleElement.textContent += css;
    }

    var functor = function functor(v) {
      return typeof v === 'function' ? v : function () {
        return v;
      };
    };

    var cartesianChart = (function () {
      var _getArguments = getArguments.apply(void 0, arguments),
          xScale = _getArguments.xScale,
          yScale = _getArguments.yScale,
          xAxis = _getArguments.xAxis,
          yAxis = _getArguments.yAxis;

      var chartLabel = functor('');
      var xLabel = functor('');
      var yLabel = functor('');
      var xAxisHeight = functor(null);
      var yAxisWidth = functor(null);
      var yOrient = functor('right');
      var xOrient = functor('bottom');
      var webglPlotArea = null;
      var canvasPlotArea = null;
      var svgPlotArea = null;
      var isContextLost = false;
      var useDevicePixelRatio = true;
      var xAxisStore = store('tickFormat', 'ticks', 'tickArguments', 'tickSize', 'tickSizeInner', 'tickSizeOuter', 'tickValues', 'tickPadding', 'tickCenterLabel');

      var xDecorate = function xDecorate() {};

      var yAxisStore = store('tickFormat', 'ticks', 'tickArguments', 'tickSize', 'tickSizeInner', 'tickSizeOuter', 'tickValues', 'tickPadding', 'tickCenterLabel');

      var yDecorate = function yDecorate() {};

      var decorate = function decorate() {};

      var containerDataJoin = d3fcDataJoin.dataJoin('d3fc-group', 'cartesian-chart');
      var webglDataJoin = d3fcDataJoin.dataJoin('d3fc-canvas', 'webgl-plot-area');
      var canvasDataJoin = d3fcDataJoin.dataJoin('d3fc-canvas', 'canvas-plot-area');
      var svgDataJoin = d3fcDataJoin.dataJoin('d3fc-svg', 'svg-plot-area');
      var xAxisDataJoin = d3fcDataJoin.dataJoin('d3fc-svg', 'x-axis').key(function (d) {
        return d;
      });
      var yAxisDataJoin = d3fcDataJoin.dataJoin('d3fc-svg', 'y-axis').key(function (d) {
        return d;
      });
      var chartLabelDataJoin = d3fcDataJoin.dataJoin('div', 'chart-label');
      var xLabelDataJoin = d3fcDataJoin.dataJoin('div', 'x-label').key(function (d) {
        return d;
      });
      var yLabelDataJoin = d3fcDataJoin.dataJoin('div', 'y-label').key(function (d) {
        return d;
      });

      var propagateTransition = function propagateTransition(maybeTransition) {
        return function (selection) {
          return d3fcDataJoin.isTransition(maybeTransition) ? selection.transition(maybeTransition) : selection;
        };
      };

      var cartesian = function cartesian(selection) {
        var transitionPropagator = propagateTransition(selection);
        selection.each(function (data, index, group) {
          var container = containerDataJoin(d3Selection.select(group[index]), [data]);
          container.enter().attr('auto-resize', '');
          chartLabelDataJoin(container, [xOrient(data)]).attr('class', function (d) {
            return d === 'top' ? 'chart-label bottom-label' : 'chart-label top-label';
          }).style('margin-bottom', function (d) {
            return d === 'top' ? 0 : '1em';
          }).style('margin-top', function (d) {
            return d === 'top' ? '1em' : 0;
          }).text(chartLabel(data));
          xLabelDataJoin(container, [xOrient(data)]).attr('class', function (d) {
            return "x-label ".concat(d, "-label");
          }).text(xLabel(data));
          yLabelDataJoin(container, [yOrient(data)]).attr('class', function (d) {
            return "y-label ".concat(d, "-label");
          }).text(yLabel(data));
          webglDataJoin(container, webglPlotArea ? [data] : []).attr('set-webgl-viewport', '').classed('plot-area', true).attr('use-device-pixel-ratio', useDevicePixelRatio).on('draw', function (event, d) {
            var _event$detail = event.detail,
                child = _event$detail.child,
                pixelRatio = _event$detail.pixelRatio;
            webglPlotArea.context(isContextLost ? null : child.getContext('webgl', {
              preserveDrawingBuffer: true
            })).pixelRatio(pixelRatio).xScale(xScale).yScale(yScale);
            webglPlotArea(d);
          });
          container.select('.webgl-plot-area>canvas').on('webglcontextlost', function (event) {
            console.warn('WebGLRenderingContext lost');
            event.preventDefault();
            isContextLost = true;
            container.node().requestRedraw();
          }).on('webglcontextrestored', function () {
            console.info('WebGLRenderingContext restored');
            isContextLost = false;
            container.node().requestRedraw();
          });
          canvasDataJoin(container, canvasPlotArea ? [data] : []).classed('plot-area', true).attr('use-device-pixel-ratio', useDevicePixelRatio).on('draw', function (event, d) {
            var _event$detail2 = event.detail,
                child = _event$detail2.child,
                pixelRatio = _event$detail2.pixelRatio;
            var context = child.getContext('2d');
            context.save();

            if (useDevicePixelRatio) {
              context.scale(pixelRatio, pixelRatio);
            }

            canvasPlotArea.context(context).xScale(xScale).yScale(yScale);
            canvasPlotArea(d);
            context.restore();
          });
          svgDataJoin(container, svgPlotArea ? [data] : []).classed('plot-area', true).on('draw', function (event, d) {
            var child = event.detail.child;
            svgPlotArea.xScale(xScale).yScale(yScale);
            transitionPropagator(d3Selection.select(child).datum(d)).call(svgPlotArea);
          });
          xAxisDataJoin(container, [xOrient(data)]).attr('class', function (d) {
            return "x-axis ".concat(d, "-axis");
          }).style('height', xAxisHeight(data)).on('measure', function (event, d) {
            var _event$detail3 = event.detail,
                width = _event$detail3.width,
                height = _event$detail3.height,
                child = _event$detail3.child;

            if (d === 'top') {
              d3Selection.select(child).attr('viewBox', "0 ".concat(-height, " ").concat(width, " ").concat(height));
            }

            xScale.range([0, width]);
          }).on('draw', function (event, d) {
            var child = event.detail.child;
            var xAxisComponent = d === 'top' ? xAxis.top(xScale) : xAxis.bottom(xScale);
            xAxisComponent.decorate(xDecorate);
            transitionPropagator(d3Selection.select(child).datum(d)).call(xAxisStore(xAxisComponent));
          });
          yAxisDataJoin(container, [yOrient(data)]).attr('class', function (d) {
            return "y-axis ".concat(d, "-axis");
          }).style('width', yAxisWidth(data)).on('measure', function (event, d) {
            var _event$detail4 = event.detail,
                width = _event$detail4.width,
                height = _event$detail4.height,
                child = _event$detail4.child;

            if (d === 'left') {
              d3Selection.select(child).attr('viewBox', "".concat(-width, " 0 ").concat(width, " ").concat(height));
            }

            yScale.range([height, 0]);
          }).on('draw', function (event, d) {
            var child = event.detail.child;
            var yAxisComponent = d === 'left' ? yAxis.left(yScale) : yAxis.right(yScale);
            yAxisComponent.decorate(yDecorate);
            transitionPropagator(d3Selection.select(child).datum(d)).call(yAxisStore(yAxisComponent));
          });
          container.each(function (d, i, nodes) {
            return nodes[i].requestRedraw();
          });
          decorate(container, data, index);
        });
      };

      var scaleExclusions = d3fcRebind.exclude(/range\w*/, // the scale range is set via the component layout
      /tickFormat/ // use axis.tickFormat instead (only present on linear scales)
      );
      d3fcRebind.rebindAll(cartesian, xScale, scaleExclusions, d3fcRebind.prefix('x'));
      d3fcRebind.rebindAll(cartesian, yScale, scaleExclusions, d3fcRebind.prefix('y'));
      d3fcRebind.rebindAll(cartesian, xAxisStore, d3fcRebind.prefix('x'));
      d3fcRebind.rebindAll(cartesian, yAxisStore, d3fcRebind.prefix('y'));

      cartesian.xOrient = function () {
        if (!arguments.length) {
          return xOrient;
        }

        xOrient = functor(arguments.length <= 0 ? undefined : arguments[0]);
        return cartesian;
      };

      cartesian.yOrient = function () {
        if (!arguments.length) {
          return yOrient;
        }

        yOrient = functor(arguments.length <= 0 ? undefined : arguments[0]);
        return cartesian;
      };

      cartesian.xDecorate = function () {
        if (!arguments.length) {
          return xDecorate;
        }

        xDecorate = arguments.length <= 0 ? undefined : arguments[0];
        return cartesian;
      };

      cartesian.yDecorate = function () {
        if (!arguments.length) {
          return yDecorate;
        }

        yDecorate = arguments.length <= 0 ? undefined : arguments[0];
        return cartesian;
      };

      cartesian.chartLabel = function () {
        if (!arguments.length) {
          return chartLabel;
        }

        chartLabel = functor(arguments.length <= 0 ? undefined : arguments[0]);
        return cartesian;
      };

      cartesian.xLabel = function () {
        if (!arguments.length) {
          return xLabel;
        }

        xLabel = functor(arguments.length <= 0 ? undefined : arguments[0]);
        return cartesian;
      };

      cartesian.yLabel = function () {
        if (!arguments.length) {
          return yLabel;
        }

        yLabel = functor(arguments.length <= 0 ? undefined : arguments[0]);
        return cartesian;
      };

      cartesian.xAxisHeight = function () {
        if (!arguments.length) {
          return xAxisHeight;
        }

        xAxisHeight = functor(arguments.length <= 0 ? undefined : arguments[0]);
        return cartesian;
      };

      cartesian.yAxisWidth = function () {
        if (!arguments.length) {
          return yAxisWidth;
        }

        yAxisWidth = functor(arguments.length <= 0 ? undefined : arguments[0]);
        return cartesian;
      };

      cartesian.webglPlotArea = function () {
        if (!arguments.length) {
          return webglPlotArea;
        }

        webglPlotArea = arguments.length <= 0 ? undefined : arguments[0];
        return cartesian;
      };

      cartesian.canvasPlotArea = function () {
        if (!arguments.length) {
          return canvasPlotArea;
        }

        canvasPlotArea = arguments.length <= 0 ? undefined : arguments[0];
        return cartesian;
      };

      cartesian.svgPlotArea = function () {
        if (!arguments.length) {
          return svgPlotArea;
        }

        svgPlotArea = arguments.length <= 0 ? undefined : arguments[0];
        return cartesian;
      };

      cartesian.decorate = function () {
        if (!arguments.length) {
          return decorate;
        }

        decorate = arguments.length <= 0 ? undefined : arguments[0];
        return cartesian;
      };

      cartesian.useDevicePixelRatio = function () {
        if (!arguments.length) {
          return useDevicePixelRatio;
        }

        useDevicePixelRatio = arguments.length <= 0 ? undefined : arguments[0];
        return cartesian;
      };

      return cartesian;
    });

    var getArguments = function getArguments() {
      var defaultSettings = {
        xScale: d3Scale.scaleIdentity(),
        yScale: d3Scale.scaleIdentity(),
        xAxis: {
          bottom: d3fcAxis.axisBottom,
          top: d3fcAxis.axisTop
        },
        yAxis: {
          right: d3fcAxis.axisRight,
          left: d3fcAxis.axisLeft
        }
      };

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      if (args.length === 1 && !args[0].domain && !args[0].range) {
        // Settings object
        return Object.assign(defaultSettings, args[0]);
      } // xScale/yScale parameters


      return Object.assign(defaultSettings, {
        xScale: args[0] || defaultSettings.xScale,
        yScale: args[1] || defaultSettings.yScale
      });
    };

    var functor$1 = function functor(v) {
      return typeof v === 'function' ? v : function () {
        return v;
      };
    };

    var cartesianBase = (function (setPlotArea, defaultPlotArea) {
      return function () {
        var yLabel = functor$1('');
        var plotArea = defaultPlotArea;

        var decorate = function decorate() {};

        var cartesian = cartesianChart.apply(void 0, arguments);

        var cartesianBase = function cartesianBase(selection) {
          setPlotArea(cartesian, plotArea);
          cartesian.decorate(function (container, data, index) {
            container.enter().select('.x-label').style('height', '1em').style('line-height', '1em');
            var yOrientValue = cartesian.yOrient()(data);
            container.enter().append('div').attr('class', 'y-label-container').style('grid-column', yOrientValue === 'left' ? 1 : 5).style('-ms-grid-column', yOrientValue === 'left' ? 1 : 5).style('grid-row', 3).style('-ms-grid-row', 3).style('width', '1em').style('display', 'flex').style('align-items', 'center').style('justify-content', 'center').style('white-space', 'nowrap').append('div').attr('class', 'y-label').style('transform', 'rotate(-90deg)');
            container.select('.y-label-container>.y-label').text(yLabel);
            decorate(container, data, index);
          });
          selection.call(cartesian);
        };

        d3fcRebind.rebindAll(cartesianBase, cartesian, d3fcRebind.include(/^x/, /^y/, 'chartLabel'));

        cartesianBase.yLabel = function () {
          if (!arguments.length) {
            return yLabel;
          }

          yLabel = functor$1(arguments.length <= 0 ? undefined : arguments[0]);
          return cartesianBase;
        };

        cartesianBase.plotArea = function () {
          if (!arguments.length) {
            return plotArea;
          }

          plotArea = arguments.length <= 0 ? undefined : arguments[0];
          return cartesianBase;
        };

        cartesianBase.decorate = function () {
          if (!arguments.length) {
            return decorate;
          }

          decorate = arguments.length <= 0 ? undefined : arguments[0];
          return cartesianBase;
        };

        return cartesianBase;
      };
    });

    var cartesian = cartesianBase(function (cartesian, plotArea) {
      return cartesian.svgPlotArea(plotArea);
    }, d3fcSeries.seriesSvgLine);

    var cartesian$1 = cartesianBase(function (cartesian, plotArea) {
      return cartesian.canvasPlotArea(plotArea);
    }, d3fcSeries.seriesCanvasLine);

    exports.chartCanvasCartesian = cartesian$1;
    exports.chartCartesian = cartesianChart;
    exports.chartSvgCartesian = cartesian;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
