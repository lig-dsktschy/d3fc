(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.fc = global.fc || {}));
}(this, (function (exports) { 'use strict';

    // "Caution: avoid interpolating to or from the number zero when the interpolator is used to generate
    // a string (such as with attr).
    // Very small values, when stringified, may be converted to scientific notation and
    // cause a temporarily invalid attribute or style property value.
    // For example, the number 0.0000001 is converted to the string "1e-7".
    // This is particularly noticeable when interpolating opacity values.
    // To avoid scientific notation, start or end the transition at 1e-6,
    // which is the smallest value that is not stringified in exponential notation."
    // - https://github.com/mbostock/d3/wiki/Transitions#d3_interpolateNumber
    var effectivelyZero = 1e-6;
    var isTransition = function isTransition(selectionOrTransition) {
      return selectionOrTransition.selection() !== selectionOrTransition;
    }; // Wrapper around d3's selectAll/data data-join, which allows decoration of the result.
    // This is achieved by appending the element to the enter selection before exposing it.
    // A default transition of fade in/out is also implicitly added but can be modified.

    var dataJoin = (function (element, className) {
      element = element || 'g';

      var key = function key(_, i) {
        return i;
      };

      var explicitTransition = null;

      var dataJoin = function dataJoin(container, data) {
        data = data || function (d) {
          return d;
        };

        var selection = container.selection();
        var implicitTransition = isTransition(container) ? container : null;
        var selected = selection.selectChildren(className == null ? element : "".concat(element, ".").concat(className));
        var update = selected.data(data, key);
        var enter = update.enter().append(element).attr('class', className);
        var exit = update.exit(); // automatically merge in the enter selection

        update = update.merge(enter); // if transitions are enabled apply a default fade in/out transition

        var transition = implicitTransition || explicitTransition;

        if (transition) {
          update = update.transition(transition).style('opacity', 1);
          enter.style('opacity', effectivelyZero);
          exit = exit.transition(transition).style('opacity', effectivelyZero);
        }

        exit.remove();

        update.enter = function () {
          return enter;
        };

        update.exit = function () {
          return exit;
        };

        return update;
      };

      dataJoin.element = function () {
        if (!arguments.length) {
          return element;
        }

        element = arguments.length <= 0 ? undefined : arguments[0];
        return dataJoin;
      };

      dataJoin.className = function () {
        if (!arguments.length) {
          return className;
        }

        className = arguments.length <= 0 ? undefined : arguments[0];
        return dataJoin;
      };

      dataJoin.key = function () {
        if (!arguments.length) {
          return key;
        }

        key = arguments.length <= 0 ? undefined : arguments[0];
        return dataJoin;
      };

      dataJoin.transition = function () {
        if (!arguments.length) {
          return explicitTransition;
        }

        explicitTransition = arguments.length <= 0 ? undefined : arguments[0];
        return dataJoin;
      };

      return dataJoin;
    });

    exports.dataJoin = dataJoin;
    exports.effectivelyZero = effectivelyZero;
    exports.isTransition = isTransition;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
