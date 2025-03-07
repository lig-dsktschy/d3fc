(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('d3-dispatch'), require('d3-selection'), require('@d3fc/d3fc-rebind')) :
    typeof define === 'function' && define.amd ? define(['exports', 'd3-dispatch', 'd3-selection', '@d3fc/d3fc-rebind'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.fc = global.fc || {}, global.d3, global.d3, global.fc));
}(this, (function (exports, d3Dispatch, d3Selection, d3fcRebind) { 'use strict';

    var pointer = (function () {
      var pointEvent = d3Dispatch.dispatch('point');

      function mousemove(event) {
        var point = d3Selection.pointer(event);
        pointEvent.call('point', this, [{
          x: point[0],
          y: point[1]
        }]);
      }

      function mouseleave() {
        void pointEvent.call('point', this, []);
      }

      var instance = function instance(selection) {
        selection.on('mouseenter.pointer', mousemove).on('mousemove.pointer', mousemove).on('mouseleave.pointer', mouseleave);
      };

      d3fcRebind.rebind(instance, pointEvent, 'on');
      return instance;
    });

    exports.pointer = pointer;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
