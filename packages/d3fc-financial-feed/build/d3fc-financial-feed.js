(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3-fetch')) :
    typeof define === 'function' && define.amd ? define(['exports', 'd3-fetch'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.fc = global.fc || {}, global.d3));
}(this, (function (exports, d3Fetch) { 'use strict';

    function gdax () {
      var product = 'BTC-USD';
      var start = null;
      var end = null;
      var granularity = null;

      var gdax = function gdax() {
        var params = [];

        if (start != null) {
          params.push('start=' + start.toISOString());
        }

        if (end != null) {
          params.push('end=' + end.toISOString());
        }

        if (granularity != null) {
          params.push('granularity=' + granularity);
        }

        var url = 'https://api.gdax.com/products/' + product + '/candles?' + params.join('&');
        return d3Fetch.json(url).then(function (data) {
          return data.map(function (d) {
            return {
              date: new Date(d[0] * 1000),
              open: d[3],
              high: d[2],
              low: d[1],
              close: d[4],
              volume: d[5]
            };
          });
        });
      };

      gdax.product = function (x) {
        if (!arguments.length) {
          return product;
        }

        product = x;
        return gdax;
      };

      gdax.start = function (x) {
        if (!arguments.length) {
          return start;
        }

        start = x;
        return gdax;
      };

      gdax.end = function (x) {
        if (!arguments.length) {
          return end;
        }

        end = x;
        return gdax;
      };

      gdax.granularity = function (x) {
        if (!arguments.length) {
          return granularity;
        }

        granularity = x;
        return gdax;
      };

      return gdax;
    }

    exports.feedGdax = gdax;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
