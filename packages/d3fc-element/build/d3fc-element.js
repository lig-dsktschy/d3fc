(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
}((function () { 'use strict';

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

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Date.prototype.toString.call(Reflect.construct(Date, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _construct(Parent, args, Class) {
    if (_isNativeReflectConstruct()) {
      _construct = Reflect.construct;
    } else {
      _construct = function _construct(Parent, args, Class) {
        var a = [null];
        a.push.apply(a, args);
        var Constructor = Function.bind.apply(Parent, a);
        var instance = new Constructor();
        if (Class) _setPrototypeOf(instance, Class.prototype);
        return instance;
      };
    }

    return _construct.apply(null, arguments);
  }

  function _isNativeFunction(fn) {
    return Function.toString.call(fn).indexOf("[native code]") !== -1;
  }

  function _wrapNativeSuper(Class) {
    var _cache = typeof Map === "function" ? new Map() : undefined;

    _wrapNativeSuper = function _wrapNativeSuper(Class) {
      if (Class === null || !_isNativeFunction(Class)) return Class;

      if (typeof Class !== "function") {
        throw new TypeError("Super expression must either be null or a function");
      }

      if (typeof _cache !== "undefined") {
        if (_cache.has(Class)) return _cache.get(Class);

        _cache.set(Class, Wrapper);
      }

      function Wrapper() {
        return _construct(Class, arguments, _getPrototypeOf(this).constructor);
      }

      Wrapper.prototype = Object.create(Class.prototype, {
        constructor: {
          value: Wrapper,
          enumerable: false,
          writable: true,
          configurable: true
        }
      });
      return _setPrototypeOf(Wrapper, Class);
    };

    return _wrapNativeSuper(Class);
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();

    return function _createSuperInternal() {
      var Super = _getPrototypeOf(Derived),
          result;

      if (hasNativeReflectConstruct) {
        var NewTarget = _getPrototypeOf(this).constructor;

        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }

      return _possibleConstructorReturn(this, result);
    };
  }

  function _toArray(arr) {
    return _arrayWithHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableRest();
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

  var key = '__d3fc-elements__';
  var get = function get(element) {
    return element[key] || {};
  };
  var set = function set(element, data) {
    return void (element[key] = data);
  };
  var clear = function clear(element) {
    return delete element[key];
  };

  var find = function find(element) {
    return element.tagName === 'D3FC-GROUP' ? [element].concat(_toConsumableArray(element.querySelectorAll('d3fc-canvas, d3fc-group, d3fc-svg'))) : [element];
  };

  var measure = function measure(element) {
    var _data$get = get(element),
        previousWidth = _data$get.width,
        previousHeight = _data$get.height;

    var pixelRatio = element.useDevicePixelRatio && window.devicePixelRatio != null ? window.devicePixelRatio : 1;
    var width = element.clientWidth * pixelRatio;
    var height = element.clientHeight * pixelRatio;
    var resized = width !== previousWidth || height !== previousHeight;
    var child = element.children[0];
    set(element, {
      pixelRatio: pixelRatio,
      width: width,
      height: height,
      resized: resized,
      child: child
    });
  };

  if (typeof CustomEvent !== 'function') {
    throw new Error('d3fc-element depends on CustomEvent. Make sure that you load a polyfill in older browsers. See README.');
  }

  var resize = function resize(element) {
    var detail = get(element);
    var event = new CustomEvent('measure', {
      detail: detail
    });
    element.dispatchEvent(event);
  };

  var draw = function draw(element) {
    var detail = get(element);
    var event = new CustomEvent('draw', {
      detail: detail
    });
    element.dispatchEvent(event);
  };

  var redraw = (function (elements) {
    var allElements = elements.map(find).reduce(function (a, b) {
      return a.concat(b);
    });
    allElements.forEach(measure);
    allElements.forEach(resize);
    allElements.forEach(draw);
  });

  var getQueue = function getQueue(element) {
    return get(element.ownerDocument).queue || [];
  };

  var setQueue = function setQueue(element, queue) {
    var _data$get = get(element.ownerDocument),
        requestId = _data$get.requestId;

    if (requestId == null) {
      requestId = requestAnimationFrame(function () {
        // This seems like a weak way of retrieving the queue
        // but I can't see an edge case at the minute...
        var queue = getQueue(element);
        redraw(queue);
        clearQueue(element);
      });
    }

    set(element.ownerDocument, {
      queue: queue,
      requestId: requestId
    });
  };

  var clearQueue = function clearQueue(element) {
    return clear(element.ownerDocument);
  };

  var isDescendentOf = function isDescendentOf(element, ancestor) {
    var node = element;

    do {
      if (node.parentNode === ancestor) {
        return true;
      } // eslint-disable-next-line no-cond-assign

    } while (node = node.parentNode);

    return false;
  };

  var _requestRedraw = (function (element) {
    var queue = getQueue(element);
    var queueContainsElement = queue.indexOf(element) > -1;

    if (queueContainsElement) {
      return;
    }

    var queueContainsAncestor = queue.some(function (queuedElement) {
      return isDescendentOf(element, queuedElement);
    });

    if (queueContainsAncestor) {
      return;
    }

    var queueExcludingDescendents = queue.filter(function (queuedElement) {
      return !isDescendentOf(queuedElement, element);
    });
    queueExcludingDescendents.push(element);
    setQueue(element, queueExcludingDescendents);
  });

  if (typeof HTMLElement !== 'function') {
    throw new Error('d3fc-element depends on Custom Elements (v1). Make sure that you load a polyfill in older browsers. See README.');
  }

  var addMeasureListener = function addMeasureListener(element) {
    if (element.__measureListener__ != null) {
      return;
    }

    element.__measureListener__ = function (event) {
      return element.setMeasurements(event.detail);
    };

    element.addEventListener('measure', element.__measureListener__);
  };

  var removeMeasureListener = function removeMeasureListener(element) {
    if (element.__measureListener__ == null) {
      return;
    }

    element.removeEventListener('measure', element.__measureListener__);
    element.__measureListener__ = null;
  };

  var element = (function (createNode, applyMeasurements) {
    return /*#__PURE__*/function (_HTMLElement) {
      _inherits(_class, _HTMLElement);

      var _super = _createSuper(_class);

      function _class() {
        _classCallCheck(this, _class);

        return _super.apply(this, arguments);
      }

      _createClass(_class, [{
        key: "attributeChangedCallback",
        value: function attributeChangedCallback(name) {
          switch (name) {
            case 'use-device-pixel-ratio':
              this.requestRedraw();
              break;
          }
        }
      }, {
        key: "connectedCallback",
        value: function connectedCallback() {
          if (this.childNodes.length === 0) {
            this.appendChild(createNode());
          }

          addMeasureListener(this);
        }
      }, {
        key: "disconnectedCallback",
        value: function disconnectedCallback() {
          removeMeasureListener(this);
        }
      }, {
        key: "setMeasurements",
        value: function setMeasurements(_ref) {
          var width = _ref.width,
              height = _ref.height;

          var _this$childNodes = _toArray(this.childNodes),
              node = _this$childNodes[0],
              other = _this$childNodes.slice(1);

          if (other.length > 0) {
            throw new Error('A d3fc-svg/canvas element must only contain a single svg/canvas element.');
          }

          applyMeasurements(this, node, {
            width: width,
            height: height
          });
        }
      }, {
        key: "requestRedraw",
        value: function requestRedraw() {
          _requestRedraw(this);
        }
      }, {
        key: "useDevicePixelRatio",
        get: function get() {
          return this.hasAttribute('use-device-pixel-ratio') && this.getAttribute('use-device-pixel-ratio') !== 'false';
        },
        set: function set(useDevicePixelRatio) {
          if (useDevicePixelRatio && !this.useDevicePixelRatio) {
            this.setAttribute('use-device-pixel-ratio', '');
          } else if (!useDevicePixelRatio && this.useDevicePixelRatio) {
            this.removeAttribute('use-device-pixel-ratio');
          }

          this.requestRedraw();
        }
      }], [{
        key: "observedAttributes",
        get: function get() {
          return ['use-device-pixel-ratio'];
        }
      }]);

      return _class;
    }( /*#__PURE__*/_wrapNativeSuper(HTMLElement));
  });

  var _default = /*#__PURE__*/function (_element) {
    _inherits(_default, _element);

    var _super = _createSuper(_default);

    function _default() {
      _classCallCheck(this, _default);

      return _super.apply(this, arguments);
    }

    _createClass(_default, [{
      key: "setWebglViewport",
      get: function get() {
        return this.hasAttribute('set-webgl-viewport') && this.getAttribute('set-webgl-viewport') !== 'false';
      },
      set: function set(setWebglViewport) {
        if (setWebglViewport && !this.setWebglViewport) {
          this.setAttribute('set-webgl-viewport', '');
        } else if (!setWebglViewport && this.setWebglViewport) {
          this.removeAttribute('set-webgl-viewport');
        }

        this.requestRedraw();
      }
    }]);

    return _default;
  }(element(function () {
    return document.createElement('canvas');
  }, function (element, node, _ref) {
    var width = _ref.width,
        height = _ref.height;
    node.setAttribute('width', width);
    node.setAttribute('height', height);

    if (element.setWebglViewport) {
      var context = node.getContext('webgl', {
        preserveDrawingBuffer: true
      });
      context.viewport(0, 0, width, height);
    }
  }));

  var updateAutoResize = function updateAutoResize(element) {
    if (element.autoResize) {
      addAutoResizeListener(element);
    } else {
      removeAutoResizeListener(element);
    }
  };

  var addAutoResizeListener = function addAutoResizeListener(element) {
    if (element.__autoResizeListener__ != null) {
      return;
    }

    element.__autoResizeListener__ = function () {
      return _requestRedraw(element);
    };

    addEventListener('resize', element.__autoResizeListener__);
  };

  var removeAutoResizeListener = function removeAutoResizeListener(element) {
    if (element.__autoResizeListener__ == null) {
      return;
    }

    removeEventListener('resize', element.__autoResizeListener__);
    element.__autoResizeListener__ = null;
  };

  var _default$1 = /*#__PURE__*/function (_HTMLElement) {
    _inherits(_default, _HTMLElement);

    var _super = _createSuper(_default);

    function _default() {
      _classCallCheck(this, _default);

      return _super.apply(this, arguments);
    }

    _createClass(_default, [{
      key: "connectedCallback",
      value: function connectedCallback() {
        updateAutoResize(this);
      }
    }, {
      key: "disconnectedCallback",
      value: function disconnectedCallback() {
        removeAutoResizeListener(this);
      }
    }, {
      key: "requestRedraw",
      value: function requestRedraw() {
        _requestRedraw(this);
      }
    }, {
      key: "attributeChangedCallback",
      value: function attributeChangedCallback(name) {
        switch (name) {
          case 'auto-resize':
            updateAutoResize(this);
            break;
        }
      }
    }, {
      key: "autoResize",
      get: function get() {
        return this.hasAttribute('auto-resize') && this.getAttribute('auto-resize') !== 'false';
      },
      set: function set(autoResize) {
        if (autoResize && !this.autoResize) {
          this.setAttribute('auto-resize', '');
        } else if (!autoResize && this.autoResize) {
          this.removeAttribute('auto-resize');
        }

        updateAutoResize(this);
      }
    }], [{
      key: "observedAttributes",
      get: function get() {
        return ['auto-resize'];
      }
    }]);

    return _default;
  }( /*#__PURE__*/_wrapNativeSuper(HTMLElement));

  var Svg = element(function () {
    return document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  }, function (element, node, _ref) {
    var width = _ref.width,
        height = _ref.height;
    node.setAttribute('viewBox', "0 0 ".concat(width, " ").concat(height));
  });

  // Adapted from https://github.com/substack/insert-css
  var css = "d3fc-canvas,d3fc-svg{position:relative;display:block}d3fc-canvas>canvas,d3fc-svg>svg{position:absolute;height:100%;width:100%}d3fc-svg>svg{overflow:visible}";
  var styleElement = document.createElement('style');
  styleElement.setAttribute('type', 'text/css');
  document.querySelector('head').appendChild(styleElement);

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText += css;
  } else {
    styleElement.textContent += css;
  }

  if ((typeof customElements === "undefined" ? "undefined" : _typeof(customElements)) !== 'object' || typeof customElements.define !== 'function') {
    throw new Error('d3fc-element depends on Custom Elements (v1). Make sure that you load a polyfill in older browsers. See README.');
  }

  customElements.define('d3fc-canvas', _default);
  customElements.define('d3fc-group', _default$1);
  customElements.define('d3fc-svg', Svg);

})));
