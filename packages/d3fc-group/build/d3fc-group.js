(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.fc = global.fc || {}));
}(this, (function (exports) { 'use strict';

    var group = (function () {
      var key = '';
      var orient = 'vertical'; // D3 CSV returns all values as strings, this converts them to numbers
      // by default.

      var value = function value(row, column) {
        return Number(row[column]);
      };

      var verticalgroup = function verticalgroup(data) {
        return Object.keys(data[0]).filter(function (k) {
          return k !== key;
        }).map(function (k) {
          var values = data.filter(function (row) {
            return row[k];
          }).map(function (row) {
            var cell = [row[key], value(row, k)];
            cell.data = row;
            return cell;
          });
          values.key = k;
          return values;
        });
      };

      var horizontalgroup = function horizontalgroup(data) {
        return data.map(function (row) {
          var values = Object.keys(row).filter(function (d) {
            return d !== key;
          }).map(function (k) {
            var cell = [k, value(row, k)];
            cell.data = row;
            return cell;
          });
          values.key = row[key];
          return values;
        });
      };

      var group = function group(data) {
        return orient === 'vertical' ? verticalgroup(data) : horizontalgroup(data);
      };

      group.key = function () {
        if (!arguments.length) {
          return key;
        }

        key = arguments.length <= 0 ? undefined : arguments[0];
        return group;
      };

      group.value = function () {
        if (!arguments.length) {
          return value;
        }

        value = arguments.length <= 0 ? undefined : arguments[0];
        return group;
      };

      group.orient = function () {
        if (!arguments.length) {
          return orient;
        }

        orient = arguments.length <= 0 ? undefined : arguments[0];
        return group;
      };

      return group;
    });

    exports.group = group;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
