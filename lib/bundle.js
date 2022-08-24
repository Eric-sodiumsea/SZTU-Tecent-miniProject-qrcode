'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var html2canvas = require('html2canvas');
var QRCode = require('qrcode.react');
var tiny = require('@mxsir/image-tiny');
var pako = require('pako');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var html2canvas__default = /*#__PURE__*/_interopDefaultLegacy(html2canvas);
var QRCode__default = /*#__PURE__*/_interopDefaultLegacy(QRCode);
var tiny__default = /*#__PURE__*/_interopDefaultLegacy(tiny);

function _regeneratorRuntime() {
  /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */

  _regeneratorRuntime = function () {
    return exports;
  };

  var exports = {},
      Op = Object.prototype,
      hasOwn = Op.hasOwnProperty,
      $Symbol = "function" == typeof Symbol ? Symbol : {},
      iteratorSymbol = $Symbol.iterator || "@@iterator",
      asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator",
      toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    return Object.defineProperty(obj, key, {
      value: value,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }), obj[key];
  }

  try {
    define({}, "");
  } catch (err) {
    define = function (obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator,
        generator = Object.create(protoGenerator.prototype),
        context = new Context(tryLocsList || []);
    return generator._invoke = function (innerFn, self, context) {
      var state = "suspendedStart";
      return function (method, arg) {
        if ("executing" === state) throw new Error("Generator is already running");

        if ("completed" === state) {
          if ("throw" === method) throw arg;
          return doneResult();
        }

        for (context.method = method, context.arg = arg;;) {
          var delegate = context.delegate;

          if (delegate) {
            var delegateResult = maybeInvokeDelegate(delegate, context);

            if (delegateResult) {
              if (delegateResult === ContinueSentinel) continue;
              return delegateResult;
            }
          }

          if ("next" === context.method) context.sent = context._sent = context.arg;else if ("throw" === context.method) {
            if ("suspendedStart" === state) throw state = "completed", context.arg;
            context.dispatchException(context.arg);
          } else "return" === context.method && context.abrupt("return", context.arg);
          state = "executing";
          var record = tryCatch(innerFn, self, context);

          if ("normal" === record.type) {
            if (state = context.done ? "completed" : "suspendedYield", record.arg === ContinueSentinel) continue;
            return {
              value: record.arg,
              done: context.done
            };
          }

          "throw" === record.type && (state = "completed", context.method = "throw", context.arg = record.arg);
        }
      };
    }(innerFn, self, context), generator;
  }

  function tryCatch(fn, obj, arg) {
    try {
      return {
        type: "normal",
        arg: fn.call(obj, arg)
      };
    } catch (err) {
      return {
        type: "throw",
        arg: err
      };
    }
  }

  exports.wrap = wrap;
  var ContinueSentinel = {};

  function Generator() {}

  function GeneratorFunction() {}

  function GeneratorFunctionPrototype() {}

  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });
  var getProto = Object.getPrototypeOf,
      NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  NativeIteratorPrototype && NativeIteratorPrototype !== Op && hasOwn.call(NativeIteratorPrototype, iteratorSymbol) && (IteratorPrototype = NativeIteratorPrototype);
  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(IteratorPrototype);

  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function (method) {
      define(prototype, method, function (arg) {
        return this._invoke(method, arg);
      });
    });
  }

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);

      if ("throw" !== record.type) {
        var result = record.arg,
            value = result.value;
        return value && "object" == typeof value && hasOwn.call(value, "__await") ? PromiseImpl.resolve(value.__await).then(function (value) {
          invoke("next", value, resolve, reject);
        }, function (err) {
          invoke("throw", err, resolve, reject);
        }) : PromiseImpl.resolve(value).then(function (unwrapped) {
          result.value = unwrapped, resolve(result);
        }, function (error) {
          return invoke("throw", error, resolve, reject);
        });
      }

      reject(record.arg);
    }

    var previousPromise;

    this._invoke = function (method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function (resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise = previousPromise ? previousPromise.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
    };
  }

  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];

    if (undefined === method) {
      if (context.delegate = null, "throw" === context.method) {
        if (delegate.iterator.return && (context.method = "return", context.arg = undefined, maybeInvokeDelegate(delegate, context), "throw" === context.method)) return ContinueSentinel;
        context.method = "throw", context.arg = new TypeError("The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);
    if ("throw" === record.type) return context.method = "throw", context.arg = record.arg, context.delegate = null, ContinueSentinel;
    var info = record.arg;
    return info ? info.done ? (context[delegate.resultName] = info.value, context.next = delegate.nextLoc, "return" !== context.method && (context.method = "next", context.arg = undefined), context.delegate = null, ContinueSentinel) : info : (context.method = "throw", context.arg = new TypeError("iterator result is not an object"), context.delegate = null, ContinueSentinel);
  }

  function pushTryEntry(locs) {
    var entry = {
      tryLoc: locs[0]
    };
    1 in locs && (entry.catchLoc = locs[1]), 2 in locs && (entry.finallyLoc = locs[2], entry.afterLoc = locs[3]), this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal", delete record.arg, entry.completion = record;
  }

  function Context(tryLocsList) {
    this.tryEntries = [{
      tryLoc: "root"
    }], tryLocsList.forEach(pushTryEntry, this), this.reset(!0);
  }

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) return iteratorMethod.call(iterable);
      if ("function" == typeof iterable.next) return iterable;

      if (!isNaN(iterable.length)) {
        var i = -1,
            next = function next() {
          for (; ++i < iterable.length;) if (hasOwn.call(iterable, i)) return next.value = iterable[i], next.done = !1, next;

          return next.value = undefined, next.done = !0, next;
        };

        return next.next = next;
      }
    }

    return {
      next: doneResult
    };
  }

  function doneResult() {
    return {
      value: undefined,
      done: !0
    };
  }

  return GeneratorFunction.prototype = GeneratorFunctionPrototype, define(Gp, "constructor", GeneratorFunctionPrototype), define(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, "GeneratorFunction"), exports.isGeneratorFunction = function (genFun) {
    var ctor = "function" == typeof genFun && genFun.constructor;
    return !!ctor && (ctor === GeneratorFunction || "GeneratorFunction" === (ctor.displayName || ctor.name));
  }, exports.mark = function (genFun) {
    return Object.setPrototypeOf ? Object.setPrototypeOf(genFun, GeneratorFunctionPrototype) : (genFun.__proto__ = GeneratorFunctionPrototype, define(genFun, toStringTagSymbol, "GeneratorFunction")), genFun.prototype = Object.create(Gp), genFun;
  }, exports.awrap = function (arg) {
    return {
      __await: arg
    };
  }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  }), exports.AsyncIterator = AsyncIterator, exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    void 0 === PromiseImpl && (PromiseImpl = Promise);
    var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);
    return exports.isGeneratorFunction(outerFn) ? iter : iter.next().then(function (result) {
      return result.done ? result.value : iter.next();
    });
  }, defineIteratorMethods(Gp), define(Gp, toStringTagSymbol, "Generator"), define(Gp, iteratorSymbol, function () {
    return this;
  }), define(Gp, "toString", function () {
    return "[object Generator]";
  }), exports.keys = function (object) {
    var keys = [];

    for (var key in object) keys.push(key);

    return keys.reverse(), function next() {
      for (; keys.length;) {
        var key = keys.pop();
        if (key in object) return next.value = key, next.done = !1, next;
      }

      return next.done = !0, next;
    };
  }, exports.values = values, Context.prototype = {
    constructor: Context,
    reset: function (skipTempReset) {
      if (this.prev = 0, this.next = 0, this.sent = this._sent = undefined, this.done = !1, this.delegate = null, this.method = "next", this.arg = undefined, this.tryEntries.forEach(resetTryEntry), !skipTempReset) for (var name in this) "t" === name.charAt(0) && hasOwn.call(this, name) && !isNaN(+name.slice(1)) && (this[name] = undefined);
    },
    stop: function () {
      this.done = !0;
      var rootRecord = this.tryEntries[0].completion;
      if ("throw" === rootRecord.type) throw rootRecord.arg;
      return this.rval;
    },
    dispatchException: function (exception) {
      if (this.done) throw exception;
      var context = this;

      function handle(loc, caught) {
        return record.type = "throw", record.arg = exception, context.next = loc, caught && (context.method = "next", context.arg = undefined), !!caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i],
            record = entry.completion;
        if ("root" === entry.tryLoc) return handle("end");

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc"),
              hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) return handle(entry.catchLoc, !0);
          } else {
            if (!hasFinally) throw new Error("try statement without catch or finally");
            if (this.prev < entry.finallyLoc) return handle(entry.finallyLoc);
          }
        }
      }
    },
    abrupt: function (type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];

        if (entry.tryLoc <= this.prev && hasOwn.call(entry, "finallyLoc") && this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      finallyEntry && ("break" === type || "continue" === type) && finallyEntry.tryLoc <= arg && arg <= finallyEntry.finallyLoc && (finallyEntry = null);
      var record = finallyEntry ? finallyEntry.completion : {};
      return record.type = type, record.arg = arg, finallyEntry ? (this.method = "next", this.next = finallyEntry.finallyLoc, ContinueSentinel) : this.complete(record);
    },
    complete: function (record, afterLoc) {
      if ("throw" === record.type) throw record.arg;
      return "break" === record.type || "continue" === record.type ? this.next = record.arg : "return" === record.type ? (this.rval = this.arg = record.arg, this.method = "return", this.next = "end") : "normal" === record.type && afterLoc && (this.next = afterLoc), ContinueSentinel;
    },
    finish: function (finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) return this.complete(entry.completion, entry.afterLoc), resetTryEntry(entry), ContinueSentinel;
      }
    },
    catch: function (tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];

        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;

          if ("throw" === record.type) {
            var thrown = record.arg;
            resetTryEntry(entry);
          }

          return thrown;
        }
      }

      throw new Error("illegal catch attempt");
    },
    delegateYield: function (iterable, resultName, nextLoc) {
      return this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      }, "next" === this.method && (this.arg = undefined), ContinueSentinel;
    }
  }, exports;
}

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

  if (_i == null) return;
  var _arr = [];
  var _n = true;
  var _d = false;

  var _s, _e;

  try {
    for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
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

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function styleInject(css, ref) {
  if (ref === void 0) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') {
    return;
  }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = "/* 网页固钉 -- 截图选项 */\r\n.shot-box {\r\n    z-index: 10;\r\n    position: fixed;\r\n    right: 30px;\r\n    top: 30px;\r\n    width: 30px;\r\n    height: 30px;\r\n    background-color: rgba(211, 97, 97, 0.1);\r\n    font-size: 18px;\r\n    border: 1px none rgb(203, 193, 193);\r\n    border-radius: 10px;\r\n    text-align: center;\r\n    line-height: 30px;\r\n}\r\n\r\n.shot-options-box {\r\n    z-index: 10;\r\n    position: fixed;\r\n    right: 60px;\r\n    top: 30px;\r\n    width: 120px;\r\n    background-color: rgb(252, 234, 234);\r\n    font-size: 18px;\r\n    border: 1px none rgb(203, 193, 193);\r\n    border-radius: 10px;\r\n    line-height: 30px;\r\n    display: none;\r\n    margin: 0;\r\n    padding: 0;\r\n}\r\n\r\n.shot-option-box {\r\n    width: 100%;\r\n    margin: 0;\r\n    padding: 0;\r\n}\r\n\r\n.shot-option {\r\n    list-style: none;\r\n    margin: 5px 0;\r\n    padding: 0;\r\n    width: 100%;\r\n    text-align: center;\r\n}\r\n\r\n/* 展示二维码的弹窗 */\r\n#popup-box {\r\n    position: fixed;\r\n    z-index: 10;\r\n    left: 50%;\r\n    top: 50%;\r\n    transform: translate(-50%, -50%);\r\n    width: 1400px;\r\n    height: 650px;\r\n    background-color: white;\r\n    border: 3px solid #000;\r\n    border-radius: 10px;\r\n    display: none;\r\n}\r\n\r\n/* 关闭弹窗 */\r\n.popup-box-close {\r\n    position: absolute;\r\n    right: 3px;\r\n    top: 3px;\r\n    width: 20px;\r\n    height: 20px;\r\n    background-color: rgb(134, 196, 235);\r\n    border-radius: 5px;\r\n}\r\n\r\n.popup-box-close::before,\r\n.popup-box-close::after {\r\n    position: absolute;\r\n    content: ' ';\r\n    background-color: #000;\r\n    left: 50%;\r\n    width: 2px;\r\n    height: 100%;\r\n}\r\n\r\n.popup-box-close::before {\r\n    transform: rotate(45deg);\r\n}\r\n\r\n.popup-box-close::after {\r\n    transform: rotate(-45deg);\r\n}\r\n\r\n/* 图片预览区域 */\r\n.popup-box-left {\r\n    position: fixed;\r\n    left: 20px;\r\n    top: 50%;\r\n    transform: translate(0, -50%);\r\n    width: 400px;\r\n    height: 600px;\r\n}\r\n\r\n/* 图片展示区域 */\r\n.img-box {\r\n    position: fixed;\r\n    left: 0%;\r\n    top: 0%;\r\n    transform: translate(-0%, -0%);\r\n    width: 100%;\r\n    height: 100%;\r\n    overflow: auto\r\n        /* background-color: pink; */\r\n}\r\n\r\n#img-preview {\r\n    width: 99%;\r\n    border: 2px solid rgb(120, 237, 239);\r\n}\r\n\r\n/* 有关二维码的区域 */\r\n.popup-box-right {\r\n    position: fixed;\r\n    right: 20px;\r\n    top: 50%;\r\n    transform: translate(0, -50%);\r\n    width: 930px;\r\n    height: 600px;\r\n}\r\n\r\n/* 二维码展示区域 */\r\n#qrcode-box {\r\n    width: 600px;\r\n    height: 100%;\r\n}\r\n\r\n/* 二维码信息区域 */\r\n.qrcode-msg-box {\r\n    position: fixed;\r\n    right: 0%;\r\n    top: 50%;\r\n    transform: translate(0%, -50%);\r\n    width: 300px;\r\n    height: 100%;\r\n}\r\n\r\n/* 二维码进度区域 */\r\n.qrcode-progress {\r\n    text-align: center;\r\n    height: 50px;\r\n    line-height: 50px;\r\n    font-size: 30px;\r\n    font-weight: 500;\r\n    margin-bottom: 20px;\r\n}\r\n\r\n/* 跳转二维码的 input 框 */\r\n.goto-input {\r\n    height: 20px;\r\n    font-size: 24px;\r\n    padding: 7px 0px;\r\n    border-radius: 3px;\r\n    padding-left: 5px;\r\n    -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);\r\n    box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);\r\n    -webkit-transition: border-color ease-in-out .15s,\r\n        -webkit-box-shadow ease-in-out .15s;\r\n    -o-transition: border-color ease-in-out .15s,\r\n        box-shadow ease-in-out .15s;\r\n    transition: border-color ease-in-out .15s,\r\n        box-shadow ease-in-out .15s;\r\n}\r\n\r\n.goto-input:focus {\r\n    border-color: #66afe9;\r\n    outline: 0;\r\n    -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px rgba(102, 175, 233, .6);\r\n    box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075), 0 0 8px rgba(102, 175, 233, .6)\r\n}\r\n\r\n/* 跳转二维码的按钮 */\r\n.goto-btn {\r\n    font-size: 24px;\r\n    border-radius: 5px;\r\n    padding: 10px 25px;\r\n    font-family: \"Lato\",\r\n        sans-serif;\r\n    font-weight: 500;\r\n    cursor: pointer;\r\n    transition: all 0.3s ease;\r\n    position: relative;\r\n    display: inline-block;\r\n    box-shadow: inset 2px 2px 2px 0px rgba(255, 255, 255, 0.5),\r\n        7px 7px 20px 0px rgba(0, 0, 0, 0.1),\r\n        4px 4px 5px 0px rgba(0, 0, 0, 0.1);\r\n\r\n    width: 100%;\r\n    background-color: #4dccc6;\r\n    background-image: linear-gradient(315deg, #4dccc6 0%, #96e4df 74%);\r\n    line-height: 42px;\r\n    padding: 0;\r\n    border: none;\r\n    margin-bottom: 20px;\r\n}\r\n\r\n.goto-btn:hover {\r\n    background-color: #89d8d3;\r\n    background-image: linear-gradient(315deg, #89d8d3 0%, #03c8a8 74%);\r\n}\r\n\r\n.goto-btn span {\r\n    position: relative;\r\n    display: block;\r\n    width: 100%;\r\n    height: 100%;\r\n}\r\n\r\n.goto-btn:before,\r\n.goto-btn:after {\r\n    position: absolute;\r\n    content: \"\";\r\n    right: 0;\r\n    top: 0;\r\n    box-shadow: 4px 4px 6px 0 rgba(255, 255, 255, 0.9),\r\n        -4px -4px 6px 0 rgba(116, 125, 136, 0.2),\r\n        inset -4px -4px 6px 0 rgba(255, 255, 255, 0.9),\r\n        inset 4px 4px 6px 0 rgba(116, 125, 136, 0.3);\r\n    transition: all 0.3s ease;\r\n}\r\n\r\n.goto-btn:before {\r\n    height: 0%;\r\n    width: 0.1px;\r\n}\r\n\r\n.goto-btn:after {\r\n    width: 0%;\r\n    height: 0.1px;\r\n}\r\n\r\n.goto-btn:hover:before {\r\n    height: 100%;\r\n}\r\n\r\n.goto-btn:hover:after {\r\n    width: 100%;\r\n}\r\n\r\n.goto-btn span:before,\r\n.goto-btn span:after {\r\n    position: absolute;\r\n    content: \"\";\r\n    left: 0;\r\n    bottom: 0;\r\n    box-shadow: 4px 4px 6px 0 rgba(255, 255, 255, 0.9),\r\n        -4px -4px 6px 0 rgba(116, 125, 136, 0.2),\r\n        inset -4px -4px 6px 0 rgba(255, 255, 255, 0.9),\r\n        inset 4px 4px 6px 0 rgba(116, 125, 136, 0.3);\r\n    transition: all 0.3s ease;\r\n}\r\n\r\n.goto-btn span:before {\r\n    width: 0.1px;\r\n    height: 0%;\r\n}\r\n\r\n.goto-btn span:after {\r\n    width: 0%;\r\n    height: 0.1px;\r\n}\r\n\r\n.goto-btn span:hover:before {\r\n    height: 100%;\r\n}\r\n\r\n.goto-btn span:hover:after {\r\n    width: 100%;\r\n}\r\n\r\n\r\n/* 控制轮播展示二维码的按钮 */\r\n.carousel-btn {\r\n    font-size: 24px;\r\n    border-radius: 5px;\r\n    padding: 10px 25px;\r\n    font-family: \"Lato\",\r\n        sans-serif;\r\n    font-weight: 500;\r\n    cursor: pointer;\r\n    transition: all 0.3s ease;\r\n    position: relative;\r\n    display: inline-block;\r\n    box-shadow: inset 2px 2px 2px 0px rgba(255, 255, 255, 0.5),\r\n        7px 7px 20px 0px rgba(0, 0, 0, 0.1),\r\n        4px 4px 5px 0px rgba(0, 0, 0, 0.1);\r\n\r\n    width: 100%;\r\n    border: none;\r\n    color: #000;\r\n    background-color: #F7FED5;\r\n    margin-bottom: 20px;\r\n}\r\n\r\n.carousel-btn:after {\r\n    position: absolute;\r\n    content: \"\";\r\n    width: 0;\r\n    height: 100%;\r\n    top: 0;\r\n    left: 0;\r\n    direction: rtl;\r\n    z-index: -1;\r\n    box-shadow: -7px -7px 20px 0px #fff9, -4px -4px 5px 0px #fff9,\r\n        7px 7px 20px 0px #0002, 4px 4px 5px 0px #0001;\r\n    transition: all 0.3s ease;\r\n}\r\n\r\n.carousel-btn:hover {\r\n    color: #000;\r\n}\r\n\r\n.carousel-btn:hover:after {\r\n    left: auto;\r\n    right: 0;\r\n    width: 100%;\r\n}\r\n\r\n.carousel-btn:active {\r\n    top: 2px;\r\n}";
styleInject(css_248z);

/**
 * @author Levin
 * @param {Base64编码字符串} dataurl 
 * @param {文件对象命名} filename 
 * @returns 文件对象
 */

function dataURLtoFile(dataurl, filename) {
  // 获取到base64编码
  var arr = dataurl.split(','); // 将base64编码转为字符串
  // console.log(arr[1]);

  var bstr = atob(arr[1]);
  var n = bstr.length;
  var u8arr = new Uint8Array(n); // 创建初始化为0的，包含length个元素的无符号整型数组

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, {
    type: 'image/png'
  });
}
/**
 * 
 * @param {Base64编码字符串} base64 
 * @returns 
 */


function tinyCompress(_x) {
  return _tinyCompress.apply(this, arguments);
}
/**
 * @author Levin
 * @param {待压缩的字符串} str 
 * @returns 压缩后的字符串
 */


function _tinyCompress() {
  _tinyCompress = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(base64) {
    var old_file;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            // 将base64转换为文件对象
            old_file = dataURLtoFile(base64, "test_000" + ".png"); // console.log(old_file);
            // tiny插件压缩 

            _context3.next = 3;
            return tiny__default["default"](old_file, 1);

          case 3:
            return _context3.abrupt("return", _context3.sent);

          case 4:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _tinyCompress.apply(this, arguments);
}

function gzipStr(str) {
  return bin2Str(pako.gzip(str));
}
/**
 * @author Levin
 * @param {字节数组} array 
 * @returns 字符串
 */


function bin2Str(array) {
  return String.fromCharCode.apply(String, array);
}

function compress(_x2) {
  return _compress.apply(this, arguments);
}

function _compress() {
  _compress = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(base64) {
    var compress_pic_base64, res;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return compressPic(base64);

          case 2:
            compress_pic_base64 = _context4.sent;
            compress_pic_base64 = compress_pic_base64.split(',')[1]; // console.log('\n', compress_pic_base64)

            res = gzipStr(compress_pic_base64); // console.log('res\n', res);
            // console.log(resStr);

            return _context4.abrupt("return", res);

          case 6:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
  return _compress.apply(this, arguments);
}

function compressPic(_x3) {
  return _compressPic.apply(this, arguments);
}

function _compressPic() {
  _compressPic = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(base64) {
    var file, reader;
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return tinyCompress(base64);

          case 2:
            file = _context5.sent;
            reader = new FileReader();
            reader.readAsDataURL(file);
            return _context5.abrupt("return", new Promise(function (rs) {
              reader.onload = function () {
                // console.log('=======文件读取成功=======');
                rs(reader.result);
              };
            }));

          case 6:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));
  return _compressPic.apply(this, arguments);
}

function ShotBtn(props) {
  var _useState = React.useState('none'),
      _useState2 = _slicedToArray(_useState, 2),
      showShotOptions = _useState2[0],
      setShowShotOptions = _useState2[1];

  var _useState3 = React.useState('none'),
      _useState4 = _slicedToArray(_useState3, 2),
      showQrcode = _useState4[0],
      setShowQrcode = _useState4[1];

  var _useState5 = React.useState(''),
      _useState6 = _slicedToArray(_useState5, 2),
      imgBase64 = _useState6[0],
      setImgBase64 = _useState6[1];

  var _useState7 = React.useState([]),
      _useState8 = _slicedToArray(_useState7, 2),
      textArray = _useState8[0],
      setTextArray = _useState8[1];

  var _useState9 = React.useState(0),
      _useState10 = _slicedToArray(_useState9, 2),
      num = _useState10[0],
      setNum = _useState10[1];

  var _useState11 = React.useState(0),
      _useState12 = _slicedToArray(_useState11, 2),
      cur = _useState12[0],
      setCur = _useState12[1];

  var _useState13 = React.useState(true),
      _useState14 = _slicedToArray(_useState13, 2),
      carouselBegin = _useState14[0],
      setCarouselBegin = _useState14[1];

  var shotOptions = props.shotOptions,
      ratio = props.ratio,
      title = props.title;
  var carouselRef = React.useRef(null);
  var gotoRef = React.useRef(null);
  var popupBoxRef = React.useRef(null);
  var shotOptionsRef = React.useRef(null);

  function getCompress(_x4) {
    return _getCompress.apply(this, arguments);
  }
  /**
   * 截图、压缩、分割base64
   * @param {截图模块的Id} shotOptionId 
   */


  function _getCompress() {
    _getCompress = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(base64) {
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return compress(base64);

            case 2:
              return _context2.abrupt("return", _context2.sent);

            case 3:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));
    return _getCompress.apply(this, arguments);
  }

  function shotscreen(shotOptionId) {
    var element;

    if (shotOptionId === undefined) {
      element = document.body;
    } else {
      element = document.getElementById("".concat(shotOptionId));
    }
    /**
     * 截图
     * @param {截图模块的DOM元素} element 
     */


    html2canvas__default["default"](element, {
      width: element.scrollWidth,
      height: element.scrollHeight,
      windowHeight: element.scrollHeight,
      scale: ratio ? ratio : 0.8,
      useCORS: true,
      allowTaint: true
    }).then(function (canvas) {
      // 跳出弹窗
      popupBoxRef.current.style.display = 'block';
      /**
       * 执行异步函数
       */

      _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        var compressStr, length, temp_num, tempTextArray, i, temp_text, id;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                // 将截图图片的 base64 保存下来，用于预览图片
                setImgBase64(canvas.toDataURL());
                /**
                 * getCompress
                 * @param {base64} canvas.toDataURL()
                 * @return {压缩图片并通过gzip压缩后的字符串} compressStr
                 */

                _context.next = 3;
                return getCompress(canvas.toDataURL());

              case 3:
                compressStr = _context.sent;
                // 分割字符串，存入数组中，后续逐个放到二维码中
                length = 700;
                temp_num = parseInt(compressStr.length / length);

                if (compressStr.length % length !== 0) {
                  temp_num++;
                }

                setNum(temp_num); // console.log('总共展示图片：' + temp_num + ' 张');

                tempTextArray = [];

                for (i = 0; i < temp_num; i++) {
                  temp_text = "";

                  if (temp_num < 10) {
                    temp_text += "00" + temp_num + "-";
                  } else if (temp_num < 100) {
                    temp_text += "0" + temp_num + "-";
                  } else {
                    temp_text += temp_num + "-";
                  }

                  if (i + 1 < 10) {
                    temp_text += "00" + (i + 1);
                  } else if (i + 1 < 100) {
                    temp_text += "0" + (i + 1);
                  } else {
                    temp_text += i + 1;
                  }

                  if ((i + 1) * length > compressStr.length) {
                    temp_text += compressStr.slice(i * length);
                  } else {
                    temp_text += compressStr.slice(i * length, (i + 1) * length);
                  }

                  tempTextArray.push(temp_text);
                }

                setTextArray(tempTextArray); // 显示展示二维码区域

                setShowQrcode('block'); // 开始轮播展示二维码

                id = setInterval(function () {
                  setCur(function (cur) {
                    return cur + 1 === temp_num ? 0 : cur + 1;
                  });
                }, 100);
                carouselRef.current = id;

              case 14:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }))();
    });
  } // 关闭弹窗


  function closePopupBox() {
    popupBoxRef.current.style.display = 'none';
    setShowQrcode('none');
    setImgBase64('');
    setCur(0);
    setNum(0);
    carouselStop();
  } // 跳转二维码


  function _goto() {
    if (gotoRef.current.value !== '') {
      clearInterval(carouselRef.current);
      setCarouselBegin(false);

      if (gotoRef.current.value <= 0 || gotoRef.current.value > num) {
        alert('不存在这张二维码，请重新选择');
      } else {
        setCur(gotoRef.current.value - 1);
      }
    }
  } // 继续轮播二维码


  function carouselContinue() {
    if (carouselBegin === false) {
      setCarouselBegin(true);
      carouselRef.current = setInterval(function () {
        setCur(function (cur) {
          return cur + 1 === num ? 0 : cur + 1;
        });
      }, 100);
    }
  } // 停止轮播二维码


  function carouselStop() {
    clearInterval(carouselRef.current);
    setCarouselBegin(false);
  }

  return /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null, /*#__PURE__*/React__default["default"].createElement("div", {
    className: "shot-box",
    onClick: function onClick() {
      shotscreen();
    },
    onMouseOver: function onMouseOver() {
      setShowShotOptions('block');
    },
    onMouseLeave: function onMouseLeave() {
      setShowShotOptions('none');
    }
  }, title ? title : '截'), shotOptions === undefined ? /*#__PURE__*/React__default["default"].createElement(React__default["default"].Fragment, null) : /*#__PURE__*/React__default["default"].createElement("div", {
    className: "shot-options-box",
    onMouseOver: function onMouseOver() {
      setShowShotOptions('block');
    },
    onMouseLeave: function onMouseLeave() {
      setShowShotOptions('none');
    },
    ref: shotOptionsRef,
    style: {
      display: showShotOptions
    }
  }, /*#__PURE__*/React__default["default"].createElement("ul", {
    className: "shot-option-box"
  }, shotOptions.map(function (shotOption) {
    return /*#__PURE__*/React__default["default"].createElement("li", {
      key: shotOption.id,
      onClick: function onClick() {
        shotscreen(shotOption.id);
      },
      className: "shot-option"
    }, shotOption.title);
  }))), /*#__PURE__*/React__default["default"].createElement("div", {
    ref: popupBoxRef,
    id: "popup-box"
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    onClick: closePopupBox,
    className: "popup-box-close"
  }), /*#__PURE__*/React__default["default"].createElement("div", {
    className: "popup-box-left"
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    className: "img-box"
  }, /*#__PURE__*/React__default["default"].createElement("img", {
    id: "img-preview",
    src: imgBase64,
    alt: ""
  }))), /*#__PURE__*/React__default["default"].createElement("div", {
    className: "popup-box-right"
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    id: "qrcode-box"
  }, /*#__PURE__*/React__default["default"].createElement(QRCode__default["default"], {
    id: "qrCode",
    value: textArray[cur],
    size: 600 // 二维码的大小
    ,
    fgColor: "#000000" // 二维码的颜色
    ,
    style: {
      margin: 'auto',
      display: showQrcode
    }
  })), /*#__PURE__*/React__default["default"].createElement("div", {
    className: "qrcode-msg-box"
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    className: "qrcode-progress"
  }, num === 0 ? "请稍候..." : "".concat(cur + 1, " / ").concat(num)), /*#__PURE__*/React__default["default"].createElement("input", {
    ref: gotoRef,
    onKeyDown: function onKeyDown(e) {
      if (e.key === 'Enter') _goto();
    },
    className: "goto-input",
    placeholder: "\u8F93\u5165\u8DF3\u8F6C\u81F3\u7B2C\u51E0\u5F20\u4E8C\u7EF4\u7801",
    type: "text"
  }), /*#__PURE__*/React__default["default"].createElement("button", {
    onClick: _goto,
    className: "goto-btn"
  }, /*#__PURE__*/React__default["default"].createElement("span", null, "\u70B9\u51FB\u8DF3\u8F6C\u4E8C\u7EF4\u7801")), /*#__PURE__*/React__default["default"].createElement("button", {
    onClick: carouselStop,
    className: "carousel-btn"
  }, "\u505C\u6B62\u8F6E\u64AD\u5C55\u793A\u4E8C\u7EF4\u7801"), /*#__PURE__*/React__default["default"].createElement("button", {
    onClick: carouselContinue,
    className: "carousel-btn"
  }, "\u7EE7\u7EED\u8F6E\u64AD\u5C55\u793A\u4E8C\u7EF4\u7801")))));
}

exports.ShotBtn = ShotBtn;
