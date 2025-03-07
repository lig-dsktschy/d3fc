(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3-random'), require('@d3fc/d3fc-rebind'), require('d3-time')) :
  typeof define === 'function' && define.amd ? define(['exports', 'd3-random', '@d3fc/d3fc-rebind', 'd3-time'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.fc = global.fc || {}, global.d3, global.fc, global.d3));
}(this, (function (exports, d3Random, d3fcRebind, d3Time) { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function geometricBrownianMotion () {
    var period = 1;
    var steps = 20;
    var mu = 0.1;
    var sigma = 0.1;
    var random = d3Random.randomNormal();

    var geometricBrownianMotion = function geometricBrownianMotion() {
      var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var timeStep = period / steps;
      var pathData = [];

      for (var i = 0; i < steps + 1; i++) {
        pathData.push(value);
        var increment = random() * Math.sqrt(timeStep) * sigma + (mu - sigma * sigma / 2) * timeStep;
        value = value * Math.exp(increment);
      }

      return pathData;
    };

    geometricBrownianMotion.period = function () {
      if (!arguments.length) {
        return period;
      }

      period = arguments.length <= 0 ? undefined : arguments[0];
      return geometricBrownianMotion;
    };

    geometricBrownianMotion.steps = function () {
      if (!arguments.length) {
        return steps;
      }

      steps = arguments.length <= 0 ? undefined : arguments[0];
      return geometricBrownianMotion;
    };

    geometricBrownianMotion.mu = function () {
      if (!arguments.length) {
        return mu;
      }

      mu = arguments.length <= 0 ? undefined : arguments[0];
      return geometricBrownianMotion;
    };

    geometricBrownianMotion.sigma = function () {
      if (!arguments.length) {
        return sigma;
      }

      sigma = arguments.length <= 0 ? undefined : arguments[0];
      return geometricBrownianMotion;
    };

    geometricBrownianMotion.random = function () {
      if (!arguments.length) {
        return random;
      }

      random = arguments.length <= 0 ? undefined : arguments[0];
      return geometricBrownianMotion;
    };

    return geometricBrownianMotion;
  }

  function functor(v) {
    return typeof v === 'function' ? v : function () {
      return v;
    };
  }

  function financial () {
    var startDate = new Date();
    var startPrice = 100;
    var interval = d3Time.timeDay;
    var intervalStep = 1;
    var unitInterval = d3Time.timeYear;
    var unitIntervalStep = 1;
    var filter = null;

    var volume = function volume() {
      var normal = d3Random.randomNormal(1, 0.1);
      return Math.ceil(normal() * 1000);
    };

    var gbm = geometricBrownianMotion();

    var getOffsetPeriod = function getOffsetPeriod(date) {
      var unitMilliseconds = unitInterval.offset(date, unitIntervalStep) - date;
      return (interval.offset(date, intervalStep) - date) / unitMilliseconds;
    };

    var calculateOHLC = function calculateOHLC(start, price) {
      var period = getOffsetPeriod(start);
      var prices = gbm.period(period)(price);
      var ohlc = {
        date: start,
        open: prices[0],
        high: Math.max.apply(Math, prices),
        low: Math.min.apply(Math, prices),
        close: prices[gbm.steps()]
      };
      ohlc.volume = volume(ohlc);
      return ohlc;
    };

    var getNextDatum = function getNextDatum(ohlc) {
      var date, price, filtered;

      do {
        date = ohlc ? interval.offset(ohlc.date, intervalStep) : new Date(startDate.getTime());
        price = ohlc ? ohlc.close : startPrice;
        ohlc = calculateOHLC(date, price);
        filtered = filter && !filter(ohlc);
      } while (filtered);

      return ohlc;
    };

    var makeStream = function makeStream() {
      var latest;
      var stream = {};

      stream.next = function () {
        var ohlc = getNextDatum(latest);
        latest = ohlc;
        return ohlc;
      };

      stream.take = function (numPoints) {
        return stream.until(function (d, i) {
          return !numPoints || numPoints < 0 || i === numPoints;
        });
      };

      stream.until = function (comparison) {
        var data = [];
        var index = 0;
        var ohlc = getNextDatum(latest);
        var compared = comparison && !comparison(ohlc, index);

        while (compared) {
          data.push(ohlc);
          latest = ohlc;
          ohlc = getNextDatum(latest);
          index += 1;
          compared = comparison && !comparison(ohlc, index);
        }

        return data;
      };

      return stream;
    };

    var financial = function financial(numPoints) {
      return makeStream().take(numPoints);
    };

    financial.stream = makeStream;

    if (typeof Symbol !== 'function' || _typeof(Symbol.iterator) !== 'symbol') {
      throw new Error('d3fc-random-data depends on Symbol. Make sure that you load a polyfill in older browsers. See README.');
    }

    financial[Symbol.iterator] = function () {
      var stream = makeStream();
      return {
        next: function next() {
          return {
            value: stream.next(),
            done: false
          };
        }
      };
    };

    financial.startDate = function () {
      if (!arguments.length) {
        return startDate;
      }

      startDate = arguments.length <= 0 ? undefined : arguments[0];
      return financial;
    };

    financial.startPrice = function () {
      if (!arguments.length) {
        return startPrice;
      }

      startPrice = arguments.length <= 0 ? undefined : arguments[0];
      return financial;
    };

    financial.interval = function () {
      if (!arguments.length) {
        return interval;
      }

      interval = arguments.length <= 0 ? undefined : arguments[0];
      return financial;
    };

    financial.intervalStep = function () {
      if (!arguments.length) {
        return intervalStep;
      }

      intervalStep = arguments.length <= 0 ? undefined : arguments[0];
      return financial;
    };

    financial.unitInterval = function () {
      if (!arguments.length) {
        return unitInterval;
      }

      unitInterval = arguments.length <= 0 ? undefined : arguments[0];
      return financial;
    };

    financial.unitIntervalStep = function () {
      if (!arguments.length) {
        return unitIntervalStep;
      }

      unitIntervalStep = arguments.length <= 0 ? undefined : arguments[0];
      return financial;
    };

    financial.filter = function () {
      if (!arguments.length) {
        return filter;
      }

      filter = arguments.length <= 0 ? undefined : arguments[0];
      return financial;
    };

    financial.volume = function () {
      if (!arguments.length) {
        return volume;
      }

      volume = functor(arguments.length <= 0 ? undefined : arguments[0]);
      return financial;
    };

    d3fcRebind.rebindAll(financial, gbm);
    return financial;
  }

  function skipWeekends (datum) {
    var day = datum.date.getDay();
    return !(day === 0 || day === 6);
  }

  exports.randomFinancial = financial;
  exports.randomGeometricBrownianMotion = geometricBrownianMotion;
  exports.randomSkipWeekends = skipWeekends;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
