// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
require = (function (modules, cache, entry) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof require === "function" && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof require === "function" && require;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }
      
      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module;

      modules[name][0].call(module.exports, localRequire, module, module.exports);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module() {
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  // Override the current require with this new one
  return newRequire;
})({9:[function(require,module,exports) {
/*
* @Author: 28906
* @Date:   2017-12-01 15:23:54
* @Last Modified by:   28906
* @Last Modified time: 2018-01-06 00:33:22
* @Description: service-worker
*/

"use strict";

var cacheName = 'douban-movie-v1'; // 缓存的名字


// service-worker下载、注册、激活之后，install事件就可以被监听了。
// 如其名，install，表示页面上的js,css,img等都可以被缓存的时机成熟了。
// 这些数据都是静态的，也就是不会变的，比如本demo中引入的 svg, main.js, style.css 等
// 每次进来都会加载的静态的，不会变化的数据，我们把它缓存起来，
// 它们就像是这个demo app的外壳一样，缓存起来的好处就是没有网络的时候打开app，这个壳至少会
// 显示出来，从而增加用户体验。当然第一次还是相对很慢的，以后的重复访问都是从缓存拿出来，就很快了。
// self.addEventListener('install', function(event){
// 	event.waitUntil( //waitUntil表示等到资源加载好，service-worker激活
// 		caches.open(cacheName)
// 		.then(function(cache){ // 把外壳需要的不变的资源缓存起来
// 			cache.addAll([
// 				'./main.js',
// 				'./movie.svg',
// 				'./style.css',
// 				'./movies.json',
// 				'./douban_movie.html'
// 			])
// 		})
// 	)
// })


// 现在升级一下上面的代码。使得其支持自动的更新service-worker。
// 安装阶段跳过等待，直接进入 active
self.addEventListener('install', function (event) {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', function (event) {
  event.waitUntil(Promise.all([

  // 更新客户端
  self.clients.claim(),

  // 清理旧版本
  caches.keys().then(function (cacheList) {
    return Promise.all(cacheList.map(function (cn) {
      if (cn !== cacheName) {
        return caches.delete(cn);
      }
    }));
  })]));
});

// 当页面有了新的资源的时候，我们也要缓存起来。
// 这个时候就不能上边那样用了，因为是动态的，比如一个新闻网站 懂球帝 之类的
// 它的新闻是在不断的更新的，也就是打开页面额时候会去请求新的数据。
// 这个时候我们监听请求 fetch 事件，缓存请求的数据，下一次同一请求就从缓存中返回了。
self.addEventListener('fetch', function (event) {
  // 我们作为一个代理，劫持请求，判断缓存有没有请求的数据，有就从缓存返回，
  // 没有就正常去访问服务器响应的数据，然后缓存起来，再返回。
  // 这也是respondWith的意思

  // 如果要具体的拦截到特定的路径的请求，可以使用正则
  // if(/\.jpg$/.test(event.request.url)){
  // 	event.respondWith(
  // 		new Response('<p>This is a response that comes from your service worker!</p>', {
  // 	        headers: { 'Content-Type': 'text/html' }                                         ❸
  // 	    });
  // 	)
  // }
  event.respondWith(
  // caches.match判断缓存里面有没有对应的数据
  // ignoreSearch 忽略查询字符串
  caches.match(event.request, { ignoreSearch: true }).then(function (response) {
    if (response) {
      return response; //缓存有，就直接返回
    }

    //如果缓存没有，我们就要去发起请求获取数据，再缓存起来
    // 记住，请求和响应都是流，只能用一次，所以都要clone一次。
    var fetchRequest = event.request.clone();
    return fetch(fetchRequest).then(function (response) {
      if (!response || response.status !== 200) {
        return response; // 绝不缓存错误的
      }

      var responseToCache = response.clone();
      // 把获得到数据缓存，下一次同一请求就从缓存拿数据了
      caches.open(cacheName).then(function (cache) {
        cache.put(fetchRequest, responseToCache);
      });

      return response;
    });
  }).catch(function () {
    // 设置一个失败的回退。
    return caches.match('./douban_movie.html');
  }));
});
// 这只是一个基础的demo，用以揭示 PWA 应用中缓存的实现。
// 缓存成功与否可以在 chrome F12 中找到 Cache下的 Cache Storage 查看。
// 你刷新页面也会发现速度更加快了。
},{}],0:[function(require,module,exports) {
var global = (1, eval)('this');
var OldModule = module.bundle.Module;
function Module() {
  OldModule.call(this);
  this.hot = {
    accept: function (fn) {
      this._acceptCallback = fn || function () {};
    },
    dispose: function (fn) {
      this._disposeCallback = fn;
    }
  };
}

module.bundle.Module = Module;

if (!module.bundle.parent && typeof WebSocket !== 'undefined') {
  var ws = new WebSocket('ws://' + window.location.hostname + ':54828/');
  ws.onmessage = function(event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      data.assets.forEach(function (asset) {
        hmrApply(global.require, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.require, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        window.location.reload();
      }
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + 'data.error.stack');
    }
  };
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || (Array.isArray(dep) && dep[dep.length - 1] === id)) {
        parents.push(+k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  if (cached && cached.hot._disposeCallback) {
    cached.hot._disposeCallback();
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallback) {
    cached.hot._acceptCallback();
    return true;
  }

  return getParents(global.require, id).some(function (id) {
    return hmrAccept(global.require, id)
  });
}
},{}]},{},[0,9])