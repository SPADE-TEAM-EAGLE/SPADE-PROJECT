/*!
 * Intro.js v7.0.1
 * https://introjs.com
 *
 * Copyright (C) 2012-2023 Afshin Mehrabani (@afshinmeh).
 * https://introjs.com
 *
 * Date: Sat, 25 Mar 2023 14:24:34 GMT
 */
!(function (t, e) {
  "object" == typeof exports && "undefined" != typeof module
    ? (module.exports = e())
    : "function" == typeof define && define.amd
    ? define(e)
    : ((t = "undefined" != typeof globalThis ? globalThis : t || self).introJs =
        e());
})(this, function () {
  "use strict";
  function t() {
    t = function () {
      return e;
    };
    var e = {},
      n = Object.prototype,
      r = n.hasOwnProperty,
      i =
        Object.defineProperty ||
        function (t, e, n) {
          t[e] = n.value;
        },
      o = "function" == typeof Symbol ? Symbol : {},
      a = o.iterator || "@@iterator",
      s = o.asyncIterator || "@@asyncIterator",
      l = o.toStringTag || "@@toStringTag";
    function c(t, e, n) {
      return (
        Object.defineProperty(t, e, {
          value: n,
          enumerable: !0,
          configurable: !0,
          writable: !0,
        }),
        t[e]
      );
    }
    try {
      c({}, "");
    } catch (t) {
      c = function (t, e, n) {
        return (t[e] = n);
      };
    }
    function u(t, e, n, r) {
      var o = e && e.prototype instanceof f ? e : f,
        a = Object.create(o.prototype),
        s = new j(r || []);
      return i(a, "_invoke", { value: x(t, n, s) }), a;
    }
    function h(t, e, n) {
      try {
        return { type: "normal", arg: t.call(e, n) };
      } catch (t) {
        return { type: "throw", arg: t };
      }
    }
    e.wrap = u;
    var p = {};
    function f() {}
    function d() {}
    function m() {}
    var b = {};
    c(b, a, function () {
      return this;
    });
    var v = Object.getPrototypeOf,
      y = v && v(v(A([])));
    y && y !== n && r.call(y, a) && (b = y);
    var g = (m.prototype = f.prototype = Object.create(b));
    function w(t) {
      ["next", "throw", "return"].forEach(function (e) {
        c(t, e, function (t) {
          return this._invoke(e, t);
        });
      });
    }
    function _(t, e) {
      function n(i, o, a, s) {
        var l = h(t[i], t, o);
        if ("throw" !== l.type) {
          var c = l.arg,
            u = c.value;
          return u && "object" == typeof u && r.call(u, "__await")
            ? e.resolve(u.__await).then(
                function (t) {
                  n("next", t, a, s);
                },
                function (t) {
                  n("throw", t, a, s);
                }
              )
            : e.resolve(u).then(
                function (t) {
                  (c.value = t), a(c);
                },
                function (t) {
                  return n("throw", t, a, s);
                }
              );
        }
        s(l.arg);
      }
      var o;
      i(this, "_invoke", {
        value: function (t, r) {
          function i() {
            return new e(function (e, i) {
              n(t, r, e, i);
            });
          }
          return (o = o ? o.then(i, i) : i());
        },
      });
    }
    function x(t, e, n) {
      var r = "suspendedStart";
      return function (i, o) {
        if ("executing" === r) throw new Error("Generator is already running");
        if ("completed" === r) {
          if ("throw" === i) throw o;
          return E();
        }
        for (n.method = i, n.arg = o; ; ) {
          var a = n.delegate;
          if (a) {
            var s = k(a, n);
            if (s) {
              if (s === p) continue;
              return s;
            }
          }
          if ("next" === n.method) n.sent = n._sent = n.arg;
          else if ("throw" === n.method) {
            if ("suspendedStart" === r) throw ((r = "completed"), n.arg);
            n.dispatchException(n.arg);
          } else "return" === n.method && n.abrupt("return", n.arg);
          r = "executing";
          var l = h(t, e, n);
          if ("normal" === l.type) {
            if (((r = n.done ? "completed" : "suspendedYield"), l.arg === p))
              continue;
            return { value: l.arg, done: n.done };
          }
          "throw" === l.type &&
            ((r = "completed"), (n.method = "throw"), (n.arg = l.arg));
        }
      };
    }
    function k(t, e) {
      var n = t.iterator[e.method];
      if (void 0 === n) {
        if (((e.delegate = null), "throw" === e.method)) {
          if (
            t.iterator.return &&
            ((e.method = "return"),
            (e.arg = void 0),
            k(t, e),
            "throw" === e.method)
          )
            return p;
          (e.method = "throw"),
            (e.arg = new TypeError(
              "The iterator does not provide a 'throw' method"
            ));
        }
        return p;
      }
      var r = h(n, t.iterator, e.arg);
      if ("throw" === r.type)
        return (e.method = "throw"), (e.arg = r.arg), (e.delegate = null), p;
      var i = r.arg;
      return i
        ? i.done
          ? ((e[t.resultName] = i.value),
            (e.next = t.nextLoc),
            "return" !== e.method && ((e.method = "next"), (e.arg = void 0)),
            (e.delegate = null),
            p)
          : i
        : ((e.method = "throw"),
          (e.arg = new TypeError("iterator result is not an object")),
          (e.delegate = null),
          p);
    }
    function C(t) {
      var e = { tryLoc: t[0] };
      1 in t && (e.catchLoc = t[1]),
        2 in t && ((e.finallyLoc = t[2]), (e.afterLoc = t[3])),
        this.tryEntries.push(e);
    }
    function S(t) {
      var e = t.completion || {};
      (e.type = "normal"), delete e.arg, (t.completion = e);
    }
    function j(t) {
      (this.tryEntries = [{ tryLoc: "root" }]),
        t.forEach(C, this),
        this.reset(!0);
    }
    function A(t) {
      if (t) {
        var e = t[a];
        if (e) return e.call(t);
        if ("function" == typeof t.next) return t;
        if (!isNaN(t.length)) {
          var n = -1,
            i = function e() {
              for (; ++n < t.length; )
                if (r.call(t, n)) return (e.value = t[n]), (e.done = !1), e;
              return (e.value = void 0), (e.done = !0), e;
            };
          return (i.next = i);
        }
      }
      return { next: E };
    }
    function E() {
      return { value: void 0, done: !0 };
    }
    return (
      (d.prototype = m),
      i(g, "constructor", { value: m, configurable: !0 }),
      i(m, "constructor", { value: d, configurable: !0 }),
      (d.displayName = c(m, l, "GeneratorFunction")),
      (e.isGeneratorFunction = function (t) {
        var e = "function" == typeof t && t.constructor;
        return (
          !!e && (e === d || "GeneratorFunction" === (e.displayName || e.name))
        );
      }),
      (e.mark = function (t) {
        return (
          Object.setPrototypeOf
            ? Object.setPrototypeOf(t, m)
            : ((t.__proto__ = m), c(t, l, "GeneratorFunction")),
          (t.prototype = Object.create(g)),
          t
        );
      }),
      (e.awrap = function (t) {
        return { __await: t };
      }),
      w(_.prototype),
      c(_.prototype, s, function () {
        return this;
      }),
      (e.AsyncIterator = _),
      (e.async = function (t, n, r, i, o) {
        void 0 === o && (o = Promise);
        var a = new _(u(t, n, r, i), o);
        return e.isGeneratorFunction(n)
          ? a
          : a.next().then(function (t) {
              return t.done ? t.value : a.next();
            });
      }),
      w(g),
      c(g, l, "Generator"),
      c(g, a, function () {
        return this;
      }),
      c(g, "toString", function () {
        return "[object Generator]";
      }),
      (e.keys = function (t) {
        var e = Object(t),
          n = [];
        for (var r in e) n.push(r);
        return (
          n.reverse(),
          function t() {
            for (; n.length; ) {
              var r = n.pop();
              if (r in e) return (t.value = r), (t.done = !1), t;
            }
            return (t.done = !0), t;
          }
        );
      }),
      (e.values = A),
      (j.prototype = {
        constructor: j,
        reset: function (t) {
          if (
            ((this.prev = 0),
            (this.next = 0),
            (this.sent = this._sent = void 0),
            (this.done = !1),
            (this.delegate = null),
            (this.method = "next"),
            (this.arg = void 0),
            this.tryEntries.forEach(S),
            !t)
          )
            for (var e in this)
              "t" === e.charAt(0) &&
                r.call(this, e) &&
                !isNaN(+e.slice(1)) &&
                (this[e] = void 0);
        },
        stop: function () {
          this.done = !0;
          var t = this.tryEntries[0].completion;
          if ("throw" === t.type) throw t.arg;
          return this.rval;
        },
        dispatchException: function (t) {
          if (this.done) throw t;
          var e = this;
          function n(n, r) {
            return (
              (a.type = "throw"),
              (a.arg = t),
              (e.next = n),
              r && ((e.method = "next"), (e.arg = void 0)),
              !!r
            );
          }
          for (var i = this.tryEntries.length - 1; i >= 0; --i) {
            var o = this.tryEntries[i],
              a = o.completion;
            if ("root" === o.tryLoc) return n("end");
            if (o.tryLoc <= this.prev) {
              var s = r.call(o, "catchLoc"),
                l = r.call(o, "finallyLoc");
              if (s && l) {
                if (this.prev < o.catchLoc) return n(o.catchLoc, !0);
                if (this.prev < o.finallyLoc) return n(o.finallyLoc);
              } else if (s) {
                if (this.prev < o.catchLoc) return n(o.catchLoc, !0);
              } else {
                if (!l)
                  throw new Error("try statement without catch or finally");
                if (this.prev < o.finallyLoc) return n(o.finallyLoc);
              }
            }
          }
        },
        abrupt: function (t, e) {
          for (var n = this.tryEntries.length - 1; n >= 0; --n) {
            var i = this.tryEntries[n];
            if (
              i.tryLoc <= this.prev &&
              r.call(i, "finallyLoc") &&
              this.prev < i.finallyLoc
            ) {
              var o = i;
              break;
            }
          }
          o &&
            ("break" === t || "continue" === t) &&
            o.tryLoc <= e &&
            e <= o.finallyLoc &&
            (o = null);
          var a = o ? o.completion : {};
          return (
            (a.type = t),
            (a.arg = e),
            o
              ? ((this.method = "next"), (this.next = o.finallyLoc), p)
              : this.complete(a)
          );
        },
        complete: function (t, e) {
          if ("throw" === t.type) throw t.arg;
          return (
            "break" === t.type || "continue" === t.type
              ? (this.next = t.arg)
              : "return" === t.type
              ? ((this.rval = this.arg = t.arg),
                (this.method = "return"),
                (this.next = "end"))
              : "normal" === t.type && e && (this.next = e),
            p
          );
        },
        finish: function (t) {
          for (var e = this.tryEntries.length - 1; e >= 0; --e) {
            var n = this.tryEntries[e];
            if (n.finallyLoc === t)
              return this.complete(n.completion, n.afterLoc), S(n), p;
          }
        },
        catch: function (t) {
          for (var e = this.tryEntries.length - 1; e >= 0; --e) {
            var n = this.tryEntries[e];
            if (n.tryLoc === t) {
              var r = n.completion;
              if ("throw" === r.type) {
                var i = r.arg;
                S(n);
              }
              return i;
            }
          }
          throw new Error("illegal catch attempt");
        },
        delegateYield: function (t, e, n) {
          return (
            (this.delegate = { iterator: A(t), resultName: e, nextLoc: n }),
            "next" === this.method && (this.arg = void 0),
            p
          );
        },
      }),
      e
    );
  }
  function e(t) {
    return (
      (e =
        "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
          ? function (t) {
              return typeof t;
            }
          : function (t) {
              return t &&
                "function" == typeof Symbol &&
                t.constructor === Symbol &&
                t !== Symbol.prototype
                ? "symbol"
                : typeof t;
            }),
      e(t)
    );
  }
  function n(t, e, n, r, i, o, a) {
    try {
      var s = t[o](a),
        l = s.value;
    } catch (t) {
      return void n(t);
    }
    s.done ? e(l) : Promise.resolve(l).then(r, i);
  }
  function r(t) {
    return function () {
      var e = this,
        r = arguments;
      return new Promise(function (i, o) {
        var a = t.apply(e, r);
        function s(t) {
          n(a, i, o, s, l, "next", t);
        }
        function l(t) {
          n(a, i, o, s, l, "throw", t);
        }
        s(void 0);
      });
    };
  }
  function i(t, e) {
    for (var n = 0; n < e.length; n++) {
      var r = e[n];
      (r.enumerable = r.enumerable || !1),
        (r.configurable = !0),
        "value" in r && (r.writable = !0),
        Object.defineProperty(t, r.key, r);
    }
  }
  function o(t, e, n) {
    return (
      e in t
        ? Object.defineProperty(t, e, {
            value: n,
            enumerable: !0,
            configurable: !0,
            writable: !0,
          })
        : (t[e] = n),
      t
    );
  }
  function a(t, e) {
    return (
      (function (t) {
        if (Array.isArray(t)) return t;
      })(t) ||
      (function (t, e) {
        var n =
          null == t
            ? null
            : ("undefined" != typeof Symbol && t[Symbol.iterator]) ||
              t["@@iterator"];
        if (null == n) return;
        var r,
          i,
          o = [],
          a = !0,
          s = !1;
        try {
          for (
            n = n.call(t);
            !(a = (r = n.next()).done) &&
            (o.push(r.value), !e || o.length !== e);
            a = !0
          );
        } catch (t) {
          (s = !0), (i = t);
        } finally {
          try {
            a || null == n.return || n.return();
          } finally {
            if (s) throw i;
          }
        }
        return o;
      })(t, e) ||
      (function (t, e) {
        if (!t) return;
        if ("string" == typeof t) return s(t, e);
        var n = Object.prototype.toString.call(t).slice(8, -1);
        "Object" === n && t.constructor && (n = t.constructor.name);
        if ("Map" === n || "Set" === n) return Array.from(t);
        if (
          "Arguments" === n ||
          /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
        )
          return s(t, e);
      })(t, e) ||
      (function () {
        throw new TypeError(
          "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
        );
      })()
    );
  }
  function s(t, e) {
    (null == e || e > t.length) && (e = t.length);
    for (var n = 0, r = new Array(e); n < e; n++) r[n] = t[n];
    return r;
  }
  var l,
    c =
      ((l = {}),
      function (t) {
        var e =
          arguments.length > 1 && void 0 !== arguments[1]
            ? arguments[1]
            : "introjs-stamp";
        return (l[e] = l[e] || 0), void 0 === t[e] && (t[e] = l[e]++), t[e];
      });
  function u(t, e, n) {
    if (t) for (var r = 0, i = t.length; r < i; r++) e(t[r], r);
    "function" == typeof n && n();
  }
  var h = new (function () {
    var t = "introjs_event";
    (this._id = function (t, e, n) {
      return t + c(e) + (n ? "_".concat(c(n)) : "");
    }),
      (this.on = function (e, n, r, i, o) {
        var a = this._id.apply(this, [n, r, i]),
          s = function (t) {
            return r.call(i || e, t || window.event);
          };
        "addEventListener" in e
          ? e.addEventListener(n, s, o)
          : "attachEvent" in e && e.attachEvent("on".concat(n), s),
          (e[t] = e[t] || {}),
          (e[t][a] = s);
      }),
      (this.off = function (e, n, r, i, o) {
        var a = this._id.apply(this, [n, r, i]),
          s = e[t] && e[t][a];
        s &&
          ("removeEventListener" in e
            ? e.removeEventListener(n, s, o)
            : "detachEvent" in e && e.detachEvent("on".concat(n), s),
          (e[t][a] = null));
      });
  })();
  function p(t, e) {
    if (t instanceof SVGElement) {
      var n = t.getAttribute("class") || "";
      n.match(e) || t.setAttribute("class", "".concat(n, " ").concat(e));
    } else {
      if (void 0 !== t.classList)
        u(e.split(" "), function (e) {
          t.classList.add(e);
        });
      else t.className.match(e) || (t.className += " ".concat(e));
    }
  }
  function f(t, e) {
    var n = "";
    return (
      "currentStyle" in t
        ? (n = t.currentStyle[e])
        : document.defaultView &&
          document.defaultView.getComputedStyle &&
          (n = document.defaultView
            .getComputedStyle(t, null)
            .getPropertyValue(e)),
      n && n.toLowerCase ? n.toLowerCase() : n
    );
  }
  function d(t) {
    p(t, "introjs-showElement");
    var e = f(t, "position");
    "absolute" !== e &&
      "relative" !== e &&
      "sticky" !== e &&
      "fixed" !== e &&
      p(t, "introjs-relativePosition");
  }
  function m(t) {
    if (this._options.scrollToElement) {
      var e = (function (t) {
        var e = window.getComputedStyle(t),
          n = "absolute" === e.position,
          r = /(auto|scroll)/;
        if ("fixed" === e.position) return document.body;
        for (var i = t; (i = i.parentElement); )
          if (
            ((e = window.getComputedStyle(i)),
            (!n || "static" !== e.position) &&
              r.test(e.overflow + e.overflowY + e.overflowX))
          )
            return i;
        return document.body;
      })(t);
      e !== document.body && (e.scrollTop = t.offsetTop - e.offsetTop);
    }
  }
  function b() {
    if (void 0 !== window.innerWidth)
      return { width: window.innerWidth, height: window.innerHeight };
    var t = document.documentElement;
    return { width: t.clientWidth, height: t.clientHeight };
  }
  function v(t, e, n) {
    var r;
    if (
      "off" !== t &&
      this._options.scrollToElement &&
      ((r =
        "tooltip" === t
          ? n.getBoundingClientRect()
          : e.getBoundingClientRect()),
      !(function (t) {
        var e = t.getBoundingClientRect();
        return (
          e.top >= 0 &&
          e.left >= 0 &&
          e.bottom + 80 <= window.innerHeight &&
          e.right <= window.innerWidth
        );
      })(e))
    ) {
      var i = b().height;
      r.bottom - (r.bottom - r.top) < 0 || e.clientHeight > i
        ? window.scrollBy(
            0,
            r.top - (i / 2 - r.height / 2) - this._options.scrollPadding
          )
        : window.scrollBy(
            0,
            r.top - (i / 2 - r.height / 2) + this._options.scrollPadding
          );
    }
  }
  function y(t) {
    t.setAttribute("role", "button"), (t.tabIndex = 0);
  }
  function g(t) {
    var e = t.parentElement;
    return (
      !(!e || "HTML" === e.nodeName) && ("fixed" === f(t, "position") || g(e))
    );
  }
  function w(t, e) {
    var n = document.body,
      r = document.documentElement,
      i = window.pageYOffset || r.scrollTop || n.scrollTop,
      o = window.pageXOffset || r.scrollLeft || n.scrollLeft;
    e = e || n;
    var a = t.getBoundingClientRect(),
      s = e.getBoundingClientRect(),
      l = f(e, "position"),
      c = { width: a.width, height: a.height };
    return ("body" !== e.tagName.toLowerCase() && "relative" === l) ||
      "sticky" === l
      ? Object.assign(c, { top: a.top - s.top, left: a.left - s.left })
      : g(t)
      ? Object.assign(c, { top: a.top, left: a.left })
      : Object.assign(c, { top: a.top + i, left: a.left + o });
  }
  function _(t, e) {
    if (t instanceof SVGElement) {
      var n = t.getAttribute("class") || "";
      t.setAttribute("class", n.replace(e, "").replace(/^\s+|\s+$/g, ""));
    } else t.className = t.className.replace(e, "").replace(/^\s+|\s+$/g, "");
  }
  function x(t, e) {
    var n = "";
    if ((t.style.cssText && (n += t.style.cssText), "string" == typeof e))
      n += e;
    else for (var r in e) n += "".concat(r, ":").concat(e[r], ";");
    t.style.cssText = n;
  }
  function k(t) {
    if (t) {
      if (!this._introItems[this._currentStep]) return;
      var e = this._introItems[this._currentStep],
        n = w(e.element, this._targetElement),
        r = this._options.helperElementPadding;
      g(e.element)
        ? p(t, "introjs-fixedTooltip")
        : _(t, "introjs-fixedTooltip"),
        "floating" === e.position && (r = 0),
        x(t, {
          width: "".concat(n.width + r, "px"),
          height: "".concat(n.height + r, "px"),
          top: "".concat(n.top - r / 2, "px"),
          left: "".concat(n.left - r / 2, "px"),
        });
    }
  }
  function C(t, e, n, r, i) {
    return t.left + e + n.width > r.width
      ? ((i.style.left = "".concat(r.width - n.width - t.left, "px")), !1)
      : ((i.style.left = "".concat(e, "px")), !0);
  }
  function S(t, e, n, r) {
    return t.left + t.width - e - n.width < 0
      ? ((r.style.left = "".concat(-t.left, "px")), !1)
      : ((r.style.right = "".concat(e, "px")), !0);
  }
  function j(t, e) {
    t.includes(e) && t.splice(t.indexOf(e), 1);
  }
  function A(t, e, n) {
    var r = this._options.positionPrecedence.slice(),
      i = b(),
      o = w(e).height + 10,
      a = w(e).width + 20,
      s = t.getBoundingClientRect(),
      l = "floating";
    s.bottom + o > i.height && j(r, "bottom"),
      s.top - o < 0 && j(r, "top"),
      s.right + a > i.width && j(r, "right"),
      s.left - a < 0 && j(r, "left");
    var c,
      u,
      h = -1 !== (u = (c = n || "").indexOf("-")) ? c.substr(u) : "";
    return (
      n && (n = n.split("-")[0]),
      r.length && (l = r.includes(n) ? n : r[0]),
      ["top", "bottom"].includes(l) &&
        (l += (function (t, e, n, r) {
          var i = e / 2,
            o = Math.min(n, window.screen.width),
            a = ["-left-aligned", "-middle-aligned", "-right-aligned"];
          return (
            o - t < e && j(a, "-left-aligned"),
            (t < i || o - t < i) && j(a, "-middle-aligned"),
            t < e && j(a, "-right-aligned"),
            a.length ? (a.includes(r) ? r : a[0]) : "-middle-aligned"
          );
        })(s.left, a, i.width, h)),
      l
    );
  }
  function E(t, e, n, r) {
    var i,
      o,
      a,
      s,
      l,
      c = "";
    if (
      ((r = r || !1),
      (e.style.top = null),
      (e.style.right = null),
      (e.style.bottom = null),
      (e.style.left = null),
      (e.style.marginLeft = null),
      (e.style.marginTop = null),
      (n.style.display = "inherit"),
      this._introItems[this._currentStep])
    ) {
      (c =
        "string" ==
        typeof (i = this._introItems[this._currentStep]).tooltipClass
          ? i.tooltipClass
          : this._options.tooltipClass),
        (e.className = ["introjs-tooltip", c].filter(Boolean).join(" ")),
        e.setAttribute("role", "dialog"),
        "floating" !== (l = this._introItems[this._currentStep].position) &&
          this._options.autoPosition &&
          (l = A.call(this, t, e, l)),
        (a = w(t)),
        (o = w(e)),
        (s = b()),
        p(e, "introjs-".concat(l));
      var u = a.width / 2 - o.width / 2;
      switch (l) {
        case "top-right-aligned":
          n.className = "introjs-arrow bottom-right";
          var h = 0;
          S(a, h, o, e), (e.style.bottom = "".concat(a.height + 20, "px"));
          break;
        case "top-middle-aligned":
          (n.className = "introjs-arrow bottom-middle"),
            r && (u += 5),
            S(a, u, o, e) && ((e.style.right = null), C(a, u, o, s, e)),
            (e.style.bottom = "".concat(a.height + 20, "px"));
          break;
        case "top-left-aligned":
        case "top":
          (n.className = "introjs-arrow bottom"),
            C(a, r ? 0 : 15, o, s, e),
            (e.style.bottom = "".concat(a.height + 20, "px"));
          break;
        case "right":
          (e.style.left = "".concat(a.width + 20, "px")),
            a.top + o.height > s.height
              ? ((n.className = "introjs-arrow left-bottom"),
                (e.style.top = "-".concat(o.height - a.height - 20, "px")))
              : (n.className = "introjs-arrow left");
          break;
        case "left":
          r || !0 !== this._options.showStepNumbers || (e.style.top = "15px"),
            a.top + o.height > s.height
              ? ((e.style.top = "-".concat(o.height - a.height - 20, "px")),
                (n.className = "introjs-arrow right-bottom"))
              : (n.className = "introjs-arrow right"),
            (e.style.right = "".concat(a.width + 20, "px"));
          break;
        case "floating":
          (n.style.display = "none"),
            (e.style.left = "50%"),
            (e.style.top = "50%"),
            (e.style.marginLeft = "-".concat(o.width / 2, "px")),
            (e.style.marginTop = "-".concat(o.height / 2, "px"));
          break;
        case "bottom-right-aligned":
          (n.className = "introjs-arrow top-right"),
            S(a, (h = 0), o, e),
            (e.style.top = "".concat(a.height + 20, "px"));
          break;
        case "bottom-middle-aligned":
          (n.className = "introjs-arrow top-middle"),
            r && (u += 5),
            S(a, u, o, e) && ((e.style.right = null), C(a, u, o, s, e)),
            (e.style.top = "".concat(a.height + 20, "px"));
          break;
        default:
          (n.className = "introjs-arrow top"),
            C(a, 0, o, s, e),
            (e.style.top = "".concat(a.height + 20, "px"));
      }
    }
  }
  function N() {
    u(
      Array.from(document.querySelectorAll(".introjs-showElement")),
      function (t) {
        _(t, /introjs-[a-zA-Z]+/g);
      }
    );
  }
  function L(t, e) {
    var n = document.createElement(t);
    e = e || {};
    var r = /^(?:role|data-|aria-)/;
    for (var i in e) {
      var o = e[i];
      "style" === i ? x(n, o) : i.match(r) ? n.setAttribute(i, o) : (n[i] = o);
    }
    return n;
  }
  function T(t, e) {
    var n = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
    if (n) {
      var r = e.style.opacity || "1";
      x(e, { opacity: "0" }),
        window.setTimeout(function () {
          x(e, { opacity: r });
        }, 10);
    }
    t.appendChild(e);
  }
  function I() {
    return (
      (parseInt(this._currentStep + 1, 10) / this._introItems.length) * 100
    );
  }
  function P() {
    var t = document.querySelector(".introjs-disableInteraction");
    null === t &&
      ((t = L("div", { className: "introjs-disableInteraction" })),
      this._targetElement.appendChild(t)),
      k.call(this, t);
  }
  function q(t) {
    var e = this,
      n = L("div", { className: "introjs-bullets" });
    !1 === this._options.showBullets && (n.style.display = "none");
    var r = L("ul");
    r.setAttribute("role", "tablist");
    var i = function () {
      e.goToStep(this.getAttribute("data-step-number"));
    };
    return (
      u(this._introItems, function (e, n) {
        var o = e.step,
          a = L("li"),
          s = L("a");
        a.setAttribute("role", "presentation"),
          s.setAttribute("role", "tab"),
          (s.onclick = i),
          n === t.step - 1 && (s.className = "active"),
          y(s),
          (s.innerHTML = "&nbsp;"),
          s.setAttribute("data-step-number", o),
          a.appendChild(s),
          r.appendChild(a);
      }),
      n.appendChild(r),
      n
    );
  }
  function O(t) {
    if (this._options.showBullets) {
      var e = document.querySelector(".introjs-bullets");
      e && e.parentNode.replaceChild(q.call(this, t), e);
    }
  }
  function B(t, e) {
    this._options.showBullets &&
      ((t.querySelector(".introjs-bullets li > a.active").className = ""),
      (t.querySelector(
        '.introjs-bullets li > a[data-step-number="'.concat(e.step, '"]')
      ).className = "active"));
  }
  function H() {
    var t = L("div");
    (t.className = "introjs-progress"),
      !1 === this._options.showProgress && (t.style.display = "none");
    var e = L("div", { className: "introjs-progressbar" });
    return (
      this._options.progressBarAdditionalClass &&
        (e.className += " " + this._options.progressBarAdditionalClass),
      e.setAttribute("role", "progress"),
      e.setAttribute("aria-valuemin", "0"),
      e.setAttribute("aria-valuemax", "100"),
      e.setAttribute("aria-valuenow", I.call(this)),
      (e.style.cssText = "width:".concat(I.call(this), "%;")),
      t.appendChild(e),
      t
    );
  }
  function R(t) {
    (t.querySelector(".introjs-progress .introjs-progressbar").style.cssText =
      "width:".concat(I.call(this), "%;")),
      t
        .querySelector(".introjs-progress .introjs-progressbar")
        .setAttribute("aria-valuenow", I.call(this));
  }
  function M(t) {
    return F.apply(this, arguments);
  }
  function F() {
    return (F = r(
      t().mark(function e(n) {
        var i,
          o,
          a,
          s,
          l,
          c,
          u,
          h,
          f,
          b,
          g,
          w,
          _,
          C,
          S,
          j,
          A,
          I,
          O,
          M,
          F,
          D,
          G,
          V,
          z,
          Y = this;
        return t().wrap(
          function (e) {
            for (;;)
              switch ((e.prev = e.next)) {
                case 0:
                  if (void 0 === this._introChangeCallback) {
                    e.next = 3;
                    break;
                  }
                  return (
                    (e.next = 3),
                    this._introChangeCallback.call(this, n.element)
                  );
                case 3:
                  if (
                    ((i = this),
                    (o = document.querySelector(".introjs-helperLayer")),
                    (a = document.querySelector(
                      ".introjs-tooltipReferenceLayer"
                    )),
                    (s = "introjs-helperLayer"),
                    "string" == typeof n.highlightClass &&
                      (s += " ".concat(n.highlightClass)),
                    "string" == typeof this._options.highlightClass &&
                      (s += " ".concat(this._options.highlightClass)),
                    null !== o && null !== a
                      ? ((h = a.querySelector(".introjs-helperNumberLayer")),
                        (f = a.querySelector(".introjs-tooltiptext")),
                        (b = a.querySelector(".introjs-tooltip-title")),
                        (g = a.querySelector(".introjs-arrow")),
                        (w = a.querySelector(".introjs-tooltip")),
                        (u = a.querySelector(".introjs-skipbutton")),
                        (c = a.querySelector(".introjs-prevbutton")),
                        (l = a.querySelector(".introjs-nextbutton")),
                        (o.className = s),
                        (w.style.opacity = "0"),
                        (w.style.display = "none"),
                        m.call(i, n.element),
                        k.call(i, o),
                        k.call(i, a),
                        N(),
                        i._lastShowElementTimer &&
                          window.clearTimeout(i._lastShowElementTimer),
                        (i._lastShowElementTimer = window.setTimeout(
                          function () {
                            null !== h &&
                              (h.innerHTML = ""
                                .concat(n.step, " ")
                                .concat(Y._options.stepNumbersOfLabel, " ")
                                .concat(Y._introItems.length)),
                              (f.innerHTML = n.intro),
                              (b.innerHTML = n.title),
                              (w.style.display = "block"),
                              E.call(i, n.element, w, g),
                              B.call(i, a, n),
                              R.call(i, a),
                              (w.style.opacity = "1"),
                              ((null != l &&
                                /introjs-donebutton/gi.test(l.className)) ||
                                null != l) &&
                                l.focus(),
                              v.call(i, n.scrollTo, n.element, f);
                          },
                          350
                        )))
                      : ((_ = L("div", { className: s })),
                        (C = L("div", {
                          className: "introjs-tooltipReferenceLayer",
                        })),
                        (S = L("div", { className: "introjs-arrow" })),
                        (j = L("div", { className: "introjs-tooltip" })),
                        (A = L("div", { className: "introjs-tooltiptext" })),
                        (I = L("div", { className: "introjs-tooltip-header" })),
                        (O = L("h1", { className: "introjs-tooltip-title" })),
                        (M = L("div")),
                        x(_, {
                          "box-shadow":
                            "0 0 1px 2px rgba(33, 33, 33, 0.8), rgba(33, 33, 33, ".concat(
                              i._options.overlayOpacity.toString(),
                              ") 0 0 0 5000px"
                            ),
                        }),
                        m.call(i, n.element),
                        k.call(i, _),
                        k.call(i, C),
                        T(this._targetElement, _, !0),
                        T(this._targetElement, C),
                        (A.innerHTML = n.intro),
                        (O.innerHTML = n.title),
                        (M.className = "introjs-tooltipbuttons"),
                        !1 === this._options.showButtons &&
                          (M.style.display = "none"),
                        I.appendChild(O),
                        j.appendChild(I),
                        j.appendChild(A),
                        this._options.dontShowAgain &&
                          ((F = L("div", {
                            className: "introjs-dontShowAgain",
                          })),
                          ((D = L("input", {
                            type: "checkbox",
                            id: "introjs-dontShowAgain",
                            name: "introjs-dontShowAgain",
                          })).onchange = function (t) {
                            Y.setDontShowAgain(t.target.checked);
                          }),
                          ((G = L("label", {
                            htmlFor: "introjs-dontShowAgain",
                          })).innerText = this._options.dontShowAgainLabel),
                          F.appendChild(D),
                          F.appendChild(G),
                          j.appendChild(F)),
                        j.appendChild(q.call(this, n)),
                        j.appendChild(H.call(this)),
                        (V = L("div")),
                        !0 === this._options.showStepNumbers &&
                          ((V.className = "introjs-helperNumberLayer"),
                          (V.innerHTML = ""
                            .concat(n.step, " ")
                            .concat(this._options.stepNumbersOfLabel, " ")
                            .concat(this._introItems.length)),
                          j.appendChild(V)),
                        j.appendChild(S),
                        C.appendChild(j),
                        ((l = L("a")).onclick = r(
                          t().mark(function e() {
                            return t().wrap(function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    if (
                                      i._introItems.length - 1 ===
                                      i._currentStep
                                    ) {
                                      t.next = 5;
                                      break;
                                    }
                                    return (t.next = 3), W.call(i);
                                  case 3:
                                    t.next = 11;
                                    break;
                                  case 5:
                                    if (
                                      !/introjs-donebutton/gi.test(l.className)
                                    ) {
                                      t.next = 11;
                                      break;
                                    }
                                    if (
                                      "function" !=
                                      typeof i._introCompleteCallback
                                    ) {
                                      t.next = 9;
                                      break;
                                    }
                                    return (
                                      (t.next = 9),
                                      i._introCompleteCallback.call(
                                        i,
                                        i._currentStep,
                                        "done"
                                      )
                                    );
                                  case 9:
                                    return (
                                      (t.next = 11),
                                      xt.call(i, i._targetElement)
                                    );
                                  case 11:
                                  case "end":
                                    return t.stop();
                                }
                            }, e);
                          })
                        )),
                        y(l),
                        (l.innerHTML = this._options.nextLabel),
                        ((c = L("a")).onclick = r(
                          t().mark(function e() {
                            return t().wrap(function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    if (0 === i._currentStep) {
                                      t.next = 3;
                                      break;
                                    }
                                    return (t.next = 3), $.call(i);
                                  case 3:
                                  case "end":
                                    return t.stop();
                                }
                            }, e);
                          })
                        )),
                        y(c),
                        (c.innerHTML = this._options.prevLabel),
                        y((u = L("a", { className: "introjs-skipbutton" }))),
                        (u.innerHTML = this._options.skipLabel),
                        (u.onclick = r(
                          t().mark(function e() {
                            return t().wrap(function (t) {
                              for (;;)
                                switch ((t.prev = t.next)) {
                                  case 0:
                                    if (
                                      i._introItems.length - 1 !==
                                        i._currentStep ||
                                      "function" !=
                                        typeof i._introCompleteCallback
                                    ) {
                                      t.next = 3;
                                      break;
                                    }
                                    return (
                                      (t.next = 3),
                                      i._introCompleteCallback.call(
                                        i,
                                        i._currentStep,
                                        "skip"
                                      )
                                    );
                                  case 3:
                                    if (
                                      "function" != typeof i._introSkipCallback
                                    ) {
                                      t.next = 6;
                                      break;
                                    }
                                    return (
                                      (t.next = 6), i._introSkipCallback.call(i)
                                    );
                                  case 6:
                                    return (
                                      (t.next = 8), xt.call(i, i._targetElement)
                                    );
                                  case 8:
                                  case "end":
                                    return t.stop();
                                }
                            }, e);
                          })
                        )),
                        I.appendChild(u),
                        this._introItems.length > 1 && M.appendChild(c),
                        M.appendChild(l),
                        j.appendChild(M),
                        E.call(i, n.element, j, S),
                        v.call(this, n.scrollTo, n.element, j)),
                    (z = i._targetElement.querySelector(
                      ".introjs-disableInteraction"
                    )) && z.parentNode.removeChild(z),
                    n.disableInteraction && P.call(i),
                    0 === this._currentStep && this._introItems.length > 1
                      ? (null != l &&
                          ((l.className = "".concat(
                            this._options.buttonClass,
                            " introjs-nextbutton"
                          )),
                          (l.innerHTML = this._options.nextLabel)),
                        !0 === this._options.hidePrev
                          ? (null != c &&
                              (c.className = "".concat(
                                this._options.buttonClass,
                                " introjs-prevbutton introjs-hidden"
                              )),
                            null != l && p(l, "introjs-fullbutton"))
                          : null != c &&
                            (c.className = "".concat(
                              this._options.buttonClass,
                              " introjs-prevbutton introjs-disabled"
                            )))
                      : this._introItems.length - 1 === this._currentStep ||
                        1 === this._introItems.length
                      ? (null != c &&
                          (c.className = "".concat(
                            this._options.buttonClass,
                            " introjs-prevbutton"
                          )),
                        !0 === this._options.hideNext
                          ? (null != l &&
                              (l.className = "".concat(
                                this._options.buttonClass,
                                " introjs-nextbutton introjs-hidden"
                              )),
                            null != c && p(c, "introjs-fullbutton"))
                          : null != l &&
                            (!0 === this._options.nextToDone
                              ? ((l.innerHTML = this._options.doneLabel),
                                p(
                                  l,
                                  "".concat(
                                    this._options.buttonClass,
                                    " introjs-nextbutton introjs-donebutton"
                                  )
                                ))
                              : (l.className = "".concat(
                                  this._options.buttonClass,
                                  " introjs-nextbutton introjs-disabled"
                                ))))
                      : (null != c &&
                          (c.className = "".concat(
                            this._options.buttonClass,
                            " introjs-prevbutton"
                          )),
                        null != l &&
                          ((l.className = "".concat(
                            this._options.buttonClass,
                            " introjs-nextbutton"
                          )),
                          (l.innerHTML = this._options.nextLabel))),
                    null != c && c.setAttribute("role", "button"),
                    null != l && l.setAttribute("role", "button"),
                    null != u && u.setAttribute("role", "button"),
                    null != l && l.focus(),
                    d(n.element),
                    void 0 === this._introAfterChangeCallback)
                  ) {
                    e.next = 22;
                    break;
                  }
                  return (
                    (e.next = 22),
                    this._introAfterChangeCallback.call(this, n.element)
                  );
                case 22:
                case "end":
                  return e.stop();
              }
          },
          e,
          this
        );
      })
    )).apply(this, arguments);
  }
  function D(t) {
    return G.apply(this, arguments);
  }
  function G() {
    return (G = r(
      t().mark(function e(n) {
        return t().wrap(
          function (t) {
            for (;;)
              switch ((t.prev = t.next)) {
                case 0:
                  if (
                    ((this._currentStep = n - 2), void 0 === this._introItems)
                  ) {
                    t.next = 4;
                    break;
                  }
                  return (t.next = 4), W.call(this);
                case 4:
                case "end":
                  return t.stop();
              }
          },
          e,
          this
        );
      })
    )).apply(this, arguments);
  }
  function V(t) {
    return z.apply(this, arguments);
  }
  function z() {
    return (z = r(
      t().mark(function e(n) {
        return t().wrap(
          function (t) {
            for (;;)
              switch ((t.prev = t.next)) {
                case 0:
                  if (
                    ((this._currentStepNumber = n), void 0 === this._introItems)
                  ) {
                    t.next = 4;
                    break;
                  }
                  return (t.next = 4), W.call(this);
                case 4:
                case "end":
                  return t.stop();
              }
          },
          e,
          this
        );
      })
    )).apply(this, arguments);
  }
  function W() {
    return Y.apply(this, arguments);
  }
  function Y() {
    return (
      (Y = r(
        t().mark(function e() {
          var n,
            r,
            i = this;
          return t().wrap(
            function (t) {
              for (;;)
                switch ((t.prev = t.next)) {
                  case 0:
                    if (
                      ((this._direction = "forward"),
                      void 0 !== this._currentStepNumber &&
                        u(this._introItems, function (t, e) {
                          t.step === i._currentStepNumber &&
                            ((i._currentStep = e - 1),
                            (i._currentStepNumber = void 0));
                        }),
                      void 0 === this._currentStep
                        ? (this._currentStep = 0)
                        : ++this._currentStep,
                      (n = this._introItems[this._currentStep]),
                      (r = !0),
                      void 0 === this._introBeforeChangeCallback)
                    ) {
                      t.next = 9;
                      break;
                    }
                    return (
                      (t.next = 8),
                      this._introBeforeChangeCallback.call(this, n && n.element)
                    );
                  case 8:
                    r = t.sent;
                  case 9:
                    if (!1 !== r) {
                      t.next = 12;
                      break;
                    }
                    return --this._currentStep, t.abrupt("return", !1);
                  case 12:
                    if (!(this._introItems.length <= this._currentStep)) {
                      t.next = 19;
                      break;
                    }
                    if ("function" != typeof this._introCompleteCallback) {
                      t.next = 16;
                      break;
                    }
                    return (
                      (t.next = 16),
                      this._introCompleteCallback.call(
                        this,
                        this._currentStep,
                        "end"
                      )
                    );
                  case 16:
                    return (t.next = 18), xt.call(this, this._targetElement);
                  case 18:
                    return t.abrupt("return", !1);
                  case 19:
                    return (t.next = 21), M.call(this, n);
                  case 21:
                    return t.abrupt("return", !0);
                  case 22:
                  case "end":
                    return t.stop();
                }
            },
            e,
            this
          );
        })
      )),
      Y.apply(this, arguments)
    );
  }
  function $() {
    return Q.apply(this, arguments);
  }
  function Q() {
    return (
      (Q = r(
        t().mark(function e() {
          var n, r;
          return t().wrap(
            function (t) {
              for (;;)
                switch ((t.prev = t.next)) {
                  case 0:
                    if (
                      ((this._direction = "backward"), 0 !== this._currentStep)
                    ) {
                      t.next = 3;
                      break;
                    }
                    return t.abrupt("return", !1);
                  case 3:
                    if (
                      (--this._currentStep,
                      (n = this._introItems[this._currentStep]),
                      (r = !0),
                      void 0 === this._introBeforeChangeCallback)
                    ) {
                      t.next = 10;
                      break;
                    }
                    return (
                      (t.next = 9),
                      this._introBeforeChangeCallback.call(this, n && n.element)
                    );
                  case 9:
                    r = t.sent;
                  case 10:
                    if (!1 !== r) {
                      t.next = 13;
                      break;
                    }
                    return ++this._currentStep, t.abrupt("return", !1);
                  case 13:
                    return (t.next = 15), M.call(this, n);
                  case 15:
                    return t.abrupt("return", !0);
                  case 16:
                  case "end":
                    return t.stop();
                }
            },
            e,
            this
          );
        })
      )),
      Q.apply(this, arguments)
    );
  }
  function U() {
    return this._currentStep;
  }
  function X(t) {
    return J.apply(this, arguments);
  }
  function J() {
    return (J = r(
      t().mark(function e(n) {
        var r, i;
        return t().wrap(
          function (t) {
            for (;;)
              switch ((t.prev = t.next)) {
                case 0:
                  if (
                    (null === (r = void 0 === n.code ? n.which : n.code) &&
                      (r = null === n.charCode ? n.keyCode : n.charCode),
                    ("Escape" !== r && 27 !== r) ||
                      !0 !== this._options.exitOnEsc)
                  ) {
                    t.next = 7;
                    break;
                  }
                  return (t.next = 5), xt.call(this, this._targetElement);
                case 5:
                  t.next = 39;
                  break;
                case 7:
                  if ("ArrowLeft" !== r && 37 !== r) {
                    t.next = 12;
                    break;
                  }
                  return (t.next = 10), $.call(this);
                case 10:
                  t.next = 39;
                  break;
                case 12:
                  if ("ArrowRight" !== r && 39 !== r) {
                    t.next = 17;
                    break;
                  }
                  return (t.next = 15), W.call(this);
                case 15:
                  t.next = 39;
                  break;
                case 17:
                  if ("Enter" !== r && "NumpadEnter" !== r && 13 !== r) {
                    t.next = 39;
                    break;
                  }
                  if (
                    !(i = n.target || n.srcElement) ||
                    !i.className.match("introjs-prevbutton")
                  ) {
                    t.next = 24;
                    break;
                  }
                  return (t.next = 22), $.call(this);
                case 22:
                  t.next = 38;
                  break;
                case 24:
                  if (!i || !i.className.match("introjs-skipbutton")) {
                    t.next = 32;
                    break;
                  }
                  if (
                    this._introItems.length - 1 !== this._currentStep ||
                    "function" != typeof this._introCompleteCallback
                  ) {
                    t.next = 28;
                    break;
                  }
                  return (
                    (t.next = 28),
                    this._introCompleteCallback.call(
                      this,
                      this._currentStep,
                      "skip"
                    )
                  );
                case 28:
                  return (t.next = 30), xt.call(this, this._targetElement);
                case 30:
                  t.next = 38;
                  break;
                case 32:
                  if (!i || !i.getAttribute("data-step-number")) {
                    t.next = 36;
                    break;
                  }
                  i.click(), (t.next = 38);
                  break;
                case 36:
                  return (t.next = 38), W.call(this);
                case 38:
                  n.preventDefault ? n.preventDefault() : (n.returnValue = !1);
                case 39:
                case "end":
                  return t.stop();
              }
          },
          e,
          this
        );
      })
    )).apply(this, arguments);
  }
  function Z(t) {
    if (null === t || "object" !== e(t) || "nodeType" in t) return t;
    var n = {};
    for (var r in t)
      "jQuery" in window && t[r] instanceof window.jQuery
        ? (n[r] = t[r])
        : (n[r] = Z(t[r]));
    return n;
  }
  function K(t, e) {
    var n,
      r = this;
    return function () {
      for (var i = arguments.length, o = new Array(i), a = 0; a < i; a++)
        o[a] = arguments[a];
      clearTimeout(n),
        (n = setTimeout(function () {
          t.apply(r, o);
        }, e));
    };
  }
  function tt(t) {
    var e = document.querySelector(".introjs-hints");
    return e ? Array.from(e.querySelectorAll(t)) : [];
  }
  function et(t) {
    return nt.apply(this, arguments);
  }
  function nt() {
    return (nt = r(
      t().mark(function e(n) {
        var r;
        return t().wrap(
          function (t) {
            for (;;)
              switch ((t.prev = t.next)) {
                case 0:
                  if (
                    ((r = tt('.introjs-hint[data-step="'.concat(n, '"]'))[0]),
                    dt.call(this),
                    r && p(r, "introjs-hidehint"),
                    void 0 === this._hintCloseCallback)
                  ) {
                    t.next = 6;
                    break;
                  }
                  return (t.next = 6), this._hintCloseCallback.call(this, n);
                case 6:
                case "end":
                  return t.stop();
              }
          },
          e,
          this
        );
      })
    )).apply(this, arguments);
  }
  function rt() {
    var e = this;
    u(
      tt(".introjs-hint"),
      (function () {
        var n = r(
          t().mark(function n(r) {
            return t().wrap(function (t) {
              for (;;)
                switch ((t.prev = t.next)) {
                  case 0:
                    return (
                      (t.next = 2), et.call(e, r.getAttribute("data-step"))
                    );
                  case 2:
                  case "end":
                    return t.stop();
                }
            }, n);
          })
        );
        return function (t) {
          return n.apply(this, arguments);
        };
      })()
    );
  }
  function it() {
    return ot.apply(this, arguments);
  }
  function ot() {
    return (ot = r(
      t().mark(function e() {
        var n,
          r = this;
        return t().wrap(
          function (t) {
            for (;;)
              switch ((t.prev = t.next)) {
                case 0:
                  if (!(n = tt(".introjs-hint")) || !n.length) {
                    t.next = 5;
                    break;
                  }
                  u(n, function (t) {
                    at.call(r, t.getAttribute("data-step"));
                  }),
                    (t.next = 7);
                  break;
                case 5:
                  return (t.next = 7), mt.call(this, this._targetElement);
                case 7:
                case "end":
                  return t.stop();
              }
          },
          e,
          this
        );
      })
    )).apply(this, arguments);
  }
  function at(t) {
    var e = tt('.introjs-hint[data-step="'.concat(t, '"]'))[0];
    e && _(e, /introjs-hidehint/g);
  }
  function st() {
    var t = this;
    u(tt(".introjs-hint"), function (e) {
      lt.call(t, e.getAttribute("data-step"));
    }),
      h.off(document, "click", dt, this, !1),
      h.off(window, "resize", vt, this, !0),
      this._hintsAutoRefreshFunction &&
        h.off(window, "scroll", this._hintsAutoRefreshFunction, this, !0);
  }
  function lt(t) {
    var e = tt('.introjs-hint[data-step="'.concat(t, '"]'))[0];
    e && e.parentNode.removeChild(e);
  }
  function ct() {
    return ut.apply(this, arguments);
  }
  function ut() {
    return (ut = r(
      t().mark(function e() {
        var n,
          r,
          i,
          o = this;
        return t().wrap(
          function (t) {
            for (;;)
              switch ((t.prev = t.next)) {
                case 0:
                  if (
                    ((n = this),
                    null === (r = document.querySelector(".introjs-hints")) &&
                      (r = L("div", { className: "introjs-hints" })),
                    (i = function (t) {
                      return function (e) {
                        var r = e || window.event;
                        r.stopPropagation && r.stopPropagation(),
                          null !== r.cancelBubble && (r.cancelBubble = !0),
                          pt.call(n, t);
                      };
                    }),
                    u(this._introItems, function (t, e) {
                      if (
                        !document.querySelector(
                          '.introjs-hint[data-step="'.concat(e, '"]')
                        )
                      ) {
                        var n = L("a", { className: "introjs-hint" });
                        y(n),
                          (n.onclick = i(e)),
                          t.hintAnimation || p(n, "introjs-hint-no-anim"),
                          g(t.element) && p(n, "introjs-fixedhint");
                        var a = L("div", { className: "introjs-hint-dot" }),
                          s = L("div", { className: "introjs-hint-pulse" });
                        n.appendChild(a),
                          n.appendChild(s),
                          n.setAttribute("data-step", e.toString());
                        var l = t.element;
                        (t.element = n),
                          ht.call(o, t.hintPosition, n, l),
                          r.appendChild(n);
                      }
                    }),
                    document.body.appendChild(r),
                    void 0 === this._hintsAddedCallback)
                  ) {
                    t.next = 9;
                    break;
                  }
                  return (t.next = 9), this._hintsAddedCallback.call(this);
                case 9:
                  this._options.hintAutoRefreshInterval >= 0 &&
                    ((this._hintsAutoRefreshFunction = K(function () {
                      return vt.call(o);
                    }, this._options.hintAutoRefreshInterval)),
                    h.on(
                      window,
                      "scroll",
                      this._hintsAutoRefreshFunction,
                      this,
                      !0
                    ));
                case 10:
                case "end":
                  return t.stop();
              }
          },
          e,
          this
        );
      })
    )).apply(this, arguments);
  }
  function ht(t, e, n) {
    var r = w.call(this, n),
      i = 20,
      o = 20;
    switch (t) {
      default:
      case "top-left":
        (e.style.left = "".concat(r.left, "px")),
          (e.style.top = "".concat(r.top, "px"));
        break;
      case "top-right":
        (e.style.left = "".concat(r.left + r.width - i, "px")),
          (e.style.top = "".concat(r.top, "px"));
        break;
      case "bottom-left":
        (e.style.left = "".concat(r.left, "px")),
          (e.style.top = "".concat(r.top + r.height - o, "px"));
        break;
      case "bottom-right":
        (e.style.left = "".concat(r.left + r.width - i, "px")),
          (e.style.top = "".concat(r.top + r.height - o, "px"));
        break;
      case "middle-left":
        (e.style.left = "".concat(r.left, "px")),
          (e.style.top = "".concat(r.top + (r.height - o) / 2, "px"));
        break;
      case "middle-right":
        (e.style.left = "".concat(r.left + r.width - i, "px")),
          (e.style.top = "".concat(r.top + (r.height - o) / 2, "px"));
        break;
      case "middle-middle":
        (e.style.left = "".concat(r.left + (r.width - i) / 2, "px")),
          (e.style.top = "".concat(r.top + (r.height - o) / 2, "px"));
        break;
      case "bottom-middle":
        (e.style.left = "".concat(r.left + (r.width - i) / 2, "px")),
          (e.style.top = "".concat(r.top + r.height - o, "px"));
        break;
      case "top-middle":
        (e.style.left = "".concat(r.left + (r.width - i) / 2, "px")),
          (e.style.top = "".concat(r.top, "px"));
    }
  }
  function pt(t) {
    return ft.apply(this, arguments);
  }
  function ft() {
    return (ft = r(
      t().mark(function e(n) {
        var r, i, o, a, s, l, c, u, h;
        return t().wrap(
          function (t) {
            for (;;)
              switch ((t.prev = t.next)) {
                case 0:
                  if (
                    ((r = document.querySelector(
                      '.introjs-hint[data-step="'.concat(n, '"]')
                    )),
                    (i = this._introItems[n]),
                    void 0 === this._hintClickCallback)
                  ) {
                    t.next = 5;
                    break;
                  }
                  return (
                    (t.next = 5), this._hintClickCallback.call(this, r, i, n)
                  );
                case 5:
                  if (((o = dt.call(this)), parseInt(o, 10) !== n)) {
                    t.next = 8;
                    break;
                  }
                  return t.abrupt("return");
                case 8:
                  (a = L("div", { className: "introjs-tooltip" })),
                    (s = L("div")),
                    (l = L("div")),
                    (c = L("div")),
                    (a.onclick = function (t) {
                      t.stopPropagation
                        ? t.stopPropagation()
                        : (t.cancelBubble = !0);
                    }),
                    (s.className = "introjs-tooltiptext"),
                    ((u = L("p")).innerHTML = i.hint),
                    s.appendChild(u),
                    this._options.hintShowButton &&
                      (((h = L("a")).className = this._options.buttonClass),
                      h.setAttribute("role", "button"),
                      (h.innerHTML = this._options.hintButtonLabel),
                      (h.onclick = et.bind(this, n)),
                      s.appendChild(h)),
                    (l.className = "introjs-arrow"),
                    a.appendChild(l),
                    a.appendChild(s),
                    (this._currentStep = r.getAttribute("data-step")),
                    (c.className =
                      "introjs-tooltipReferenceLayer introjs-hintReference"),
                    c.setAttribute("data-step", r.getAttribute("data-step")),
                    k.call(this, c),
                    c.appendChild(a),
                    document.body.appendChild(c),
                    E.call(this, r, a, l, !0);
                case 28:
                case "end":
                  return t.stop();
              }
          },
          e,
          this
        );
      })
    )).apply(this, arguments);
  }
  function dt() {
    var t = document.querySelector(".introjs-hintReference");
    if (t) {
      var e = t.getAttribute("data-step");
      return t.parentNode.removeChild(t), e;
    }
  }
  function mt(t) {
    return bt.apply(this, arguments);
  }
  function bt() {
    return (bt = r(
      t().mark(function e(n) {
        var r,
          i = this;
        return t().wrap(
          function (t) {
            for (;;)
              switch ((t.prev = t.next)) {
                case 0:
                  if (((this._introItems = []), !this._options.hints)) {
                    t.next = 5;
                    break;
                  }
                  u(this._options.hints, function (t) {
                    var e = Z(t);
                    "string" == typeof e.element &&
                      (e.element = document.querySelector(e.element)),
                      (e.hintPosition =
                        e.hintPosition || i._options.hintPosition),
                      (e.hintAnimation =
                        e.hintAnimation || i._options.hintAnimation),
                      null !== e.element && i._introItems.push(e);
                  }),
                    (t.next = 9);
                  break;
                case 5:
                  if (
                    (r = Array.from(n.querySelectorAll("*[data-hint]"))) &&
                    r.length
                  ) {
                    t.next = 8;
                    break;
                  }
                  return t.abrupt("return", !1);
                case 8:
                  u(r, function (t) {
                    var e = t.getAttribute("data-hint-animation");
                    (e = e ? "true" === e : i._options.hintAnimation),
                      i._introItems.push({
                        element: t,
                        hint: t.getAttribute("data-hint"),
                        hintPosition:
                          t.getAttribute("data-hint-position") ||
                          i._options.hintPosition,
                        hintAnimation: e,
                        tooltipClass: t.getAttribute("data-tooltip-class"),
                        position:
                          t.getAttribute("data-position") ||
                          i._options.tooltipPosition,
                      });
                  });
                case 9:
                  return (t.next = 11), ct.call(this);
                case 11:
                  return (
                    h.on(document, "click", dt, this, !1),
                    h.on(window, "resize", vt, this, !0),
                    t.abrupt("return", !0)
                  );
                case 14:
                case "end":
                  return t.stop();
              }
          },
          e,
          this
        );
      })
    )).apply(this, arguments);
  }
  function vt() {
    var t = this;
    u(this._introItems, function (e) {
      var n = e.targetElement,
        r = e.hintPosition,
        i = e.element;
      void 0 !== n && ht.call(t, r, i, n);
    });
  }
  function yt(t) {
    var e = this,
      n = Array.from(t.querySelectorAll("*[data-intro]")),
      r = [];
    if (this._options.steps)
      u(this._options.steps, function (t) {
        var n = Z(t);
        if (
          ((n.step = r.length + 1),
          (n.title = n.title || ""),
          "string" == typeof n.element &&
            (n.element = document.querySelector(n.element)),
          void 0 === n.element || null === n.element)
        ) {
          var i = document.querySelector(".introjsFloatingElement");
          null === i &&
            ((i = L("div", { className: "introjsFloatingElement" })),
            document.body.appendChild(i)),
            (n.element = i),
            (n.position = "floating");
        }
        (n.position = n.position || e._options.tooltipPosition),
          (n.scrollTo = n.scrollTo || e._options.scrollTo),
          void 0 === n.disableInteraction &&
            (n.disableInteraction = e._options.disableInteraction),
          null !== n.element && r.push(n);
      });
    else {
      var i;
      if (n.length < 1) return [];
      u(n, function (t) {
        if (
          (!e._options.group ||
            t.getAttribute("data-intro-group") === e._options.group) &&
          "none" !== t.style.display
        ) {
          var n = parseInt(t.getAttribute("data-step"), 10);
          (i = t.hasAttribute("data-disable-interaction")
            ? !!t.getAttribute("data-disable-interaction")
            : e._options.disableInteraction),
            n > 0 &&
              (r[n - 1] = {
                element: t,
                title: t.getAttribute("data-title") || "",
                intro: t.getAttribute("data-intro"),
                step: parseInt(t.getAttribute("data-step"), 10),
                tooltipClass: t.getAttribute("data-tooltip-class"),
                highlightClass: t.getAttribute("data-highlight-class"),
                position:
                  t.getAttribute("data-position") || e._options.tooltipPosition,
                scrollTo:
                  t.getAttribute("data-scroll-to") || e._options.scrollTo,
                disableInteraction: i,
              });
        }
      });
      var o = 0;
      u(n, function (t) {
        if (
          (!e._options.group ||
            t.getAttribute("data-intro-group") === e._options.group) &&
          null === t.getAttribute("data-step")
        ) {
          for (; void 0 !== r[o]; ) o++;
          (i = t.hasAttribute("data-disable-interaction")
            ? !!t.getAttribute("data-disable-interaction")
            : e._options.disableInteraction),
            (r[o] = {
              element: t,
              title: t.getAttribute("data-title") || "",
              intro: t.getAttribute("data-intro"),
              step: o + 1,
              tooltipClass: t.getAttribute("data-tooltip-class"),
              highlightClass: t.getAttribute("data-highlight-class"),
              position:
                t.getAttribute("data-position") || e._options.tooltipPosition,
              scrollTo: t.getAttribute("data-scroll-to") || e._options.scrollTo,
              disableInteraction: i,
            });
        }
      });
    }
    for (var a = [], s = 0; s < r.length; s++) r[s] && a.push(r[s]);
    return (
      (r = a).sort(function (t, e) {
        return t.step - e.step;
      }),
      r
    );
  }
  function gt(t) {
    var e = document.querySelector(".introjs-tooltipReferenceLayer"),
      n = document.querySelector(".introjs-helperLayer"),
      r = document.querySelector(".introjs-disableInteraction");
    if (
      (k.call(this, n),
      k.call(this, e),
      k.call(this, r),
      t &&
        ((this._introItems = yt.call(this, this._targetElement)),
        O.call(this, this._introItems[this._currentStep]),
        R.call(this, e)),
      void 0 !== this._currentStep && null !== this._currentStep)
    ) {
      var i = document.querySelector(".introjs-arrow"),
        o = document.querySelector(".introjs-tooltip");
      o && i && E.call(this, this._introItems[this._currentStep].element, o, i);
    }
    return vt.call(this), this;
  }
  function wt() {
    gt.call(this);
  }
  function _t(t) {
    var e = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
    if (t && t.parentElement) {
      var n = t.parentElement;
      e
        ? (x(t, { opacity: "0" }),
          window.setTimeout(function () {
            try {
              n.removeChild(t);
            } catch (t) {}
          }, 500))
        : n.removeChild(t);
    }
  }
  function xt(t, e) {
    return kt.apply(this, arguments);
  }
  function kt() {
    return (kt = r(
      t().mark(function e(n, r) {
        var i, o;
        return t().wrap(
          function (t) {
            for (;;)
              switch ((t.prev = t.next)) {
                case 0:
                  if (((i = !0), void 0 === this._introBeforeExitCallback)) {
                    t.next = 5;
                    break;
                  }
                  return (t.next = 4), this._introBeforeExitCallback.call(this);
                case 4:
                  i = t.sent;
                case 5:
                  if (r || !1 !== i) {
                    t.next = 7;
                    break;
                  }
                  return t.abrupt("return");
                case 7:
                  if (
                    ((o = Array.from(n.querySelectorAll(".introjs-overlay"))) &&
                      o.length &&
                      u(o, function (t) {
                        return _t(t);
                      }),
                    _t(n.querySelector(".introjs-helperLayer"), !0),
                    _t(n.querySelector(".introjs-tooltipReferenceLayer")),
                    _t(n.querySelector(".introjs-disableInteraction")),
                    _t(document.querySelector(".introjsFloatingElement")),
                    N(),
                    h.off(window, "keydown", X, this, !0),
                    h.off(window, "resize", wt, this, !0),
                    void 0 === this._introExitCallback)
                  ) {
                    t.next = 23;
                    break;
                  }
                  return (t.next = 23), this._introExitCallback.call(this);
                case 23:
                  this._currentStep = void 0;
                case 24:
                case "end":
                  return t.stop();
              }
          },
          e,
          this
        );
      })
    )).apply(this, arguments);
  }
  function Ct(e) {
    var n = this,
      i = L("div", { className: "introjs-overlay" });
    return (
      x(i, { top: 0, bottom: 0, left: 0, right: 0, position: "fixed" }),
      e.appendChild(i),
      !0 === this._options.exitOnOverlayClick &&
        (x(i, { cursor: "pointer" }),
        (i.onclick = r(
          t().mark(function r() {
            return t().wrap(function (t) {
              for (;;)
                switch ((t.prev = t.next)) {
                  case 0:
                    return (t.next = 2), xt.call(n, e);
                  case 2:
                  case "end":
                    return t.stop();
                }
            }, r);
          })
        ))),
      !0
    );
  }
  function St(t) {
    return jt.apply(this, arguments);
  }
  function jt() {
    return (jt = r(
      t().mark(function e(n) {
        var r;
        return t().wrap(
          function (t) {
            for (;;)
              switch ((t.prev = t.next)) {
                case 0:
                  if (this.isActive()) {
                    t.next = 2;
                    break;
                  }
                  return t.abrupt("return", !1);
                case 2:
                  if (void 0 === this._introStartCallback) {
                    t.next = 5;
                    break;
                  }
                  return (t.next = 5), this._introStartCallback.call(this, n);
                case 5:
                  if (0 !== (r = yt.call(this, n)).length) {
                    t.next = 8;
                    break;
                  }
                  return t.abrupt("return", !1);
                case 8:
                  if (((this._introItems = r), !Ct.call(this, n))) {
                    t.next = 14;
                    break;
                  }
                  return (t.next = 12), W.call(this);
                case 12:
                  this._options.keyboardNavigation &&
                    h.on(window, "keydown", X, this, !0),
                    h.on(window, "resize", wt, this, !0);
                case 14:
                  return t.abrupt("return", !1);
                case 15:
                case "end":
                  return t.stop();
              }
          },
          e,
          this
        );
      })
    )).apply(this, arguments);
  }
  function At(t, e, n) {
    var r,
      i = (o((r = {}), t, e), o(r, "path", "/"), o(r, "expires", void 0), r);
    if (n) {
      var a = new Date();
      a.setTime(a.getTime() + 24 * n * 60 * 60 * 1e3),
        (i.expires = a.toUTCString());
    }
    var s = [];
    for (var l in i) s.push("".concat(l, "=").concat(i[l]));
    return (document.cookie = s.join("; ")), Et(t);
  }
  function Et(t) {
    return ((e = {}),
    document.cookie.split(";").forEach(function (t) {
      var n = a(t.split("="), 2),
        r = n[0],
        i = n[1];
      e[r.trim()] = i;
    }),
    e)[t];
    var e;
  }
  var Nt = "true";
  function Lt(t) {
    t
      ? At(
          this._options.dontShowAgainCookie,
          Nt,
          this._options.dontShowAgainCookieDays
        )
      : At(this._options.dontShowAgainCookie, "", -1);
  }
  function Tt() {
    var t = Et(this._options.dontShowAgainCookie);
    return t && t === Nt;
  }
  var It = (function () {
      function e(t) {
        !(function (t, e) {
          if (!(t instanceof e))
            throw new TypeError("Cannot call a class as a function");
        })(this, e),
          o(this, "_targetElement", void 0),
          o(this, "_introItems", []),
          o(this, "_options", void 0),
          o(this, "_introBeforeChangeCallback", void 0),
          o(this, "_introChangeCallback", void 0),
          o(this, "_introAfterChangeCallback", void 0),
          o(this, "_introCompleteCallback", void 0),
          o(this, "_hintsAddedCallback", void 0),
          o(this, "_hintClickCallback", void 0),
          o(this, "_hintCloseCallback", void 0),
          o(this, "_introStartCallback", void 0),
          o(this, "_introExitCallback", void 0),
          o(this, "_introSkipCallback", void 0),
          o(this, "_introBeforeExitCallback", void 0),
          (this._targetElement = t),
          (this._options = {
            isActive: !0,
            nextLabel: "Next",
            prevLabel: "Back",
            skipLabel: "×",
            doneLabel: "Done",
            hidePrev: !1,
            hideNext: !1,
            nextToDone: !0,
            tooltipPosition: "bottom",
            tooltipClass: "",
            group: "",
            highlightClass: "",
            exitOnEsc: !0,
            exitOnOverlayClick: !0,
            showStepNumbers: !1,
            stepNumbersOfLabel: "of",
            keyboardNavigation: !0,
            showButtons: !0,
            showBullets: !0,
            showProgress: !1,
            scrollToElement: !0,
            scrollTo: "element",
            scrollPadding: 30,
            overlayOpacity: 0.5,
            autoPosition: !0,
            positionPrecedence: ["bottom", "top", "right", "left"],
            disableInteraction: !1,
            dontShowAgain: !1,
            dontShowAgainLabel: "Don't show this again",
            dontShowAgainCookie: "introjs-dontShowAgain",
            dontShowAgainCookieDays: 365,
            helperElementPadding: 10,
            hintPosition: "top-middle",
            hintButtonLabel: "Got it",
            hintShowButton: !0,
            hintAutoRefreshInterval: 10,
            hintAnimation: !0,
            buttonClass: "introjs-button",
            progressBarAdditionalClass: !1,
          });
      }
      var n, a, s, l, c, u, h, p, f, d, m, b, v;
      return (
        (n = e),
        (a = [
          {
            key: "isActive",
            value: function () {
              return (
                (!this._options.dontShowAgain || !Tt.call(this)) &&
                this._options.isActive
              );
            },
          },
          {
            key: "clone",
            value: function () {
              return new e(this._targetElement);
            },
          },
          {
            key: "setOption",
            value: function (t, e) {
              return (this._options[t] = e), this;
            },
          },
          {
            key: "setOptions",
            value: function (t) {
              return (
                (this._options = (function (t, e) {
                  var n,
                    r = {};
                  for (n in t) r[n] = t[n];
                  for (n in e) r[n] = e[n];
                  return r;
                })(this._options, t)),
                this
              );
            },
          },
          {
            key: "start",
            value:
              ((v = r(
                t().mark(function e() {
                  return t().wrap(
                    function (t) {
                      for (;;)
                        switch ((t.prev = t.next)) {
                          case 0:
                            return (
                              (t.next = 2), St.call(this, this._targetElement)
                            );
                          case 2:
                            return t.abrupt("return", this);
                          case 3:
                          case "end":
                            return t.stop();
                        }
                    },
                    e,
                    this
                  );
                })
              )),
              function () {
                return v.apply(this, arguments);
              }),
          },
          {
            key: "goToStep",
            value:
              ((b = r(
                t().mark(function e(n) {
                  return t().wrap(
                    function (t) {
                      for (;;)
                        switch ((t.prev = t.next)) {
                          case 0:
                            return (t.next = 2), D.call(this, n);
                          case 2:
                            return t.abrupt("return", this);
                          case 3:
                          case "end":
                            return t.stop();
                        }
                    },
                    e,
                    this
                  );
                })
              )),
              function (t) {
                return b.apply(this, arguments);
              }),
          },
          {
            key: "addStep",
            value: function (t) {
              return (
                this._options.steps || (this._options.steps = []),
                this._options.steps.push(t),
                this
              );
            },
          },
          {
            key: "addSteps",
            value: function (t) {
              if (!t.length) return this;
              for (var e = 0; e < t.length; e++) this.addStep(t[e]);
              return this;
            },
          },
          {
            key: "goToStepNumber",
            value:
              ((m = r(
                t().mark(function e(n) {
                  return t().wrap(
                    function (t) {
                      for (;;)
                        switch ((t.prev = t.next)) {
                          case 0:
                            return (t.next = 2), V.call(this, n);
                          case 2:
                            return t.abrupt("return", this);
                          case 3:
                          case "end":
                            return t.stop();
                        }
                    },
                    e,
                    this
                  );
                })
              )),
              function (t) {
                return m.apply(this, arguments);
              }),
          },
          {
            key: "nextStep",
            value:
              ((d = r(
                t().mark(function e() {
                  return t().wrap(
                    function (t) {
                      for (;;)
                        switch ((t.prev = t.next)) {
                          case 0:
                            return (t.next = 2), W.call(this);
                          case 2:
                            return t.abrupt("return", this);
                          case 3:
                          case "end":
                            return t.stop();
                        }
                    },
                    e,
                    this
                  );
                })
              )),
              function () {
                return d.apply(this, arguments);
              }),
          },
          {
            key: "previousStep",
            value:
              ((f = r(
                t().mark(function e() {
                  return t().wrap(
                    function (t) {
                      for (;;)
                        switch ((t.prev = t.next)) {
                          case 0:
                            return (t.next = 2), $.call(this);
                          case 2:
                            return t.abrupt("return", this);
                          case 3:
                          case "end":
                            return t.stop();
                        }
                    },
                    e,
                    this
                  );
                })
              )),
              function () {
                return f.apply(this, arguments);
              }),
          },
          {
            key: "currentStep",
            value: function () {
              return U.call(this);
            },
          },
          {
            key: "exit",
            value:
              ((p = r(
                t().mark(function e(n) {
                  return t().wrap(
                    function (t) {
                      for (;;)
                        switch ((t.prev = t.next)) {
                          case 0:
                            return (
                              (t.next = 2),
                              xt.call(this, this._targetElement, n)
                            );
                          case 2:
                            return t.abrupt("return", this);
                          case 3:
                          case "end":
                            return t.stop();
                        }
                    },
                    e,
                    this
                  );
                })
              )),
              function (t) {
                return p.apply(this, arguments);
              }),
          },
          {
            key: "refresh",
            value: function (t) {
              return gt.call(this, t), this;
            },
          },
          {
            key: "setDontShowAgain",
            value: function (t) {
              return Lt.call(this, t), this;
            },
          },
          {
            key: "onbeforechange",
            value: function (t) {
              if ("function" != typeof t)
                throw new Error(
                  "Provided callback for onbeforechange was not a function"
                );
              return (this._introBeforeChangeCallback = t), this;
            },
          },
          {
            key: "onchange",
            value: function (t) {
              if ("function" != typeof t)
                throw new Error(
                  "Provided callback for onchange was not a function."
                );
              return (this._introChangeCallback = t), this;
            },
          },
          {
            key: "onafterchange",
            value: function (t) {
              if ("function" != typeof t)
                throw new Error(
                  "Provided callback for onafterchange was not a function"
                );
              return (this._introAfterChangeCallback = t), this;
            },
          },
          {
            key: "oncomplete",
            value: function (t) {
              if ("function" != typeof t)
                throw new Error(
                  "Provided callback for oncomplete was not a function."
                );
              return (this._introCompleteCallback = t), this;
            },
          },
          {
            key: "onhintsadded",
            value: function (t) {
              if ("function" != typeof t)
                throw new Error(
                  "Provided callback for onhintsadded was not a function."
                );
              return (this._hintsAddedCallback = t), this;
            },
          },
          {
            key: "onhintclick",
            value: function (t) {
              if ("function" != typeof t)
                throw new Error(
                  "Provided callback for onhintclick was not a function."
                );
              return (this._hintClickCallback = t), this;
            },
          },
          {
            key: "onhintclose",
            value: function (t) {
              if ("function" != typeof t)
                throw new Error(
                  "Provided callback for onhintclose was not a function."
                );
              return (this._hintCloseCallback = t), this;
            },
          },
          {
            key: "onstart",
            value: function (t) {
              if ("function" != typeof t)
                throw new Error(
                  "Provided callback for onstart was not a function."
                );
              return (this._introStartCallback = t), this;
            },
          },
          {
            key: "onexit",
            value: function (t) {
              if ("function" != typeof t)
                throw new Error(
                  "Provided callback for onexit was not a function."
                );
              return (this._introExitCallback = t), this;
            },
          },
          {
            key: "onskip",
            value: function (t) {
              if ("function" != typeof t)
                throw new Error(
                  "Provided callback for onskip was not a function."
                );
              return (this._introSkipCallback = t), this;
            },
          },
          {
            key: "onbeforeexit",
            value: function (t) {
              if ("function" != typeof t)
                throw new Error(
                  "Provided callback for onbeforeexit was not a function."
                );
              return (this._introBeforeExitCallback = t), this;
            },
          },
          {
            key: "addHints",
            value: (function () {
              var e = r(
                t().mark(function e() {
                  return t().wrap(
                    function (t) {
                      for (;;)
                        switch ((t.prev = t.next)) {
                          case 0:
                            return (
                              (t.next = 2), mt.call(this, this._targetElement)
                            );
                          case 2:
                            return t.abrupt("return", this);
                          case 3:
                          case "end":
                            return t.stop();
                        }
                    },
                    e,
                    this
                  );
                })
              );
              return function () {
                return e.apply(this, arguments);
              };
            })(),
          },
          {
            key: "hideHint",
            value:
              ((h = r(
                t().mark(function e(n) {
                  return t().wrap(
                    function (t) {
                      for (;;)
                        switch ((t.prev = t.next)) {
                          case 0:
                            return (t.next = 2), et.call(this, n);
                          case 2:
                            return t.abrupt("return", this);
                          case 3:
                          case "end":
                            return t.stop();
                        }
                    },
                    e,
                    this
                  );
                })
              )),
              function (t) {
                return h.apply(this, arguments);
              }),
          },
          {
            key: "hideHints",
            value:
              ((u = r(
                t().mark(function e() {
                  return t().wrap(
                    function (t) {
                      for (;;)
                        switch ((t.prev = t.next)) {
                          case 0:
                            return (t.next = 2), rt.call(this);
                          case 2:
                            return t.abrupt("return", this);
                          case 3:
                          case "end":
                            return t.stop();
                        }
                    },
                    e,
                    this
                  );
                })
              )),
              function () {
                return u.apply(this, arguments);
              }),
          },
          {
            key: "showHint",
            value: function (t) {
              return at.call(this, t), this;
            },
          },
          {
            key: "showHints",
            value:
              ((c = r(
                t().mark(function e() {
                  return t().wrap(
                    function (t) {
                      for (;;)
                        switch ((t.prev = t.next)) {
                          case 0:
                            return (t.next = 2), it.call(this);
                          case 2:
                            return t.abrupt("return", this);
                          case 3:
                          case "end":
                            return t.stop();
                        }
                    },
                    e,
                    this
                  );
                })
              )),
              function () {
                return c.apply(this, arguments);
              }),
          },
          {
            key: "removeHints",
            value: function () {
              return st.call(this), this;
            },
          },
          {
            key: "removeHint",
            value: function (t) {
              return lt.call(this, t), this;
            },
          },
          {
            key: "showHintDialog",
            value:
              ((l = r(
                t().mark(function e(n) {
                  return t().wrap(
                    function (t) {
                      for (;;)
                        switch ((t.prev = t.next)) {
                          case 0:
                            return (t.next = 2), pt.call(this, n);
                          case 2:
                            return t.abrupt("return", this);
                          case 3:
                          case "end":
                            return t.stop();
                        }
                    },
                    e,
                    this
                  );
                })
              )),
              function (t) {
                return l.apply(this, arguments);
              }),
          },
        ]),
        a && i(n.prototype, a),
        s && i(n, s),
        Object.defineProperty(n, "prototype", { writable: !1 }),
        e
      );
    })(),
    Pt = function t(n) {
      var r;
      if ("object" === e(n)) r = new It(n);
      else if ("string" == typeof n) {
        var i = document.querySelector(n);
        if (!i) throw new Error("There is no element with given selector.");
        r = new It(i);
      } else r = new It(document.body);
      return (t.instances[c(r, "introjs-instance")] = r), r;
    };
  return (Pt.version = "7.0.1"), (Pt.instances = {}), Pt;
});
//# sourceMappingURL=intro.js.map
