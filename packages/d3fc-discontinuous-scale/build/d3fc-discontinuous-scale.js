(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3-scale'), require('@d3fc/d3fc-rebind'), require('d3-time')) :
    typeof define === 'function' && define.amd ? define(['exports', 'd3-scale', '@d3fc/d3fc-rebind', 'd3-time'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.fc = global.fc || {}, global.d3, global.fc, global.d3));
}(this, (function (exports, d3Scale, d3fcRebind, d3Time) { 'use strict';

    function identity () {
      var identity = {};

      identity.distance = function (start, end) {
        return end - start;
      };

      identity.offset = function (start, offset) {
        return start instanceof Date ? new Date(start.getTime() + offset) : start + offset;
      };

      identity.clampUp = function (d) {
        return d;
      };

      identity.clampDown = function (d) {
        return d;
      };

      identity.copy = function () {
        return identity;
      };

      return identity;
    }

    function tickFilter(ticks, discontinuityProvider) {
      var discontinuousTicks = ticks.map(discontinuityProvider.clampUp);

      if (discontinuousTicks.length !== new Set(discontinuousTicks.map(function (d) {
        return d === null || d === void 0 ? void 0 : d.valueOf();
      })).size) {
        console.warn('There are multiple ticks that fall within a discontinuity, which has led to them being rendered on top of each other. Consider using scale.ticks to explicitly specify the ticks for the scale.');
      }

      return discontinuousTicks;
    }

    function discontinuous(adaptedScale) {
      var _this = this;

      if (!arguments.length) {
        adaptedScale = d3Scale.scaleIdentity();
      }

      var discontinuityProvider = identity();

      var scale = function scale(value) {
        var domain = adaptedScale.domain();
        var range = adaptedScale.range(); // The discontinuityProvider is responsible for determine the distance between two points
        // along a scale that has discontinuities (i.e. sections that have been removed).
        // the scale for the given point 'x' is calculated as the ratio of the discontinuous distance
        // over the domain of this axis, versus the discontinuous distance to 'x'

        var totalDomainDistance = discontinuityProvider.distance(domain[0], domain[1]);
        var distanceToX = discontinuityProvider.distance(domain[0], value);
        var ratioToX = distanceToX / totalDomainDistance;
        var scaledByRange = ratioToX * (range[1] - range[0]) + range[0];
        return scaledByRange;
      };

      scale.invert = function (x) {
        var domain = adaptedScale.domain();
        var range = adaptedScale.range();
        var ratioToX = (x - range[0]) / (range[1] - range[0]);
        var totalDomainDistance = discontinuityProvider.distance(domain[0], domain[1]);
        var distanceToX = ratioToX * totalDomainDistance;
        return discontinuityProvider.offset(domain[0], distanceToX);
      };

      scale.domain = function () {
        if (!arguments.length) {
          return adaptedScale.domain();
        }

        var newDomain = arguments.length <= 0 ? undefined : arguments[0]; // clamp the upper and lower domain values to ensure they
        // do not fall within a discontinuity

        var domainLower = discontinuityProvider.clampUp(newDomain[0]);
        var domainUpper = discontinuityProvider.clampDown(newDomain[1]);
        adaptedScale.domain([domainLower, domainUpper]);
        return scale;
      };

      scale.nice = function () {
        adaptedScale.nice();
        var domain = adaptedScale.domain();
        var domainLower = discontinuityProvider.clampUp(domain[0]);
        var domainUpper = discontinuityProvider.clampDown(domain[1]);
        adaptedScale.domain([domainLower, domainUpper]);
        return scale;
      };

      scale.ticks = function () {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var ticks = adaptedScale.ticks.apply(_this, args);
        return tickFilter(ticks, discontinuityProvider);
      };

      scale.copy = function () {
        return discontinuous(adaptedScale.copy()).discontinuityProvider(discontinuityProvider.copy());
      };

      scale.discontinuityProvider = function () {
        if (!arguments.length) {
          return discontinuityProvider;
        }

        discontinuityProvider = arguments.length <= 0 ? undefined : arguments[0];
        return scale;
      };

      d3fcRebind.rebindAll(scale, adaptedScale, d3fcRebind.include('range', 'rangeRound', 'interpolate', 'clamp', 'tickFormat'));
      return scale;
    }

    var base = function base(dayAccessor, intervalDay, intervalSaturday, intervalMonday) {
      // the indices returned by dayAccessor(date)
      var day = {
        sunday: 0,
        monday: 1,
        saturday: 6
      };
      var millisPerDay = 24 * 3600 * 1000;
      var millisPerWorkWeek = millisPerDay * 5;
      var millisPerWeek = millisPerDay * 7;
      var skipWeekends = {};

      var isWeekend = function isWeekend(date) {
        return dayAccessor(date) === 0 || dayAccessor(date) === 6;
      };

      skipWeekends.clampDown = function (date) {
        if (date && isWeekend(date)) {
          // round the date up to midnight
          var newDate = intervalDay.ceil(date); // then subtract the required number of days

          if (dayAccessor(newDate) === day.sunday) {
            return intervalDay.offset(newDate, -1);
          } else if (dayAccessor(newDate) === day.monday) {
            return intervalDay.offset(newDate, -2);
          } else {
            return newDate;
          }
        } else {
          return date;
        }
      };

      skipWeekends.clampUp = function (date) {
        if (date && isWeekend(date)) {
          // round the date down to midnight
          var newDate = intervalDay.floor(date); // then add the required number of days

          if (dayAccessor(newDate) === day.saturday) {
            return intervalDay.offset(newDate, 2);
          } else if (dayAccessor(newDate) === day.sunday) {
            return intervalDay.offset(newDate, 1);
          } else {
            return newDate;
          }
        } else {
          return date;
        }
      }; // returns the number of included milliseconds (i.e. those which do not fall)
      // within discontinuities, along this scale


      skipWeekends.distance = function (startDate, endDate) {
        startDate = skipWeekends.clampUp(startDate);
        endDate = skipWeekends.clampDown(endDate); // move the start date to the end of week boundary

        var offsetStart = intervalSaturday.ceil(startDate);

        if (endDate < offsetStart) {
          return endDate.getTime() - startDate.getTime();
        }

        var msAdded = offsetStart.getTime() - startDate.getTime(); // move the end date to the end of week boundary

        var offsetEnd = intervalSaturday.ceil(endDate);
        var msRemoved = offsetEnd.getTime() - endDate.getTime(); // determine how many weeks there are between these two dates
        // round to account for DST transitions

        var weeks = Math.round((offsetEnd.getTime() - offsetStart.getTime()) / millisPerWeek);
        return weeks * millisPerWorkWeek + msAdded - msRemoved;
      };

      skipWeekends.offset = function (startDate, ms) {
        var date = isWeekend(startDate) ? skipWeekends.clampUp(startDate) : startDate;

        if (ms === 0) {
          return date;
        }

        var isNegativeOffset = ms < 0;
        var isPositiveOffset = ms > 0;
        var remainingms = ms; // move to the end of week boundary for a postive offset or to the start of a week for a negative offset

        var weekBoundary = isNegativeOffset ? intervalMonday.floor(date) : intervalSaturday.ceil(date);
        remainingms -= weekBoundary.getTime() - date.getTime(); // if the distance to the boundary is greater than the number of ms
        // simply add the ms to the current date

        if (isNegativeOffset && remainingms > 0 || isPositiveOffset && remainingms < 0) {
          return new Date(date.getTime() + ms);
        } // skip the weekend for a positive offset


        date = isNegativeOffset ? weekBoundary : intervalDay.offset(weekBoundary, 2); // add all of the complete weeks to the date

        var completeWeeks = Math.floor(remainingms / millisPerWorkWeek);
        date = intervalDay.offset(date, completeWeeks * 7);
        remainingms -= completeWeeks * millisPerWorkWeek; // add the remaining time

        date = new Date(date.getTime() + remainingms);
        return date;
      };

      skipWeekends.copy = function () {
        return skipWeekends;
      };

      return skipWeekends;
    };
    var skipWeekends = (function () {
      return base(function (date) {
        return date.getDay();
      }, d3Time.timeDay, d3Time.timeSaturday, d3Time.timeMonday);
    });

    var skipUtcWeekends = (function () {
      return base(function (date) {
        return date.getUTCDay();
      }, d3Time.utcDay, d3Time.utcSaturday, d3Time.utcMonday);
    });

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

    var provider = function provider() {
      for (var _len = arguments.length, ranges = new Array(_len), _key = 0; _key < _len; _key++) {
        ranges[_key] = arguments[_key];
      }

      var inRange = function inRange(number, range) {
        return number > range[0] && number < range[1];
      };

      var surroundsRange = function surroundsRange(inner, outer) {
        return inner[0] >= outer[0] && inner[1] <= outer[1];
      };

      var identity = {};

      identity.distance = function (start, end) {
        start = identity.clampUp(start);
        end = identity.clampDown(end);
        var surroundedRanges = ranges.filter(function (r) {
          return surroundsRange(r, [start, end]);
        });
        var rangeSizes = surroundedRanges.map(function (r) {
          return r[1] - r[0];
        });
        return end - start - rangeSizes.reduce(function (total, current) {
          return total + current;
        }, 0);
      };

      var add = function add(value, offset) {
        return value instanceof Date ? new Date(value.getTime() + offset) : value + offset;
      };

      identity.offset = function (location, offset) {
        if (offset > 0) {
          var _ret = function () {
            var currentLocation = identity.clampUp(location);
            var offsetRemaining = offset;

            while (offsetRemaining > 0) {
              var futureRanges = ranges.filter(function (r) {
                return r[0] > currentLocation;
              }).sort(function (a, b) {
                return a[0] - b[0];
              });

              if (futureRanges.length) {
                var nextRange = futureRanges[0];
                var delta = nextRange[0] - currentLocation;

                if (delta > offsetRemaining) {
                  currentLocation = add(currentLocation, offsetRemaining);
                  offsetRemaining = 0;
                } else {
                  currentLocation = nextRange[1];
                  offsetRemaining -= delta;
                }
              } else {
                currentLocation = add(currentLocation, offsetRemaining);
                offsetRemaining = 0;
              }
            }

            return {
              v: currentLocation
            };
          }();

          if (_typeof(_ret) === "object") return _ret.v;
        } else {
          var _ret2 = function () {
            var currentLocation = identity.clampDown(location);
            var offsetRemaining = offset;

            while (offsetRemaining < 0) {
              var futureRanges = ranges.filter(function (r) {
                return r[1] < currentLocation;
              }).sort(function (a, b) {
                return b[0] - a[0];
              });

              if (futureRanges.length) {
                var nextRange = futureRanges[0];
                var delta = nextRange[1] - currentLocation;

                if (delta < offsetRemaining) {
                  currentLocation = add(currentLocation, offsetRemaining);
                  offsetRemaining = 0;
                } else {
                  currentLocation = nextRange[0];
                  offsetRemaining -= delta;
                }
              } else {
                currentLocation = add(currentLocation, offsetRemaining);
                offsetRemaining = 0;
              }
            }

            return {
              v: currentLocation
            };
          }();

          if (_typeof(_ret2) === "object") return _ret2.v;
        }
      };

      identity.clampUp = function (d) {
        return ranges.reduce(function (value, range) {
          return inRange(value, range) ? range[1] : value;
        }, d);
      };

      identity.clampDown = function (d) {
        return ranges.reduce(function (value, range) {
          return inRange(value, range) ? range[0] : value;
        }, d);
      };

      identity.copy = function () {
        return identity;
      };

      return identity;
    };

    exports.discontinuityIdentity = identity;
    exports.discontinuityRange = provider;
    exports.discontinuitySkipUtcWeekends = skipUtcWeekends;
    exports.discontinuitySkipWeekends = skipWeekends;
    exports.scaleDiscontinuous = discontinuous;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
