/* eslint-disable no-empty */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-undef */
import conf from './cct-wxa-conf';

var fvidKey = '_ccfvid',
  requestCacheKey = '_ccofrc',
  ap = 'undefined' != typeof wx ? wx : my,
  apType = 'undefined' != typeof wx ? 1 : 2,
  util = {
    extend: function (e, n, t) {
      var r = e[n];
      return (
        (e[n] = function () {
          var e = Array.prototype.slice.call(arguments, 0),
            n = t.apply(this, e);
          return r ? r.apply(this, e) : n;
        }),
        e
      );
    },
    getFirstVistorId: function () {
      var e = util.getStorageSync(fvidKey);
      return (
        e ||
          ((e = new Date().getTime() + Math.floor(1e6 * Math.random())),
          util.setStorageSync(fvidKey, e)),
        e
      );
    },
    generAlphaId: function () {
      return (
        Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
      );
    },
    getSystemInfo: function () {
      return ap.getSystemInfoSync();
    },
    assign: function (e, n) {
      for (var t in n) '' !== n[t] && void 0 != n[t] && (e[t] = n[t]);
      return e;
    },
    joinParameters: function (e, n) {
      var t,
        r,
        a,
        o,
        c = [];
      for (t in e)
        if ('' !== e[t] && 'undefined' != typeof e[t])
          if (((a = util.getType(e[t])), 'object' == a)) {
            o = [];
            for (r in e[t])
              e[t].hasOwnProperty(r) &&
                '' !== e[t][r] &&
                'undefined' != typeof e[t][r] &&
                o.push([r, ':', encodeURIComponent(e[t][r])].join(''));
            o.length && c.push([t, '=', o.join(';')].join(''));
          } else c.push([t, '=', encodeURIComponent(e[t])].join(''));
      return c.join(n);
    },
    getType: function (e) {
      var n = Object.prototype.toString.call(e).toLowerCase();
      return '[object number]' == n
        ? 'number'
        : '[object string]' == n
          ? 'string'
          : '[object array]' == n
            ? 'array'
            : '[object object]' == n
              ? 'object'
              : '[object undefined]' == n
                ? 'undefined'
                : 'unknow';
    },
    getPreviousUrl: function () {
      try {
        var e = getCurrentPages();
        if (e.length > 1) {
          var n,
            t = e[e.length - 2],
            r = t.route,
            a = t.options,
            o = r;
          return (
            a && Object.keys(a).length && (n = a),
            n && Object.keys(n).length && (o += '?' + util.joinParameters(n, '&')),
            o
          );
        }
      } catch (e) {}
      return '';
    },
    getCurrentUrl: function () {
      try {
        var e,
          n = getCurrentPages(),
          t = n[n.length - 1],
          r = t.route,
          a = t.options,
          o = r;
        return (
          a && Object.keys(a).length ? (e = a) : pageTracker.query && (e = pageTracker.query),
          e && Object.keys(e).length && (o += '?' + util.joinParameters(e, '&')),
          o
        );
      } catch (e) {}
      return '';
    },
    getStorageSync: function (e) {
      if (1 == apType) return ap.getStorageSync(e);
      var n = ap.getStorageSync({ key: e });
      return n ? n.data : null;
    },
    setStorageSync: function (e, n) {
      return 1 == apType ? ap.setStorageSync(e, n) : ap.setStorageSync({ key: e, data: n });
    }
  },
  g = {
    jsv: '1_1_0',
    seq: 0,
    isConnected: !0,
    fvid: '',
    pageId: '',
    on: { wxak: conf.appKey, wxaid: conf.appId },
    at: {},
    from: {},
    env: {},
    user: {}
  },
  appTracker = {
    onLaunch: function (e) {
      (g.from.scnid = e.scene), e.referrerInfo && (g.from.rwxaid = e.referrerInfo.appId);
      var n = e.query ? util.joinParameters(e.query, '&') : '',
        t = { curl: e.path + (n ? '?' + n : '') };
      tracker.addToQueue('track', 'app', 'wxal', t);
    },
    onShow: function (e) {
      (g.from.scnid = e.scene), e.referrerInfo && (g.from.rwxaid = e.referrerInfo.appId);
      var n = e.query ? util.joinParameters(e.query, '&') : '',
        t = { curl: e.path + (n ? '?' + n : '') };
      tracker.addToQueue('track', 'app', 'wxas', t);
    },
    onHide: function () {
      tracker.addToQueue('track', 'app', 'wxah');
    }
  },
  pageTracker = {
    onLoad: function (e) {
      pageTracker.query = e;
    },
    onShow: function () {
      tracker.addToQueue('track', 'app', 'wxaps');
    },
    onHide: function () {
      tracker.addToQueue('track', 'app', 'wxaph');
    },
    onUnload: function () {
      tracker.addToQueue('track', 'app', 'wxapuld');
    },
    onShareAppMessage: function (e) {
      return tracker.addToQueue('track', 'app', 'wxapsh'), {};
    },
    onPullDownRefresh: function () {
      conf.autoOnPullDownRefresh && tracker.addToQueue('track', 'app', 'wxappdr');
    },
    onReachBottom: function () {
      conf.autoOnReachBottom && tracker.addToQueue('track', 'app', 'wxaprb');
    }
  },
  tracker = {
    clist: [],
    runing: !1,
    addToQueue: function () {
      var e = tracker;
      e.clist.push(arguments), e.run();
    },
    run: function () {
      var e,
        n,
        t,
        r,
        a,
        o = tracker;
      o.runing ||
        ((o.runing = !0),
        (e = o.clist.shift()),
        e
          ? ((t = e[0]),
            (r = e[1]),
            (n = t + r.replace(r.charAt(0), r.charAt(0).toUpperCase())),
            o[n]
              ? ((a = Array.prototype.slice.call(e, 2)),
                a.unshift(function () {
                  (o.runing = !1), o.run();
                }),
                o[n].apply(o, a))
              : (o.runing = !1))
          : (o.runing = !1));
    },
    setAt: function (e, n, t) {
      (g.at[n] = t), e();
    },
    setFrom: function (e, n, t) {
      (g.from[n] = t), e();
    },
    setEnv: function (e, n, t) {
      (g.env[n] = t), e();
    },
    setUser: function (e, n, t) {
      (g.user[n] = t), e();
    },
    trackApp: function (e, n, t) {
      var r = tracker;
      t || (t = {}), t.ev || (t.ev = {});
      var a = t.ev;
      (a.type = n), r.send(t, e, 's');
    },
    trackEvent: function (e, n, t, r, a) {
      var o = tracker,
        c = { ev: {}, on: {} },
        u = c.ev,
        i = c.on;
      (u.type = 'wxaevent'),
        n && (i.cgy = n),
        t && (i.act = t),
        r && (i.lbl = r),
        a && (c.ev.value = a),
        o.send(c, e, 's');
    },
    trackForm: function (e, n) {
      if ('object' != !util.getType(n)) {
        var t = tracker,
          r = { ev: {}, on: n };
        t.send(r, e, 'f');
      }
    },
    getServerUrl: function () {
      var e = conf.baseUrl;
      return 0 == e.indexOf('http') ? e : 'https://' + e;
    },
    getParameters: function (e) {
      var n = util.assign,
        t = util.joinParameters,
        r = {},
        a = {},
        o = 0,
        c =
          (g.fvid,
          [
            'ev',
            'on',
            'at',
            'from',
            'user',
            'env',
            'ex',
            'ecc',
            'go',
            'et',
            'acid',
            'fvid',
            'jsv',
            'purl',
            'curl'
          ]);
      for (
        'object' == typeof e && (r = n(r, e)),
          'undefined' == typeof r.on && (r.on = {}),
          r.on = n(r.on, g.on),
          'undefined' == typeof r.at && (r.at = {}),
          r.at = n(r.at, g.at),
          'undefined' == typeof r.from && (r.from = {}),
          r.from = n(r.from, g.from),
          'undefined' == typeof r.env && (r.env = {}),
          r.env = n(r.env, g.env),
          'undefined' == typeof r.user && (r.user = {}),
          r.user = n(r.user, g.user),
          r.jsv = g.jsv,
          r.purl || (r.purl = util.getPreviousUrl()),
          r.curl || (r.curl = util.getCurrentUrl()),
          r.fvid = g.fvid,
          r.acid = conf.accountId,
          o = 0;
        o < c.length;
        o++
      )
        'undefined' != typeof r[c[o]] && (a[c[o]] = r[c[o]]);
      return (
        (r.seq = g.seq),
        g.pageId && (r.ptid = g.pageId),
        (a = n(a, r)),
        (a.cb = Math.ceil(1e10 * Math.random())),
        t(a, '&')
      );
    },
    send: function (e, n, t) {
      var r = tracker;
      g.seq++;
      var a = r.getServerUrl() + t + '?' + r.getParameters(e);
      if (g.isConnected)
        ap.request({
          url: a,
          method: 'get',
          complete: function (e) {
            n();
          }
        });
      else {
        var o = util.getStorageSync(requestCacheKey);
        o || (o = []),
          o.push({ url: a, ts: Date.now() }),
          util.setStorageSync(requestCacheKey, o),
          n();
      }
    },
    sendCache: function () {
      if (g.isConnected) {
        var e = util.getStorageSync(requestCacheKey);
        if (e && e.length) {
          var n = e.shift();
          util.setStorageSync(requestCacheKey, e);
          var t = Date.now() - n.ts,
            r = n.url + '&et=' + t;
          ap.request({
            url: r,
            complete: function () {
              tracker.sendCache();
            }
          });
        }
      }
    }
  };
!(function () {
  conf.appVersion && (g.on.wxav = conf.appVersion);
  var e = conf.getLocation;
  (g.fvid = util.getFirstVistorId()), (g.pageId = util.generAlphaId());
  var n = util.getSystemInfo();
  (g.env.dvcbrand = n.brand),
    (g.env.dvcmodel = n.model),
    (g.env.sr = [n.screenWidth, n.screenHeight].join('_')),
    (g.env.pxlr = n.pixelRatio),
    (g.env.wxv = n.version),
    (g.env.os = n.system),
    (g.env.lngg = n.language),
    (g.env.wxsdkv = 1 == apType ? n.SDKVersion : my.SDKVersion),
    e &&
      ap.getLocation({
        type: 1 == apType ? 'wgs84' : 1,
        altitude: !1,
        success: function (e) {
          (g.env.lat = e.latitude), (g.env.lng = e.longitude), (g.geo = e);
        }
      }),
    ap.getNetworkType({
      success: function (e) {
        1 == apType
          ? ((g.env.nwktype = e.networkType),
            (g.isConnected = 'none' != e.networkType),
            g.isConnected && tracker.sendCache())
          : ((g.env.nwktype = e.networkType),
            (g.isConnected = !!e.networkAvailable),
            g.isConnected && tracker.sendCache());
      }
    }),
    ap.onNetworkStatusChange(function (e) {
      (g.isConnected = e.isConnected),
        (g.env.nwktype = e.networkType),
        g.isConnected && tracker.sendCache();
    });
})(),
  (function () {
    var e = util.extend,
      n = App;
    App = function (t) {
      Object.keys(appTracker).forEach(function (n) {
        e(t, n, appTracker[n]);
      });
      var r = conf.accountId || 'cct';
      (t[r] = tracker.addToQueue), n(t);
    };
    var t = Page;
    Page = function (n) {
      Object.keys(pageTracker).forEach(function (t) {
        e(n, t, pageTracker[t]);
      }),
        t(n);
    };
  })();

// eslint-disable-next-line prettier/prettier
export const carlsberg = tracker.addToQueue;
