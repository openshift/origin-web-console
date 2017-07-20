!function(t, r) {
"function" == typeof define && define.amd ? define(r) : "object" == typeof exports ? module.exports = r() : t.returnExports = r();
}(this, function() {
function t() {}
function r(t) {
return (t = +t) !== t ? t = 0 : 0 !== t && t !== 1 / 0 && t !== -1 / 0 && (t = (t > 0 || -1) * Math.floor(Math.abs(t))), t;
}
function e(t) {
var r = typeof t;
return null === t || "undefined" === r || "boolean" === r || "number" === r || "string" === r;
}
function n(t) {
var r, n, o;
if (e(t)) return t;
if (n = t.valueOf, s(n) && (r = n.call(t), e(r))) return r;
if (o = t.toString, s(o) && (r = o.call(t), e(r))) return r;
throw new TypeError();
}
var o = Function.prototype.call, i = Array.prototype, a = Object.prototype, l = i.slice, c = Array.prototype.splice, u = Array.prototype.push, f = Array.prototype.unshift, s = function(t) {
return "[object Function]" === a.toString.call(t);
}, p = function(t) {
return "[object RegExp]" === a.toString.call(t);
};
Function.prototype.bind || (Function.prototype.bind = function(r) {
var e = this;
if (!s(e)) throw new TypeError("Function.prototype.bind called on incompatible " + e);
for (var n = l.call(arguments, 1), o = Math.max(0, e.length - n.length), i = [], a = 0; a < o; a++) i.push("$" + a);
var c = Function("binder", "return function(" + i.join(",") + "){return binder.apply(this,arguments)}")(function() {
if (this instanceof c) {
var t = e.apply(this, n.concat(l.call(arguments)));
return Object(t) === t ? t : this;
}
return e.apply(r, n.concat(l.call(arguments)));
});
return e.prototype && (t.prototype = e.prototype, c.prototype = new t(), t.prototype = null), c;
});
var h = o.bind(a.hasOwnProperty), y = o.bind(a.toString);
h(a, "__defineGetter__") && (o.bind(a.__defineGetter__), o.bind(a.__defineSetter__), o.bind(a.__lookupGetter__), o.bind(a.__lookupSetter__)), 2 !== [ 1, 2 ].splice(0).length && (!function() {
function t(t) {
for (var r = []; t--; ) r.unshift(t);
return r;
}
var r, e = [];
if (e.splice.bind(e, 0, 0).apply(null, t(20)), e.splice.bind(e, 0, 0).apply(null, t(26)), r = e.length, e.splice(5, 0, "XXX"), r + 1 === e.length) return !0;
}() ? Array.prototype.splice = function(t, r) {
var e, n = l.call(arguments, 2), o = n.length;
if (!arguments.length) return [];
if (void 0 === t && (t = 0), void 0 === r && (r = this.length - t), o > 0) {
if (r <= 0) {
if (t === this.length) return u.apply(this, n), [];
if (0 === t) return f.apply(this, n), [];
}
return e = l.call(this, t, t + r), n.push.apply(n, l.call(this, t + r, this.length)), n.unshift.apply(n, l.call(this, 0, t)), n.unshift(0, this.length), c.apply(this, n), e;
}
return c.call(this, t, r);
} : Array.prototype.splice = function(t, r) {
return arguments.length ? c.apply(this, [ void 0 === t ? 0 : t, void 0 === r ? this.length - t : r ].concat(l.call(arguments, 2))) : [];
}), 1 !== [].unshift(0) && (Array.prototype.unshift = function() {
return f.apply(this, arguments), this.length;
}), Array.isArray || (Array.isArray = function(t) {
return "[object Array]" === y(t);
});
var g = Object("a"), b = "a" !== g[0] || !(0 in g), v = function(t) {
var r = !0;
return t && t.call("foo", function(t, e, n) {
"object" != typeof n && (r = !1);
}), !!t && r;
};
Array.prototype.forEach && v(Array.prototype.forEach) || (Array.prototype.forEach = function(t) {
var r = F(this), e = b && "[object String]" === y(this) ? this.split("") : r, n = arguments[1], o = -1, i = e.length >>> 0;
if (!s(t)) throw new TypeError();
for (;++o < i; ) o in e && t.call(n, e[o], o, r);
}), Array.prototype.map && v(Array.prototype.map) || (Array.prototype.map = function(t) {
var r = F(this), e = b && "[object String]" === y(this) ? this.split("") : r, n = e.length >>> 0, o = Array(n), i = arguments[1];
if (!s(t)) throw new TypeError(t + " is not a function");
for (var a = 0; a < n; a++) a in e && (o[a] = t.call(i, e[a], a, r));
return o;
}), Array.prototype.filter && v(Array.prototype.filter) || (Array.prototype.filter = function(t) {
var r, e = F(this), n = b && "[object String]" === y(this) ? this.split("") : e, o = n.length >>> 0, i = [], a = arguments[1];
if (!s(t)) throw new TypeError(t + " is not a function");
for (var l = 0; l < o; l++) l in n && (r = n[l], t.call(a, r, l, e) && i.push(r));
return i;
}), Array.prototype.every && v(Array.prototype.every) || (Array.prototype.every = function(t) {
var r = F(this), e = b && "[object String]" === y(this) ? this.split("") : r, n = e.length >>> 0, o = arguments[1];
if (!s(t)) throw new TypeError(t + " is not a function");
for (var i = 0; i < n; i++) if (i in e && !t.call(o, e[i], i, r)) return !1;
return !0;
}), Array.prototype.some && v(Array.prototype.some) || (Array.prototype.some = function(t) {
var r = F(this), e = b && "[object String]" === y(this) ? this.split("") : r, n = e.length >>> 0, o = arguments[1];
if (!s(t)) throw new TypeError(t + " is not a function");
for (var i = 0; i < n; i++) if (i in e && t.call(o, e[i], i, r)) return !0;
return !1;
});
var d = !1;
if (Array.prototype.reduce && (d = "object" == typeof Array.prototype.reduce.call("a", function(t, r, e, n) {
return n;
})), Array.prototype.reduce && d || (Array.prototype.reduce = function(t) {
var r = F(this), e = b && "[object String]" === y(this) ? this.split("") : r, n = e.length >>> 0;
if (!s(t)) throw new TypeError(t + " is not a function");
if (!n && 1 === arguments.length) throw new TypeError("reduce of empty array with no initial value");
var o, i = 0;
if (arguments.length >= 2) o = arguments[1]; else for (;;) {
if (i in e) {
o = e[i++];
break;
}
if (++i >= n) throw new TypeError("reduce of empty array with no initial value");
}
for (;i < n; i++) i in e && (o = t.call(void 0, o, e[i], i, r));
return o;
}), Array.prototype.reduceRight || (Array.prototype.reduceRight = function(t) {
var r = F(this), e = b && "[object String]" === y(this) ? this.split("") : r, n = e.length >>> 0;
if (!s(t)) throw new TypeError(t + " is not a function");
if (!n && 1 === arguments.length) throw new TypeError("reduceRight of empty array with no initial value");
var o, i = n - 1;
if (arguments.length >= 2) o = arguments[1]; else for (;;) {
if (i in e) {
o = e[i--];
break;
}
if (--i < 0) throw new TypeError("reduceRight of empty array with no initial value");
}
if (i < 0) return o;
do {
i in this && (o = t.call(void 0, o, e[i], i, r));
} while (i--);
return o;
}), Array.prototype.indexOf && -1 === [ 0, 1 ].indexOf(1, 2) || (Array.prototype.indexOf = function(t) {
var e = b && "[object String]" === y(this) ? this.split("") : F(this), n = e.length >>> 0;
if (!n) return -1;
var o = 0;
for (arguments.length > 1 && (o = r(arguments[1])), o = o >= 0 ? o : Math.max(0, n + o); o < n; o++) if (o in e && e[o] === t) return o;
return -1;
}), Array.prototype.lastIndexOf && -1 === [ 0, 1 ].lastIndexOf(0, -3) || (Array.prototype.lastIndexOf = function(t) {
var e = b && "[object String]" === y(this) ? this.split("") : F(this), n = e.length >>> 0;
if (!n) return -1;
var o = n - 1;
for (arguments.length > 1 && (o = Math.min(o, r(arguments[1]))), o = o >= 0 ? o : n - Math.abs(o); o >= 0; o--) if (o in e && t === e[o]) return o;
return -1;
}), !Object.keys) {
var w = !{
toString: null
}.propertyIsEnumerable("toString"), S = function() {}.propertyIsEnumerable("prototype"), j = [ "toString", "toLocaleString", "valueOf", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "constructor" ], A = j.length, m = function(t) {
var r = y(t), e = "[object Arguments]" === r;
return e || (e = !Array.isArray(r) && null !== t && "object" == typeof t && "number" == typeof t.length && t.length >= 0 && s(t.callee)), e;
};
Object.keys = function(t) {
var r = s(t), e = m(t), n = null !== t && "object" == typeof t, o = n && "[object String]" === y(t);
if (!n && !r && !e) throw new TypeError("Object.keys called on a non-object");
var i = [], a = S && r;
if (o || e) for (var l = 0; l < t.length; ++l) i.push(String(l)); else for (var c in t) a && "prototype" === c || !h(t, c) || i.push(String(c));
if (w) for (var u = t.constructor, f = u && u.prototype === t, p = 0; p < A; p++) {
var g = j[p];
f && "constructor" === g || !h(t, g) || i.push(g);
}
return i;
};
}
Date.prototype.toISOString && -1 !== new Date(-621987552e5).toISOString().indexOf("-000001") || (Date.prototype.toISOString = function() {
var t, r, e, n, o;
if (!isFinite(this)) throw new RangeError("Date.prototype.toISOString called on non-finite value.");
for (n = this.getUTCFullYear(), o = this.getUTCMonth(), n += Math.floor(o / 12), t = [ (o = (o % 12 + 12) % 12) + 1, this.getUTCDate(), this.getUTCHours(), this.getUTCMinutes(), this.getUTCSeconds() ], n = (n < 0 ? "-" : n > 9999 ? "+" : "") + ("00000" + Math.abs(n)).slice(0 <= n && n <= 9999 ? -4 : -6), r = t.length; r--; ) (e = t[r]) < 10 && (t[r] = "0" + e);
return n + "-" + t.slice(0, 2).join("-") + "T" + t.slice(2).join(":") + "." + ("000" + this.getUTCMilliseconds()).slice(-3) + "Z";
});
var O = !1;
try {
O = Date.prototype.toJSON && null === new Date(NaN).toJSON() && -1 !== new Date(-621987552e5).toJSON().indexOf("-000001") && Date.prototype.toJSON.call({
toISOString: function() {
return !0;
}
});
} catch (t) {}
O || (Date.prototype.toJSON = function(t) {
var r, e = Object(this), o = n(e);
if ("number" == typeof o && !isFinite(o)) return null;
if ("function" != typeof (r = e.toISOString)) throw new TypeError("toISOString property is not callable");
return r.call(e);
});
var x = 1e15 === Date.parse("+033658-09-27T01:46:40.000Z"), T = !isNaN(Date.parse("2012-04-04T24:00:00.500Z")) || !isNaN(Date.parse("2012-11-31T23:59:59.000Z")), N = isNaN(Date.parse("2000-01-01T00:00:00.000Z"));
Date.parse && !N && !T && x || (Date = function(t) {
function r(e, n, o, i, a, l, c) {
var u = arguments.length;
if (this instanceof t) {
var f = 1 === u && String(e) === e ? new t(r.parse(e)) : u >= 7 ? new t(e, n, o, i, a, l, c) : u >= 6 ? new t(e, n, o, i, a, l) : u >= 5 ? new t(e, n, o, i, a) : u >= 4 ? new t(e, n, o, i) : u >= 3 ? new t(e, n, o) : u >= 2 ? new t(e, n) : u >= 1 ? new t(e) : new t();
return f.constructor = r, f;
}
return t.apply(this, arguments);
}
function e(t, r) {
var e = r > 1 ? 1 : 0;
return i[r] + Math.floor((t - 1969 + e) / 4) - Math.floor((t - 1901 + e) / 100) + Math.floor((t - 1601 + e) / 400) + 365 * (t - 1970);
}
function n(r) {
return Number(new t(1970, 0, 1, 0, 0, 0, r));
}
var o = new RegExp("^(\\d{4}|[+-]\\d{6})(?:-(\\d{2})(?:-(\\d{2})(?:T(\\d{2}):(\\d{2})(?::(\\d{2})(?:(\\.\\d{1,}))?)?(Z|(?:([-+])(\\d{2}):(\\d{2})))?)?)?)?$"), i = [ 0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365 ];
for (var a in t) r[a] = t[a];
return r.now = t.now, r.UTC = t.UTC, r.prototype = t.prototype, r.prototype.constructor = r, r.parse = function(r) {
var i = o.exec(r);
if (i) {
var a, l = Number(i[1]), c = Number(i[2] || 1) - 1, u = Number(i[3] || 1) - 1, f = Number(i[4] || 0), s = Number(i[5] || 0), p = Number(i[6] || 0), h = Math.floor(1e3 * Number(i[7] || 0)), y = Boolean(i[4] && !i[8]), g = "-" === i[9] ? 1 : -1, b = Number(i[10] || 0), v = Number(i[11] || 0);
return f < (s > 0 || p > 0 || h > 0 ? 24 : 25) && s < 60 && p < 60 && h < 1e3 && c > -1 && c < 12 && b < 24 && v < 60 && u > -1 && u < e(l, c + 1) - e(l, c) && (a = 60 * (24 * (e(l, c) + u) + f + b * g), a = 1e3 * (60 * (a + s + v * g) + p) + h, y && (a = n(a)), -864e13 <= a && a <= 864e13) ? a : NaN;
}
return t.parse.apply(this, arguments);
}, r;
}(Date)), Date.now || (Date.now = function() {
return new Date().getTime();
}), Number.prototype.toFixed && "0.000" === 8e-5.toFixed(3) && "0" !== .9.toFixed(0) && "1.25" === 1.255.toFixed(2) && "1000000000000000128" === (0xde0b6b3a7640080).toFixed(0) || function() {
function t(t, r) {
for (var e = -1; ++e < a; ) r += t * l[e], l[e] = r % i, r = Math.floor(r / i);
}
function r(t) {
for (var r = a, e = 0; --r >= 0; ) e += l[r], l[r] = Math.floor(e / t), e = e % t * i;
}
function e() {
for (var t = a, r = ""; --t >= 0; ) if ("" !== r || 0 === t || 0 !== l[t]) {
var e = String(l[t]);
"" === r ? r = e : r += "0000000".slice(0, 7 - e.length) + e;
}
return r;
}
function n(t, r, e) {
return 0 === r ? e : r % 2 == 1 ? n(t, r - 1, e * t) : n(t * t, r / 2, e);
}
function o(t) {
for (var r = 0; t >= 4096; ) r += 12, t /= 4096;
for (;t >= 2; ) r += 1, t /= 2;
return r;
}
var i, a, l;
i = 1e7, a = 6, l = [ 0, 0, 0, 0, 0, 0 ], Number.prototype.toFixed = function(i) {
var a, l, c, u, f, s, p, h;
if (a = Number(i), (a = a !== a ? 0 : Math.floor(a)) < 0 || a > 20) throw new RangeError("Number.toFixed called with invalid number of decimals");
if ((l = Number(this)) !== l) return "NaN";
if (l <= -1e21 || l >= 1e21) return String(l);
if (c = "", l < 0 && (c = "-", l = -l), u = "0", l > 1e-21) if (f = o(l * n(2, 69, 1)) - 69, s = f < 0 ? l * n(2, -f, 1) : l / n(2, f, 1), s *= 4503599627370496, (f = 52 - f) > 0) {
for (t(0, s), p = a; p >= 7; ) t(1e7, 0), p -= 7;
for (t(n(10, p, 1), 0), p = f - 1; p >= 23; ) r(1 << 23), p -= 23;
r(1 << p), t(1, 1), r(2), u = e();
} else t(0, s), t(1 << -f, 0), u = e() + "0.00000000000000000000".slice(2, 2 + a);
return u = a > 0 ? (h = u.length) <= a ? c + "0.0000000000000000000".slice(0, a - h + 2) + u : c + u.slice(0, h - a) + "." + u.slice(h - a) : c + u;
};
}();
var C = String.prototype.split;
2 !== "ab".split(/(?:ab)*/).length || 4 !== ".".split(/(.?)(.?)/).length || "t" === "tesst".split(/(s)*/)[1] || "".split(/.?/).length || ".".split(/()()/).length > 1 ? function() {
var t = void 0 === /()??/.exec("")[1];
String.prototype.split = function(r, e) {
var n = this;
if (void 0 === r && 0 === e) return [];
if ("[object RegExp]" !== Object.prototype.toString.call(r)) return C.apply(this, arguments);
var o, i, a, l, c = [], u = (r.ignoreCase ? "i" : "") + (r.multiline ? "m" : "") + (r.extended ? "x" : "") + (r.sticky ? "y" : ""), f = 0;
for (r = new RegExp(r.source, u + "g"), n += "", t || (o = new RegExp("^" + r.source + "$(?!\\s)", u)), e = void 0 === e ? -1 >>> 0 : e >>> 0; (i = r.exec(n)) && !((a = i.index + i[0].length) > f && (c.push(n.slice(f, i.index)), !t && i.length > 1 && i[0].replace(o, function() {
for (var t = 1; t < arguments.length - 2; t++) void 0 === arguments[t] && (i[t] = void 0);
}), i.length > 1 && i.index < n.length && Array.prototype.push.apply(c, i.slice(1)), l = i[0].length, f = a, c.length >= e)); ) r.lastIndex === i.index && r.lastIndex++;
return f === n.length ? !l && r.test("") || c.push("") : c.push(n.slice(f)), c.length > e ? c.slice(0, e) : c;
};
}() : "0".split(void 0, 0).length && (String.prototype.split = function(t, r) {
return void 0 === t && 0 === r ? [] : C.apply(this, arguments);
});
var _ = String.prototype.replace;
if (function() {
var t = [];
return "x".replace(/x(.)?/g, function(r, e) {
t.push(e);
}), 1 === t.length && void 0 === t[0];
}() || (String.prototype.replace = function(t, r) {
var e = s(r), n = p(t) && /\)[*?]/.test(t.source);
if (e && n) {
return _.call(this, t, function(e) {
var n = arguments.length, o = t.lastIndex;
t.lastIndex = 0;
var i = t.exec(e);
return t.lastIndex = o, i.push(arguments[n - 2], arguments[n - 1]), r.apply(this, i);
});
}
return _.apply(this, arguments);
}), "".substr && "b" !== "0b".substr(-1)) {
var E = String.prototype.substr;
String.prototype.substr = function(t, r) {
return E.call(this, t < 0 && (t = this.length + t) < 0 ? 0 : t, r);
};
}
var M = "\t\n\v\f\r   ᠎             　\u2028\u2029\ufeff";
if (!String.prototype.trim || M.trim() || !"​".trim()) {
M = "[" + M + "]";
var D = new RegExp("^" + M + M + "*"), I = new RegExp(M + M + "*$");
String.prototype.trim = function() {
if (void 0 === this || null === this) throw new TypeError("can't convert " + this + " to object");
return String(this).replace(D, "").replace(I, "");
};
}
8 === parseInt(M + "08") && 22 === parseInt(M + "0x16") || (parseInt = function(t) {
var r = /^0[xX]/;
return function(e, n) {
return e = String(e).trim(), Number(n) || (n = r.test(e) ? 16 : 10), t(e, n);
};
}(parseInt));
var F = function(t) {
if (null == t) throw new TypeError("can't convert " + t + " to object");
return Object(t);
};
}), function() {
function t(r, n) {
function i(t) {
if (i[t] !== b) return i[t];
var r;
if ("bug-string-char-index" == t) r = "a" != "a"[0]; else if ("json" == t) r = i("json-stringify") && i("json-parse"); else {
var e, o = '{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}';
if ("json-stringify" == t) {
var c = n.stringify, f = "function" == typeof c && w;
if (f) {
(e = function() {
return 1;
}).toJSON = e;
try {
f = "0" === c(0) && "0" === c(new a()) && '""' == c(new l()) && c(d) === b && c(b) === b && c() === b && "1" === c(e) && "[1]" == c([ e ]) && "[null]" == c([ b ]) && "null" == c(null) && "[null,null,null]" == c([ b, d, null ]) && c({
a: [ e, !0, !1, null, "\0\b\n\f\r\t" ]
}) == o && "1" === c(null, e) && "[\n 1,\n 2\n]" == c([ 1, 2 ], null, 1) && '"-271821-04-20T00:00:00.000Z"' == c(new u(-864e13)) && '"+275760-09-13T00:00:00.000Z"' == c(new u(864e13)) && '"-000001-01-01T00:00:00.000Z"' == c(new u(-621987552e5)) && '"1969-12-31T23:59:59.999Z"' == c(new u(-1));
} catch (t) {
f = !1;
}
}
r = f;
}
if ("json-parse" == t) {
var s = n.parse;
if ("function" == typeof s) try {
if (0 === s("0") && !s(!1)) {
var p = 5 == (e = s(o)).a.length && 1 === e.a[0];
if (p) {
try {
p = !s('"\t"');
} catch (t) {}
if (p) try {
p = 1 !== s("01");
} catch (t) {}
if (p) try {
p = 1 !== s("1.");
} catch (t) {}
}
}
} catch (t) {
p = !1;
}
r = p;
}
}
return i[t] = !!r;
}
r || (r = o.Object()), n || (n = o.Object());
var a = r.Number || o.Number, l = r.String || o.String, c = r.Object || o.Object, u = r.Date || o.Date, f = r.SyntaxError || o.SyntaxError, s = r.TypeError || o.TypeError, p = r.Math || o.Math, h = r.JSON || o.JSON;
"object" == typeof h && h && (n.stringify = h.stringify, n.parse = h.parse);
var y, g, b, v = c.prototype, d = v.toString, w = new u(-0xc782b5b800cec);
try {
w = -109252 == w.getUTCFullYear() && 0 === w.getUTCMonth() && 1 === w.getUTCDate() && 10 == w.getUTCHours() && 37 == w.getUTCMinutes() && 6 == w.getUTCSeconds() && 708 == w.getUTCMilliseconds();
} catch (t) {}
if (!i("json")) {
var S = i("bug-string-char-index");
if (!w) var j = p.floor, A = [ 0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334 ], m = function(t, r) {
return A[r] + 365 * (t - 1970) + j((t - 1969 + (r = +(r > 1))) / 4) - j((t - 1901 + r) / 100) + j((t - 1601 + r) / 400);
};
if ((y = v.hasOwnProperty) || (y = function(t) {
var r, e = {};
return (e.__proto__ = null, e.__proto__ = {
toString: 1
}, e).toString != d ? y = function(t) {
var r = this.__proto__, e = t in (this.__proto__ = null, this);
return this.__proto__ = r, e;
} : (r = e.constructor, y = function(t) {
var e = (this.constructor || r).prototype;
return t in this && !(t in e && this[t] === e[t]);
}), e = null, y.call(this, t);
}), g = function(t, r) {
var n, o, i, a = 0;
(n = function() {
this.valueOf = 0;
}).prototype.valueOf = 0, o = new n();
for (i in o) y.call(o, i) && a++;
return n = o = null, a ? g = 2 == a ? function(t, r) {
var e, n = {}, o = "[object Function]" == d.call(t);
for (e in t) o && "prototype" == e || y.call(n, e) || !(n[e] = 1) || !y.call(t, e) || r(e);
} : function(t, r) {
var e, n, o = "[object Function]" == d.call(t);
for (e in t) o && "prototype" == e || !y.call(t, e) || (n = "constructor" === e) || r(e);
(n || y.call(t, e = "constructor")) && r(e);
} : (o = [ "valueOf", "toString", "toLocaleString", "propertyIsEnumerable", "isPrototypeOf", "hasOwnProperty", "constructor" ], g = function(t, r) {
var n, i, a = "[object Function]" == d.call(t), l = !a && "function" != typeof t.constructor && e[typeof t.hasOwnProperty] && t.hasOwnProperty || y;
for (n in t) a && "prototype" == n || !l.call(t, n) || r(n);
for (i = o.length; n = o[--i]; l.call(t, n) && r(n)) ;
}), g(t, r);
}, !i("json-stringify")) {
var O = {
92: "\\\\",
34: '\\"',
8: "\\b",
12: "\\f",
10: "\\n",
13: "\\r",
9: "\\t"
}, x = function(t, r) {
return ("000000" + (r || 0)).slice(-t);
}, T = function(t) {
for (var r = '"', e = 0, n = t.length, o = !S || n > 10, i = o && (S ? t.split("") : t); e < n; e++) {
var a = t.charCodeAt(e);
switch (a) {
case 8:
case 9:
case 10:
case 12:
case 13:
case 34:
case 92:
r += O[a];
break;

default:
if (a < 32) {
r += "\\u00" + x(2, a.toString(16));
break;
}
r += o ? i[e] : t.charAt(e);
}
}
return r + '"';
}, N = function(t, r, e, n, o, i, a) {
var l, c, u, f, p, h, v, w, S, A, O, C, _, E, M, D;
try {
l = r[t];
} catch (t) {}
if ("object" == typeof l && l) if ("[object Date]" != (c = d.call(l)) || y.call(l, "toJSON")) "function" == typeof l.toJSON && ("[object Number]" != c && "[object String]" != c && "[object Array]" != c || y.call(l, "toJSON")) && (l = l.toJSON(t)); else if (l > -1 / 0 && l < 1 / 0) {
if (m) {
for (p = j(l / 864e5), u = j(p / 365.2425) + 1970 - 1; m(u + 1, 0) <= p; u++) ;
for (f = j((p - m(u, 0)) / 30.42); m(u, f + 1) <= p; f++) ;
p = 1 + p - m(u, f), v = j((h = (l % 864e5 + 864e5) % 864e5) / 36e5) % 24, w = j(h / 6e4) % 60, S = j(h / 1e3) % 60, A = h % 1e3;
} else u = l.getUTCFullYear(), f = l.getUTCMonth(), p = l.getUTCDate(), v = l.getUTCHours(), w = l.getUTCMinutes(), S = l.getUTCSeconds(), A = l.getUTCMilliseconds();
l = (u <= 0 || u >= 1e4 ? (u < 0 ? "-" : "+") + x(6, u < 0 ? -u : u) : x(4, u)) + "-" + x(2, f + 1) + "-" + x(2, p) + "T" + x(2, v) + ":" + x(2, w) + ":" + x(2, S) + "." + x(3, A) + "Z";
} else l = null;
if (e && (l = e.call(r, t, l)), null === l) return "null";
if ("[object Boolean]" == (c = d.call(l))) return "" + l;
if ("[object Number]" == c) return l > -1 / 0 && l < 1 / 0 ? "" + l : "null";
if ("[object String]" == c) return T("" + l);
if ("object" == typeof l) {
for (E = a.length; E--; ) if (a[E] === l) throw s();
if (a.push(l), O = [], M = i, i += o, "[object Array]" == c) {
for (_ = 0, E = l.length; _ < E; _++) C = N(_, l, e, n, o, i, a), O.push(C === b ? "null" : C);
D = O.length ? o ? "[\n" + i + O.join(",\n" + i) + "\n" + M + "]" : "[" + O.join(",") + "]" : "[]";
} else g(n || l, function(t) {
var r = N(t, l, e, n, o, i, a);
r !== b && O.push(T(t) + ":" + (o ? " " : "") + r);
}), D = O.length ? o ? "{\n" + i + O.join(",\n" + i) + "\n" + M + "}" : "{" + O.join(",") + "}" : "{}";
return a.pop(), D;
}
};
n.stringify = function(t, r, n) {
var o, i, a, l;
if (e[typeof r] && r) if ("[object Function]" == (l = d.call(r))) i = r; else if ("[object Array]" == l) {
a = {};
for (var c, u = 0, f = r.length; u < f; c = r[u++], ("[object String]" == (l = d.call(c)) || "[object Number]" == l) && (a[c] = 1)) ;
}
if (n) if ("[object Number]" == (l = d.call(n))) {
if ((n -= n % 1) > 0) for (o = "", n > 10 && (n = 10); o.length < n; o += " ") ;
} else "[object String]" == l && (o = n.length <= 10 ? n : n.slice(0, 10));
return N("", (c = {}, c[""] = t, c), i, a, o, "", []);
};
}
if (!i("json-parse")) {
var C, _, E = l.fromCharCode, M = {
92: "\\",
34: '"',
47: "/",
98: "\b",
116: "\t",
110: "\n",
102: "\f",
114: "\r"
}, D = function() {
throw C = _ = null, f();
}, I = function() {
for (var t, r, e, n, o, i = _, a = i.length; C < a; ) switch (o = i.charCodeAt(C)) {
case 9:
case 10:
case 13:
case 32:
C++;
break;

case 123:
case 125:
case 91:
case 93:
case 58:
case 44:
return t = S ? i.charAt(C) : i[C], C++, t;

case 34:
for (t = "@", C++; C < a; ) if ((o = i.charCodeAt(C)) < 32) D(); else if (92 == o) switch (o = i.charCodeAt(++C)) {
case 92:
case 34:
case 47:
case 98:
case 116:
case 110:
case 102:
case 114:
t += M[o], C++;
break;

case 117:
for (r = ++C, e = C + 4; C < e; C++) (o = i.charCodeAt(C)) >= 48 && o <= 57 || o >= 97 && o <= 102 || o >= 65 && o <= 70 || D();
t += E("0x" + i.slice(r, C));
break;

default:
D();
} else {
if (34 == o) break;
for (o = i.charCodeAt(C), r = C; o >= 32 && 92 != o && 34 != o; ) o = i.charCodeAt(++C);
t += i.slice(r, C);
}
if (34 == i.charCodeAt(C)) return C++, t;
D();

default:
if (r = C, 45 == o && (n = !0, o = i.charCodeAt(++C)), o >= 48 && o <= 57) {
for (48 == o && (o = i.charCodeAt(C + 1)) >= 48 && o <= 57 && D(), n = !1; C < a && (o = i.charCodeAt(C)) >= 48 && o <= 57; C++) ;
if (46 == i.charCodeAt(C)) {
for (e = ++C; e < a && (o = i.charCodeAt(e)) >= 48 && o <= 57; e++) ;
e == C && D(), C = e;
}
if (101 == (o = i.charCodeAt(C)) || 69 == o) {
for (43 != (o = i.charCodeAt(++C)) && 45 != o || C++, e = C; e < a && (o = i.charCodeAt(e)) >= 48 && o <= 57; e++) ;
e == C && D(), C = e;
}
return +i.slice(r, C);
}
if (n && D(), "true" == i.slice(C, C + 4)) return C += 4, !0;
if ("false" == i.slice(C, C + 5)) return C += 5, !1;
if ("null" == i.slice(C, C + 4)) return C += 4, null;
D();
}
return "$";
}, F = function(t) {
var r, e;
if ("$" == t && D(), "string" == typeof t) {
if ("@" == (S ? t.charAt(0) : t[0])) return t.slice(1);
if ("[" == t) {
for (r = []; "]" != (t = I()); e || (e = !0)) e && ("," == t ? "]" == (t = I()) && D() : D()), "," == t && D(), r.push(F(t));
return r;
}
if ("{" == t) {
for (r = {}; "}" != (t = I()); e || (e = !0)) e && ("," == t ? "}" == (t = I()) && D() : D()), "," != t && "string" == typeof t && "@" == (S ? t.charAt(0) : t[0]) && ":" == I() || D(), r[t.slice(1)] = F(I());
return r;
}
D();
}
return t;
}, U = function(t, r, e) {
var n = J(t, r, e);
n === b ? delete t[r] : t[r] = n;
}, J = function(t, r, e) {
var n, o = t[r];
if ("object" == typeof o && o) if ("[object Array]" == d.call(o)) for (n = o.length; n--; ) U(o, n, e); else g(o, function(t) {
U(o, t, e);
});
return e.call(t, r, o);
};
n.parse = function(t, r) {
var e, n;
return C = 0, _ = "" + t, e = F(I()), "$" != I() && D(), C = _ = null, r && "[object Function]" == d.call(r) ? J((n = {}, n[""] = e, n), "", r) : e;
};
}
}
return n.runInContext = t, n;
}
var r = "function" == typeof define && define.amd, e = {
function: !0,
object: !0
}, n = e[typeof exports] && exports && !exports.nodeType && exports, o = e[typeof window] && window || this, i = n && e[typeof module] && module && !module.nodeType && "object" == typeof global && global;
if (!i || i.global !== i && i.window !== i && i.self !== i || (o = i), n && !r) t(o, n); else {
var a = o.JSON, l = o.JSON3, c = !1, u = t(o, o.JSON3 = {
noConflict: function() {
return c || (c = !0, o.JSON = a, o.JSON3 = l, a = l = null), u;
}
});
o.JSON = {
parse: u.parse,
stringify: u.stringify
};
}
r && define(function() {
return u;
});
}.call(this);