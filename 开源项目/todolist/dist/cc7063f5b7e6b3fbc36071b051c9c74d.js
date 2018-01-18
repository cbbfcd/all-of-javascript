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
})({14:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.h = h;
exports.app = app;
function h(name, props) {
  var node;
  var children = [];

  for (var stack = [], i = arguments.length; i-- > 2;) {
    stack.push(arguments[i]);
  }

  while (stack.length) {
    if (Array.isArray(node = stack.pop())) {
      for (var i = node.length; i--;) {
        stack.push(node[i]);
      }
    } else if (node == null || node === true || node === false) {} else {
      children.push(node);
    }
  }

  return typeof name === "string" ? {
    name: name,
    props: props || {},
    children: children
  } : name(props || {}, children);
}

function app(state, actions, view, container) {
  var patchLock;
  var lifecycle = [];
  var root = container && container.children[0];
  var node = vnode(root, [].map);

  repaint(init([], state = copy(state), actions = copy(actions)));

  return actions;

  function vnode(element, map) {
    return element && {
      name: element.nodeName.toLowerCase(),
      props: {},
      children: map.call(element.childNodes, function (element) {
        return element.nodeType === 3 ? element.nodeValue : vnode(element, map);
      })
    };
  }

  function render(next) {
    patchLock = !patchLock;
    next = view(state, actions);

    if (container && !patchLock) {
      root = patch(container, root, node, node = next);
    }

    while (next = lifecycle.pop()) {
      next();
    }
  }

  function repaint() {
    if (!patchLock) {
      patchLock = !patchLock;
      setTimeout(render);
    }
  }

  function copy(a, b) {
    var target = {};

    for (var i in a) {
      target[i] = a[i];
    }for (var i in b) {
      target[i] = b[i];
    }return target;
  }

  function set(path, value, source, target) {
    if (path.length) {
      target[path[0]] = 1 < path.length ? set(path.slice(1), value, source[path[0]], {}) : value;
      return copy(source, target);
    }
    return value;
  }

  function get(path, source) {
    for (var i = 0; i < path.length; i++) {
      source = source[path[i]];
    }
    return source;
  }

  function init(path, slice, actions) {
    for (var key in actions) {
      typeof actions[key] === "function" ? function (key, action) {
        actions[key] = function (data) {
          slice = get(path, state);

          if (typeof (data = action(data)) === "function") {
            data = data(slice, actions);
          }

          if (data && data !== slice && !data.then) {
            repaint(state = set(path, copy(slice, data), state, {}));
          }

          return data;
        };
      }(key, actions[key]) : init(path.concat(key), slice[key] = slice[key] || {}, actions[key] = copy(actions[key]));
    }
  }

  function getKey(node) {
    return node && node.props ? node.props.key : null;
  }

  function setElementProp(element, name, value, oldValue) {
    if (name === "key") {} else if (name === "style") {
      for (var i in copy(oldValue, value)) {
        element[name][i] = value == null || value[i] == null ? "" : value[i];
      }
    } else {
      try {
        element[name] = value == null ? "" : value;
      } catch (_) {}

      if (typeof value !== "function") {
        if (value == null || value === false) {
          element.removeAttribute(name);
        } else {
          element.setAttribute(name, value);
        }
      }
    }
  }

  function createElement(node, isSVG) {
    var element = typeof node === "string" || typeof node === "number" ? document.createTextNode(node) : (isSVG = isSVG || node.name === "svg") ? document.createElementNS("http://www.w3.org/2000/svg", node.name) : document.createElement(node.name);

    if (node.props) {
      if (node.props.oncreate) {
        lifecycle.push(function () {
          node.props.oncreate(element);
        });
      }

      for (var i = 0; i < node.children.length; i++) {
        element.appendChild(createElement(node.children[i], isSVG));
      }

      for (var name in node.props) {
        setElementProp(element, name, node.props[name]);
      }
    }

    return element;
  }

  function updateElement(element, oldProps, props) {
    for (var name in copy(oldProps, props)) {
      if (props[name] !== (name === "value" || name === "checked" ? element[name] : oldProps[name])) {
        setElementProp(element, name, props[name], oldProps[name]);
      }
    }

    if (props.onupdate) {
      lifecycle.push(function () {
        props.onupdate(element, oldProps);
      });
    }
  }

  function removeChildren(element, node, props) {
    if (props = node.props) {
      for (var i = 0; i < node.children.length; i++) {
        removeChildren(element.childNodes[i], node.children[i]);
      }

      if (props.ondestroy) {
        props.ondestroy(element);
      }
    }
    return element;
  }

  function removeElement(parent, element, node, cb) {
    function done() {
      parent.removeChild(removeChildren(element, node));
    }

    if (node.props && (cb = node.props.onremove)) {
      cb(element, done);
    } else {
      done();
    }
  }

  function patch(parent, element, oldNode, node, isSVG, nextSibling) {
    if (node === oldNode) {} else if (oldNode == null) {
      element = parent.insertBefore(createElement(node, isSVG), element);
    } else if (node.name && node.name === oldNode.name) {
      updateElement(element, oldNode.props, node.props);

      var oldElements = [];
      var oldKeyed = {};
      var newKeyed = {};

      for (var i = 0; i < oldNode.children.length; i++) {
        oldElements[i] = element.childNodes[i];

        var oldChild = oldNode.children[i];
        var oldKey = getKey(oldChild);

        if (null != oldKey) {
          oldKeyed[oldKey] = [oldElements[i], oldChild];
        }
      }

      var i = 0;
      var j = 0;

      while (j < node.children.length) {
        var oldChild = oldNode.children[i];
        var newChild = node.children[j];

        var oldKey = getKey(oldChild);
        var newKey = getKey(newChild);

        if (newKeyed[oldKey]) {
          i++;
          continue;
        }

        if (newKey == null) {
          if (oldKey == null) {
            patch(element, oldElements[i], oldChild, newChild, isSVG);
            j++;
          }
          i++;
        } else {
          var recyledNode = oldKeyed[newKey] || [];

          if (oldKey === newKey) {
            patch(element, recyledNode[0], recyledNode[1], newChild, isSVG);
            i++;
          } else if (recyledNode[0]) {
            patch(element, element.insertBefore(recyledNode[0], oldElements[i]), recyledNode[1], newChild, isSVG);
          } else {
            patch(element, oldElements[i], null, newChild, isSVG);
          }

          j++;
          newKeyed[newKey] = newChild;
        }
      }

      while (i < oldNode.children.length) {
        var oldChild = oldNode.children[i];
        if (getKey(oldChild) == null) {
          removeElement(element, oldElements[i], oldChild);
        }
        i++;
      }

      for (var i in oldKeyed) {
        if (!newKeyed[oldKeyed[i][1].props.key]) {
          removeElement(element, oldKeyed[i][0], oldKeyed[i][1]);
        }
      }
    } else if (node.name === oldNode.name) {
      element.nodeValue = node;
    } else {
      element = parent.insertBefore(createElement(node, isSVG), nextSibling = element);
      removeElement(parent, nextSibling, oldNode);
    }
    return element;
  }
}
},{}],21:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = function (h) {
  return function (type) {
    return function (decls) {
      var parsed;
      var isDeclsFunction = typeof decls === "function";
      !isDeclsFunction && (parsed = parse(decls));
      return function (props, children) {
        props = props || {};
        isDeclsFunction && (parsed = parse(decls(props)));
        var node = h(type, props, children);
        node.props.class = ((node.props.class || "") + " " + (props.class || "") + " " + parsed).trim();
        return node;
      };
    };
  };
};

var _id = 0;
var sheet = document.head.appendChild(document.createElement("style")).sheet;

function hyphenate(str) {
  return str.replace(/[A-Z]/g, "-$&").toLowerCase();
}

function insert(rule) {
  sheet.insertRule(rule, 0);
}

function createRule(className, decls, media) {
  var newDecls = [];
  for (var property in decls) {
    _typeof(decls[property]) !== "object" && newDecls.push(hyphenate(property) + ":" + decls[property] + ";");
  }
  var rule = "." + className + "{" + newDecls.join("") + "}";
  return media ? media + "{" + rule + "}" : rule;
}

function concat(str1, str2) {
  return str1 + (/^\w/.test(str2) ? " " : "") + str2;
}

function parse(decls, child, media, className) {
  child = child || "";
  className = className || "p" + (_id++).toString(36);

  for (var property in decls) {
    var value = decls[property];
    if ((typeof value === "undefined" ? "undefined" : _typeof(value)) === "object") {
      var nextMedia = /^@/.test(property) ? property : null;
      var nextChild = nextMedia ? child : concat(child, property);
      parse(value, nextChild, nextMedia, className);
    }
  }

  insert(createRule(concat(className, child), decls, media));
  return className;
}
},{}],23:[function(require,module,exports) {
module.exports="/dist/4f420c4e7fb96d7421394a50a23c1824.png";
},{}],24:[function(require,module,exports) {
module.exports="/dist/17ba9af4eb4b49bbb5d5f13b24814e25.png";
},{}],22:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _hyperapp = require("hyperapp");

var _picostyle = require("picostyle");

var _picostyle2 = _interopRequireDefault(_picostyle);

var _todo = require("../../icons/todo.png");

var _todo2 = _interopRequireDefault(_todo);

var _completed = require("../../icons/completed.png");

var _completed2 = _interopRequireDefault(_completed);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
* @Author: 28906
* @Date:   2018-01-11 11:26:19
* @Last Modified by:   28906
* @Last Modified time: 2018-01-11 13:56:08
* @Description: label ciew component
*/

var style = (0, _picostyle2.default)(_hyperapp.h);

var state = {
  completed: false,
  text: ''
};

var actions = {
  toggle: function toggle() {
    return function (state) {
      state.completed = !state.completed;
      state.text = state.completed ? 'completed list' : 'todo list';
      return state;
    };
  }
};

var LabelWrapper = style('a')({
  position: ' absolute',
  left: '0',
  width: '32px',
  fontSize: '20px',
  color: 'white',
  borderRadius: '0 5px 5px 0',
  padding: '8px',
  textAlign: 'right',
  textDecoration: 'none',
  transition: 'width .3s ease-out',
  cursor: 'pointer',
  ':hover': {
    width: '60px'
  }
});

var TodoLabel = style('img')({
  width: '32px',
  height: '32px',
  top: '100px',
  backgroundColor: '#F4E69F'
});

var DoneLabel = style('img')({
  width: '32px',
  height: '32px',
  top: '180px',
  backgroundColor: '#BDDBEE'
});

var view = function view(state, actions) {
  return (0, _hyperapp.h)(
    "section",
    null,
    (0, _hyperapp.h)(
      LabelWrapper,
      null,
      (0, _hyperapp.h)(TodoLabel, { src: _todo2.default })
    ),
    (0, _hyperapp.h)(
      LabelWrapper,
      null,
      (0, _hyperapp.h)(DoneLabel, { src: _completed2.default })
    )
  );
};

var Label = (0, _hyperapp.app)(state, actions, view);

exports.default = Label;
},{"hyperapp":14,"picostyle":21,"../../icons/todo.png":23,"../../icons/completed.png":24}],0:[function(require,module,exports) {
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
  var ws = new WebSocket('ws://' + window.location.hostname + ':63570/');
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
},{}]},{},[0,22])