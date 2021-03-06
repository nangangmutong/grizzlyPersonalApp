/*
 * APICloud JavaScript Library
 * Copyright (c) 2014 apicloud.com
 */
import { Toast, Indicator } from 'mint-ui';

var u = {};
var isAndroid = (/android/gi).test(navigator.appVersion);
var uzStorage = function () {
  var ls = window.localStorage;
  if (isAndroid) {
    ls = window.os.localStorage();
  }
  return ls;
};
function parseArguments(url, data, fnSuc, dataType) {
  if (typeof (data) === 'function') {
    dataType = fnSuc;
    fnSuc = data;
    data = undefined;
  }
  if (typeof (fnSuc) !== 'function') {
    dataType = fnSuc;
    fnSuc = undefined;
  }
  return {
    url: url,
    data: data,
    fnSuc: fnSuc,
    dataType: dataType
  };
}
u.trim = function (str) {
  if (String.prototype.trim) {
    return str === null ? '' : String.prototype.trim.call(str);
  } else {
    return str.replace(/(^\s*)|(\s*$)/g, '');
  }
};
u.trimAll = function (str) {
  return str.replace(/\s*/g, '');
};
u.isElement = function (obj) {
  return !!(obj && obj.nodeType === 1);
};
u.isArray = function (obj) {
  if (Array.isArray) {
    return Array.isArray(obj);
  } else {
    return obj instanceof Array;
  }
};
u.isEmptyObject = function (obj) {
  if (JSON.stringify(obj) === '{}') {
    return true;
  }
  return false;
};
u.addEvt = function (el, name, fn, useCapture) {
  if (!u.isElement(el)) {
    console.warn('$api.addEvt Function need el param, el param must be DOM Element');
    return;
  }
  useCapture = useCapture || false;
  if (el.addEventListener) {
    el.addEventListener(name, fn, useCapture);
  }
};
u.rmEvt = function (el, name, fn, useCapture) {
  if (!u.isElement(el)) {
    console.warn('$api.rmEvt Function need el param, el param must be DOM Element');
    return;
  }
  useCapture = useCapture || false;
  if (el.removeEventListener) {
    el.removeEventListener(name, fn, useCapture);
  }
};
u.one = function (el, name, fn, useCapture) {
  if (!u.isElement(el)) {
    console.warn('$api.one Function need el param, el param must be DOM Element');
    return;
  }
  useCapture = useCapture || false;
  var that = this;
  var cb = function () {
    fn && fn();
    that.rmEvt(el, name, cb, useCapture);
  };
  that.addEvt(el, name, cb, useCapture);
};
u.dom = function (el, selector) {
  if (arguments.length === 1 && typeof arguments[0] === 'string') {
    if (document.querySelector) {
      return document.querySelector(arguments[0]);
    }
  } else if (arguments.length === 2) {
    if (el.querySelector) {
      return el.querySelector(selector);
    }
  }
};
u.domAll = function (el, selector) {
  if (arguments.length === 1 && typeof arguments[0] === 'string') {
    if (document.querySelectorAll) {
      return document.querySelectorAll(arguments[0]);
    }
  } else if (arguments.length === 2) {
    if (el.querySelectorAll) {
      return el.querySelectorAll(selector);
    }
  }
};
u.byId = function (id) {
  return document.getElementById(id);
};
u.first = function (el, selector) {
  if (arguments.length === 1) {
    if (!u.isElement(el)) {
      console.warn('$api.first Function need el param, el param must be DOM Element');
      return;
    }
    return el.children[0];
  }
  if (arguments.length === 2) {
    return this.dom(el, selector + ':first-child');
  }
};
u.last = function (el, selector) {
  if (arguments.length === 1) {
    if (!u.isElement(el)) {
      console.warn('$api.last Function need el param, el param must be DOM Element');
      return;
    }
    var children = el.children;
    return children[children.length - 1];
  }
  if (arguments.length === 2) {
    return this.dom(el, selector + ':last-child');
  }
};
u.eq = function (el, index) {
  return this.dom(el, ':nth-child(' + index + ')');
};
u.not = function (el, selector) {
  return this.domAll(el, ':not(' + selector + ')');
};
u.prev = function (el) {
  if (!u.isElement(el)) {
    console.warn('$api.prev Function need el param, el param must be DOM Element');
    return;
  }
  var node = el.previousSibling;
  if (node.nodeType && node.nodeType === 3) {
    node = node.previousSibling;
    return node;
  }
};
u.next = function (el) {
  if (!u.isElement(el)) {
    console.warn('$api.next Function need el param, el param must be DOM Element');
    return;
  }
  var node = el.nextSibling;
  if (node.nodeType && node.nodeType === 3) {
    node = node.nextSibling;
    return node;
  }
};
u.closest = function (el, selector) {
  if (!u.isElement(el)) {
    console.warn('$api.closest Function need el param, el param must be DOM Element');
    return;
  }
  var doms, targetDom;
  var isSame = function (doms, el) {
    var i = 0;
    var len = doms.length;
    for (i; i < len; i++) {
      if (doms[i].isSameNode(el)) {
        return doms[i];
      }
    }
    return false;
  };
  var traversal = function (el, selector) {
    doms = u.domAll(el.parentNode, selector);
    targetDom = isSame(doms, el);
    while (!targetDom) {
      el = el.parentNode;
      if (el !== null && el.nodeType === el.DOCUMENT_NODE) {
        return false;
      }
      targetDom = traversal(el, selector);
    }

    return targetDom;
  };

  return traversal(el, selector);
};
u.contains = function (parent, el) {
  var mark = false;
  if (el === parent) {
    mark = true;
    return mark;
  } else {
    do {
      el = el.parentNode;
      if (el === parent) {
        mark = true;
        return mark;
      }
    } while (el === document.body || el === document.documentElement);

    return mark;
  }
};
u.remove = function (el) {
  if (el && el.parentNode) {
    el.parentNode.removeChild(el);
  }
};
u.attr = function (el, name, value) {
  if (!u.isElement(el)) {
    console.warn('$api.attr Function need el param, el param must be DOM Element');
    return;
  }
  if (arguments.length === 2) {
    return el.getAttribute(name);
  } else if (arguments.length === 3) {
    el.setAttribute(name, value);
    return el;
  }
};
u.removeAttr = function (el, name) {
  if (!u.isElement(el)) {
    console.warn('$api.removeAttr Function need el param, el param must be DOM Element');
    return;
  }
  if (arguments.length === 2) {
    el.removeAttribute(name);
  }
};
u.hasCls = function (el, cls) {
  if (!u.isElement(el)) {
    console.warn('$api.hasCls Function need el param, el param must be DOM Element');
    return;
  }
  if (el.className.indexOf(cls) > -1) {
    return true;
  } else {
    return false;
  }
};
u.addCls = function (el, cls) {
  if (!u.isElement(el)) {
    console.warn('$api.addCls Function need el param, el param must be DOM Element');
    return;
  }
  if ('classList' in el) {
    el.classList.add(cls);
  } else {
    var preCls = el.className;
    var newCls = preCls + ' ' + cls;
    el.className = newCls;
  }
  return el;
};
u.removeCls = function (el, cls) {
  if (!u.isElement(el)) {
    console.warn('$api.removeCls Function need el param, el param must be DOM Element');
    return;
  }
  if ('classList' in el) {
    el.classList.remove(cls);
  } else {
    var preCls = el.className;
    var newCls = preCls.replace(cls, '');
    el.className = newCls;
  }
  return el;
};
u.toggleCls = function (el, cls) {
  if (!u.isElement(el)) {
    console.warn('$api.toggleCls Function need el param, el param must be DOM Element');
    return;
  }
  if ('classList' in el) {
    el.classList.toggle(cls);
  } else {
    if (u.hasCls(el, cls)) {
      u.removeCls(el, cls);
    } else {
      u.addCls(el, cls);
    }
  }
  return el;
};
u.val = function (el, val) {
  if (!u.isElement(el)) {
    console.warn('$api.val Function need el param, el param must be DOM Element');
    return;
  }
  if (arguments.length === 1) {
    switch (el.tagName) {
      case 'SELECT':
        var value = el.options[el.selectedIndex].value;
        return value;
        break;
      case 'INPUT':
        return el.value;
        break;
      case 'TEXTAREA':
        return el.value;
        break;
    }
  }
  if (arguments.length === 2) {
    switch (el.tagName) {
      case 'SELECT':
        el.options[el.selectedIndex].value = val;
        return el;
        break;
      case 'INPUT':
        el.value = val;
        return el;
        break;
      case 'TEXTAREA':
        el.value = val;
        return el;
        break;
    }
  }
};
u.prepend = function (el, html) {
  if (!u.isElement(el)) {
    console.warn('$api.prepend Function need el param, el param must be DOM Element');
    return;
  }
  el.insertAdjacentHTML('afterbegin', html);
  return el;
};
u.append = function (el, html) {
  if (!u.isElement(el)) {
    console.warn('$api.append Function need el param, el param must be DOM Element');
    return;
  }
  el.insertAdjacentHTML('beforeend', html);
  return el;
};
u.before = function (el, html) {
  if (!u.isElement(el)) {
    console.warn('$api.before Function need el param, el param must be DOM Element');
    return;
  }
  el.insertAdjacentHTML('beforebegin', html);
  return el;
};
u.after = function (el, html) {
  if (!u.isElement(el)) {
    console.warn('$api.after Function need el param, el param must be DOM Element');
    return;
  }
  el.insertAdjacentHTML('afterend', html);
  return el;
};
u.html = function (el, html) {
  if (!u.isElement(el)) {
    console.warn('$api.html Function need el param, el param must be DOM Element');
    return;
  }
  if (arguments.length === 1) {
    return el.innerHTML;
  } else if (arguments.length === 2) {
    el.innerHTML = html;
    return el;
  }
};
u.text = function (el, txt) {
  if (!u.isElement(el)) {
    console.warn('$api.text Function need el param, el param must be DOM Element');
    return;
  }
  if (arguments.length === 1) {
    return el.textContent;
  } else if (arguments.length === 2) {
    el.textContent = txt;
    return el;
  }
};
u.offset = function (el) {
  if (!u.isElement(el)) {
    console.warn('$api.offset Function need el param, el param must be DOM Element');
    return;
  }
  var sl = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
  var st = Math.max(document.documentElement.scrollTop, document.body.scrollTop);

  var rect = el.getBoundingClientRect();
  return {
    l: rect.left + sl,
    t: rect.top + st,
    w: el.offsetWidth,
    h: el.offsetHeight
  };
};
u.css = function (el, css) {
  if (!u.isElement(el)) {
    console.warn('$api.css Function need el param, el param must be DOM Element');
    return;
  }
  if (typeof css === 'string' && css.indexOf(':') > 0) {
    el.style && (el.style.cssText += ';' + css);
  }
};
u.cssVal = function (el, prop) {
  if (!u.isElement(el)) {
    console.warn('$api.cssVal Function need el param, el param must be DOM Element');
    return;
  }
  if (arguments.length === 2) {
    var computedStyle = window.getComputedStyle(el, null);
    return computedStyle.getPropertyValue(prop);
  }
};
u.jsonToStr = function (json) {
  if (typeof json === 'object') {
    return JSON && JSON.stringify(json);
  }
};
u.strToJson = function (str) {
  if (typeof str === 'string') {
    return JSON && JSON.parse(str);
  }
};
u.setStorage = function (key, value) {
  if (arguments.length === 2) {
    var v = value;
    if (typeof v === 'object') {
      v = JSON.stringify(v);
      v = 'obj-' + v;
    } else {
      v = 'str-' + v;
    }
    var ls = uzStorage();
    if (ls) {
      ls.setItem(key, v);
    }
  }
};
u.getStorage = function (key) {
  var ls = uzStorage();
  if (ls) {
    var v = ls.getItem(key);
    if (!v) { return; }
    if (v.indexOf('obj-') === 0) {
      v = v.slice(4);
      return JSON.parse(v);
    } else if (v.indexOf('str-') === 0) {
      return v.slice(4);
    }
  }
};
u.rmStorage = function (key) {
  var ls = uzStorage();
  if (ls && key) {
    ls.removeItem(key);
  }
};
u.clearStorage = function () {
  var ls = uzStorage();
  if (ls) {
    ls.clear();
  }
};
u.fixIos7Bar = function (el) {
  return u.fixStatusBar(el);
};
u.fixStatusBar = function (el) {
  if (!u.isElement(el)) {
    console.warn('$api.fixStatusBar Function need el param, el param must be DOM Element');
    return 0;
  }
  el.style.paddingTop = window.api.safeArea.top + 'px';
  el.style.height = (window.api.safeArea.top + el.offsetHeight) + 'px';
  return el.offsetHeight;
};
u.fixTabBar = function (el) {
  if (!u.isElement(el)) {
    console.warn('$api.fixTabBar Function need el param, el param must be DOM Element');
    return 0;
  }
  el.style.paddingBottom = window.api.safeArea.bottom + 'px';
  return el.offsetHeight;
};


u.showProgress = function (
  text = ''
) {
  if (window.api) {
    window.api.showProgress({
      title: '',
      text
    });
  } else {
    Indicator.open({
      text,
      spinnerType: 'fading-circle'
    })
  }
};

u.hideProgress = function () {
  if (window.api) {
    window.api.hideProgress();
  } else {
    Indicator.close()
  }
}

u.toast = function ({
  message = '',
  position = 'top',
  duration = 2000
}) {
  if (window.api) {
    window.api.toast({
      msg: message,
      location: position,
      duration
    });
  } else {
    Toast({
      message,
      position,
      duration
    })
  }
};
u.post = function (/* url,data,fnSuc,dataType */) {
  var argsToJson = parseArguments.apply(null, arguments);
  var json = {};
  var fnSuc = argsToJson.fnSuc;
  argsToJson.url && (json.url = argsToJson.url);
  argsToJson.data && (json.data = argsToJson.data);
  if (argsToJson.dataType) {
    var type = argsToJson.dataType.toLowerCase();
    if (type === 'text' || type === 'json') {
      json.dataType = type;
    }
  } else {
    json.dataType = 'json';
  }
  json.method = 'post';
  window.ajax(json,
    function (ret, err) {
      if (ret) {
        fnSuc && fnSuc(ret);
      }
    }
  );
};
u.get = function (/* url,fnSuc,dataType */) {
  var argsToJson = parseArguments.apply(null, arguments);
  var json = {};
  var fnSuc = argsToJson.fnSuc;
  argsToJson.url && (json.url = argsToJson.url);
  // argsToJson.data && (json.data = argsToJson.data);
  if (argsToJson.dataType) {
    var type = argsToJson.dataType.toLowerCase();
    if (type === 'text' || type === 'json') {
      json.dataType = type;
    }
  } else {
    json.dataType = 'text';
  }
  json.method = 'get';
  window.api.ajax(json,
    function (ret, err) {
      if (ret) {
        fnSuc && fnSuc(ret);
      }
    }
  );
};

u.sleep = function (times) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve("ok");
    }, times);
  });
};

u.openWin = function (params) {
  const { LCB, name, url, title = '', fname, furl, hasLeft = false, hasRight = false, jumpTime = 100, data = {}, ...winData } = params
  if (window.api) {
    let op = {
      name,
      url,
      bounces: false,
      slidBackEnabled: false,
      pageParam: {
        ...winData,
      }
    };

    //添加点击返回按钮的回调监听
    if (typeof (LCB) === 'function') {
      const LCBName = ('LCB' + Date.now().valueOf()) + Math.random();
      u.addEventListener(
        {
          name: LCBName
        },
        LCB
      );
      op.pageParam.LCBName = LCBName;
    }

    //添加页面关闭的回调监听
    if (typeof (data.callback) === 'function') {
      const eventName = ('EVENT' + Date.now().valueOf()) + Math.random();
      u.addEventListener(
        {
          name: eventName
        },
        data.callback
      );

      // api.addEventListener({
      //   name: 'swiperight'
      // }, function (ret, err) {
      //   alert('向右轻扫');
      // });

      data.eventName = eventName;
      delete data.callback;
    }

    if (fname !== undefined) {
      op.pageParam.wtitle = title;
      op.pageParam.fname = fname;
      op.pageParam.furl = furl;
      op.pageParam.hasLeft = hasLeft;
      op.pageParam.hasRight = hasRight;
      op.pageParam.data = data;
    }

    setTimeout(function () {
      // console.log('open win timeout', JSON.stringify(op));
      window.api.openWin(op);
    }, jumpTime);
  } else if (furl) {
    window.location.href = furl.replace('./', '/');
  }
}

u.addEventListener = function (ope = {}, callback = () => { }) {
  if (window.api) {
    // console.log('add evnet: ' + ope.name);
    window.api.addEventListener(
      ope,
      (ret, err) => {
        // console.log('evnet callback: ' + ope.name);
        callback(
          { ...ret, value: typeof (ret.value) === 'string' ? JSON.parse(ret.value) : ret.value },
          err
        );
        if (ope.delEvent !== false) {
          // console.log('del event: ' + ope.name);
          window.api.removeEventListener({
            name: ope.name
          });
        }
      }
    );
  }
};

u.sendEvent = function (name = '', data = {}) {
  // console.log('send event: ' + name)
  if (window.api) {
    window.api.sendEvent({
      name: name,
      extra: typeof (data) === 'object' ? JSON.stringify(data) : data
    });
  }
};

u.closeWin = function (data = {}) {
  if (window.api) {
    if (window.api.pageParam.eventName && window.api.pageParam.eventName !== '') {
      u.sendEvent(window.api.pageParam.eventName, data);
    }
    window.api.closeWin();
  }
};

u.back = function () {
  if (window.api) {
    if (window.api.pageParam.LCBName && window.api.pageParam.LCBName !== '') {
      u.sendEvent(window.api.pageParam.LCBName);
    }
    window.api.closeWin();
  }
};

u.confirm = function (
  {
    title = '',
    content = '',
    callback = () => { }
  }
) {
  if (window.api) {
    api.confirm({
      title,
      msg: content,
      buttons: ['确定', '取消']
    }, function (ret, err) {
      switch (ret.buttonIndex) {
        case 1:
          callback(ret, err);
          break;
        default:
          break;
      }
    });
  } else {
    if (confirm(content) === true) {
      callback();
    }
  }
};

u.urlParse = function (url) {
  const urlObj = url.split('?');
  const base = urlObj[0];
  const searchAry = urlObj[1].split('&');
  const params = {};

  searchAry.foreach(r => {
    params[r.split("=")[0]] = unescape(r.split("=")[1]);
  });

  return {
    base,
    params
  };
};

u.openWebPage = function (url) {
  if (window.api) {
    switch (window.api.systemType) {
      case 'android':
        window.api.openApp({
          androidPkg: 'android.intent.action.VIEW',
          mimeType: 'text/html',
          uri: url
        }, function (ret, err) {
        });
        break;
      case 'ios':
        const { base, params } = u.urlParse(url);
        window.api.openApp({
          iosUrl: base,
          appParam: {
            appParam: params
          }
        });
        break;
      default:
        break;
    }
  } else {
    window.open(url);
  }
}

u.getPicUrl = function(string, size){
  const urlAry = string.split('/');
  if(urlAry[2]!=='test.mangotmall.com'){
      return string;
  }
  let sizeStr = size ? size + '_' :'';
  urlAry[urlAry.length - 1] = sizeStr + urlAry[urlAry.length - 1];
  return urlAry.join('/');
}

u.backCloseW=function(){
    var exitStatu=0;
      window.api.addEventListener({
        name: 'keyback'
        }, function(ret, err) {
            if (!exitStatu) {
                exitStatu = 1;
                u.toast({
                    position: 'top',
                    message: '再点一次退出应用'
                });
                setTimeout(function() {
                    exitStatu=0;
                }, 2000)
            } else if (exitStatu == 1) {
                window.api.closeWidget();
            }
        });
}
/* end */



export default u;
