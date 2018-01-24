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
})({13:[function(require,module,exports) {
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
},{}],25:[function(require,module,exports) {
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
},{}],7:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _hyperapp = require("hyperapp");

var _picostyle = require("picostyle");

var _picostyle2 = _interopRequireDefault(_picostyle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
* @Author: 28906
* @Date:   2018-01-06 01:34:32
* @Last Modified by:   28906
* @Last Modified time: 2018-01-16 17:28:09
* @Description: wrapper view with css in js
*/
var style = (0, _picostyle2.default)(_hyperapp.h);

var Wrapper = style('section')({
  position: 'absolute',
  top: '10px',
  bottom: '10px',
  left: '10px',
  right: '10px',
  borderRadius: '1px solid transparent',
  backgroundColor: 'rgba(245,245,245,0.5)',
  boxShadow: '0px 0px 2px 3px rgba(0,0,0,0.2)',
  minWidth: '750px',
  overflow: 'hidden',
  "::before": {
    content: "'Todos'", // this is a bug! can not recognize the 'todos',but "'todos'"!
    fontSize: '50px',
    color: '#E3CBCD',
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    top: '20px'
  }
});

exports.default = Wrapper;
},{"hyperapp":13,"picostyle":25}],14:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _hyperapp = require("hyperapp");

var _picostyle = require("picostyle");

var _picostyle2 = _interopRequireDefault(_picostyle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
* @Author: 28906
* @Date:   2018-01-10 12:57:03
* @Last Modified by:   28906
* @Last Modified time: 2018-01-16 18:32:21
* @Description: input view 
*/

var style = (0, _picostyle2.default)(_hyperapp.h);

var Input = style('input')({
  width: '80%',
  padding: '16px',
  border: '1px solid #eee',
  borderRadius: '4px',
  backgroundColor: '#fff',
  boxShadow: '0px 3px 3px 0px rgba(0,0,0,.5)',
  fontSize: '24px',
  transition: 'width .5s ease-out',
  '::-webkit-input-placeholder': { /* WebKit browsers */
    color: '#E3CBCD'
  },
  // ':-moz-placeholder': { /* Mozilla Firefox 4 to 18 */
  // 	color: '#E3CBCD',
  // 	opacity: '1'
  // },
  // '::-moz-placeholder': { /* Mozilla Firefox 19+ */
  // 	color: '#E3CBCD',
  // 	opacity: '1'
  // },
  // ':-ms-input-placeholder': { /* Internet Explorer 10+ */
  // 	color: '#E3CBCD'
  // },
  ':focus': {
    outline: 'none', /*no chrome focus!*/
    boxShadow: '0 0 10px #909',
    width: '88%'
  }
});

exports.default = Input;
},{"hyperapp":13,"picostyle":25}],20:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/*
* @Author: 28906
* @Date:   2018-01-16 19:02:55
* @Last Modified by:   28906
* @Last Modified time: 2018-01-16 19:05:11
* @Description: common style obj
*/

// common obj style with css in js
var common = {};

common['del'] = {
  width: '20px',
  height: '20px',
  borderRadius: '50%',
  border: '1px solid #E3CBCD',
  transition: 'all .4s ease-out',
  cursor: 'pointer',
  '::before': {
    content: "''",
    position: 'absolute',
    width: '90%',
    height: '1px',
    left: '5%',
    top: '50%',
    transform: 'translateY(-50%) rotate(45deg)',
    display: 'block',
    backgroundColor: '#E3CBCD'
  },
  '::after': {
    content: "''",
    position: 'absolute',
    width: '90%',
    height: '1px',
    left: '5%',
    top: '50%',
    transform: 'translateY(-50%) rotate(-45deg)',
    display: 'block',
    backgroundColor: '#E3CBCD'
  },
  ':hover': {
    transform: 'scale(1.3)',
    '-webkit-transform': 'scale(1.3)'
  }
};

exports.default = common;
},{}],15:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _hyperapp = require("hyperapp");

var _picostyle = require("picostyle");

var _picostyle2 = _interopRequireDefault(_picostyle);

var _common = require("../../utils/common.js");

var _common2 = _interopRequireDefault(_common);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var style = (0, _picostyle2.default)(_hyperapp.h); /*
                                                   * @Author: 28906
                                                   * @Date:   2018-01-16 18:58:15
                                                   * @Last Modified by:   28906
                                                   * @Last Modified time: 2018-01-16 19:09:25
                                                   * @Description: input clear view component
                                                   */

var InputClear = style('a')(Object.assign({
  display: 'none',
  position: 'absolute',
  top: '50%',
  marginTop: '-10px',
  left: '78%'
}, _common2.default['del']));

exports.default = InputClear;
},{"hyperapp":13,"picostyle":25,"../../utils/common.js":20}],16:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _hyperapp = require("hyperapp");

var _picostyle = require("picostyle");

var _picostyle2 = _interopRequireDefault(_picostyle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
* @Author: 28906
* @Date:   2018-01-10 13:00:18
* @Last Modified by:   28906
* @Last Modified time: 2018-01-11 15:14:30
* @Description: add button component.
*/

var style = (0, _picostyle2.default)(_hyperapp.h);

var Add = style('a')({
  borderRadius: '50%',
  display: 'inline-block',
  padding: '20px',
  position: 'absolute',
  right: '0',
  top: '50%',
  transform: 'translateY(-50%)',
  transition: 'all .4s ease-out',
  cursor: 'pointer',
  '::before': {
    content: "''",
    position: 'absolute',
    display: 'block',
    width: '90%',
    height: '1px',
    left: '5%',
    backgroundColor: '#1966db'
  },
  '::after': {
    content: "''",
    position: 'absolute',
    display: 'block',
    width: '90%',
    height: '1px',
    transform: 'rotate(-90deg)',
    marginLeft: '-45%',
    backgroundColor: '#1966db'
  },
  ':hover': {
    backgroundColor: '#E3CBCD'
  }
});

exports.default = Add;
},{"hyperapp":13,"picostyle":25}],8:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
* @Author: 28906
* @Date:   2018-01-06 01:01:44
* @Last Modified by:   28906
* @Last Modified time: 2018-01-16 17:29:36
* @Description: the todo pojo!
*/

var TODO = function () {
  function TODO(id, title, completed) {
    _classCallCheck(this, TODO);

    this.id = id;
    this.title = title;
    this.completed = completed || false;
  }

  _createClass(TODO, [{
    key: "toggle",
    value: function toggle() {
      this.completed = !completed;
    }
  }, {
    key: "setTitle",
    value: function setTitle(title) {
      this.title = title;
    }
  }]);

  return TODO;
}();

exports.default = TODO;
},{}],10:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/*
* @Author: 28906
* @Date:   2018-01-06 01:17:41
* @Last Modified by:   28906
* @Last Modified time: 2018-01-16 17:30:25
* @Description: a implements for the uuid
*/
var uuid = function uuid() {
  var uuid = '';
  for (var i = 0; i < 32; i++) {
    var random = Math.random() * 16 | 0;
    if (i === 8 || i === 12 || i === 16 || i === 20) {
      uuid += '-';
    }
    uuid += (i === 12 ? 4 : i === 16 ? random & 3 | 8 : random).toString(16);
  }
  return uuid;
};

exports.default = uuid;
},{}],9:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*
* @Author: 28906
* @Date:   2018-01-16 16:55:16
* @Last Modified by:   28906
* @Last Modified time: 2018-01-21 00:02:07
* @Description: simple implements a localStorage
*/

var store = {};

if (window.localStorage) {
  store.setItem = function (k, v) {
    if ((typeof v === "undefined" ? "undefined" : _typeof(v)) === 'object') {
      localStorage.setItem(k, JSON.stringify(v));
    } else {
      localStorage.setItem(k, v);
    }
  };

  store.getItem = function (k) {
    return JSON.parse(localStorage.getItem(k));
  };

  store.forEach = function (callback) {
    for (var i = 0, len = localStorage.length; i < len; i++) {
      callback(localStorage.getItem(localStorage.key(i)));
    }
  };

  store.clear = function () {
    localStorage.clear();
  };

  store.remove = function (key) {
    localStorage.removeItem(key);
  };

  store.update = function (key) {
    var temp = JSON.parse(localStorage.getItem(key));
    temp.completed = true;
    localStorage.setItem(key, JSON.stringify(temp));
  };
}

exports.default = store;
},{}],11:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _hyperapp = require("hyperapp");

var _input = require("./input.js");

var _input2 = _interopRequireDefault(_input);

var _inputclear = require("./inputclear.js");

var _inputclear2 = _interopRequireDefault(_inputclear);

var _add = require("./add.js");

var _add2 = _interopRequireDefault(_add);

var _todo = require("../../entity/todo.js");

var _todo2 = _interopRequireDefault(_todo);

var _uuid = require("../../utils/uuid.js");

var _uuid2 = _interopRequireDefault(_uuid);

var _store = require("../../utils/store.js");

var _store2 = _interopRequireDefault(_store);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// input
var userInput = function userInput(e, actions) {
  var keyCode = null;
  keyCode = e.which ? e.which : e.keyCode;
  if (keyCode === 13) {
    var val = e.target.value || '',
        key = (0, _uuid2.default)();
    if (val === '') return;
    var todo = new _todo2.default(key, val, false);
    _store2.default.setItem(key, todo);
    actions.add(todo);
  }
  e.stopPropagation();
};

// click
/*
* @Author: 28906
* @Date:   2018-01-10 09:55:44
* @Last Modified by:   28906
* @Last Modified time: 2018-01-20 22:26:24
* @Description: todo view
*/
var userClick = function userClick(e, actions) {
  var val = document.querySelector('#user-input').value || '',
      key = (0, _uuid2.default)();
  if (val === '') return;
  var todo = new _todo2.default(key, val, false);
  _store2.default.setItem(key, todo);
  actions.add(todo);
  e.stopPropagation();
};

// handle input clear
var handleInputClear = function handleInputClear(e) {
  document.querySelector('#user-input').value = '';
  e.target.style.display = 'none';
};

var TodoHeader = function TodoHeader(_ref) {
  var state = _ref.state,
      actions = _ref.actions;
  return (0, _hyperapp.h)(
    "section",
    null,
    (0, _hyperapp.h)(_input2.default, {
      placeholder: state.text,
      onkeypress: function onkeypress(e) {
        return userInput(e, actions);
      },
      id: "user-input",
      onchange: function onchange(e) {
        if (e.target.value !== '') {
          e.target.nextElementSibling.style.display = 'block';
        } else {
          e.target.nextElementSibling.style.display = 'none';
        }
      }
    }),
    (0, _hyperapp.h)(_inputclear2.default, {
      onclick: function onclick(e) {
        return handleInputClear(e);
      }
    }),
    (0, _hyperapp.h)(_add2.default, { onclick: function onclick(e) {
        return userClick(e, actions);
      } })
  );
};

exports.default = TodoHeader;
},{"hyperapp":13,"./input.js":14,"./inputclear.js":15,"./add.js":16,"../../entity/todo.js":8,"../../utils/uuid.js":10,"../../utils/store.js":9}],17:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _hyperapp = require("hyperapp");

var _picostyle = require("picostyle");

var _picostyle2 = _interopRequireDefault(_picostyle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
* @Author: 28906
* @Date:   2018-01-11 11:10:33
* @Last Modified by:   28906
* @Last Modified time: 2018-01-11 11:23:02
* @Description: td-body container view component
*/

var style = (0, _picostyle2.default)(_hyperapp.h);

var TdWrapper = style('section')({
  width: '100%',
  height: '420px',
  position: 'absolute',
  backgroundColor: '#fff',
  top: '120px',
  borderRadius: '4px',
  boxShadow: '0 0 5px 3px #E3CBCD'
});

exports.default = TdWrapper;
},{"hyperapp":13,"picostyle":25}],22:[function(require,module,exports) {
module.exports="/dist/4f420c4e7fb96d7421394a50a23c1824.png";
},{}],21:[function(require,module,exports) {
module.exports="/dist/17ba9af4eb4b49bbb5d5f13b24814e25.png";
},{}],18:[function(require,module,exports) {
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
* @Last Modified time: 2018-01-11 14:18:20
* @Description: label ciew component
*/

var style = (0, _picostyle2.default)(_hyperapp.h);

var ToDoLabelWrapper = style('a')({
  position: 'absolute',
  left: '0px',
  width: '32px',
  fontSize: '20px',
  color: 'white',
  borderRadius: '0 5px 5px 0',
  padding: '8px',
  textAlign: 'right',
  textDecoration: 'none',
  transition: 'width .3s ease-out',
  cursor: 'pointer',
  top: '100px',
  backgroundColor: '#F4E69F',
  ':hover': {
    width: '60px'
  }
});

var DoneLabelWrapper = style('a')({
  position: 'absolute',
  left: '0px',
  width: '32px',
  fontSize: '20px',
  color: 'white',
  borderRadius: '0 5px 5px 0',
  padding: '8px',
  textAlign: 'right',
  textDecoration: 'none',
  transition: 'width .3s ease-out',
  cursor: 'pointer',
  top: '180px',
  backgroundColor: '#BDDBEE',
  ':hover': {
    width: '60px'
  }
});

var TodoLabelImg = style('img')({
  width: '32px',
  height: '32px'
});

var DoneLabelImg = style('img')({
  width: '32px',
  height: '32px'
});

var Label = function Label(state, actions) {
  return (0, _hyperapp.h)(
    "section",
    null,
    (0, _hyperapp.h)(
      ToDoLabelWrapper,
      null,
      (0, _hyperapp.h)(TodoLabelImg, { src: _todo2.default })
    ),
    (0, _hyperapp.h)(
      DoneLabelWrapper,
      null,
      (0, _hyperapp.h)(DoneLabelImg, { src: _completed2.default })
    )
  );
};

exports.default = Label;
},{"hyperapp":13,"picostyle":25,"../../icons/todo.png":22,"../../icons/completed.png":21}],24:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _hyperapp = require("hyperapp");

var _picostyle = require("picostyle");

var _picostyle2 = _interopRequireDefault(_picostyle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
* @Author: 28906
* @Date:   2018-01-11 16:41:39
* @Last Modified by:   28906
* @Last Modified time: 2018-01-24 00:23:21
* @Description: pagenation component
*/

var style = (0, _picostyle2.default)(_hyperapp.h);

// pagenation wrapper
var PaginationWrapper = style('section')({
  position: 'absolute',
  right: '5%',
  top: '40%'
});

// common style
var commonStyle = {
  display: 'block',
  borderLeft: '8px solid transparent',
  borderRight: '8px solid transparent',
  cursor: 'pointer',
  transition: 'all .4s ease-out',
  ':hover': {
    transform: 'scale(1.8)'
  }

  // mixin the common style
};var UpPage = style('a')(Object.assign({
  marginBottom: '25px',
  borderTop: '8px solid transparent',
  borderBottom: '8px solid #F2A5A0'
}, commonStyle));

// mixin the common style
var DownPage = style('a')(Object.assign({
  borderTop: '8px solid #F2A5A0',
  borderBottom: '8px solid transparent'
}, commonStyle));

// simple implements pagenation
// page up
var pageUp = function pageUp(state, actions) {};
// page dowm
var pageDown = function pageDown(state, actions) {};
// view
var Pagination = function Pagination(_ref) {
  var state = _ref.state,
      actions = _ref.actions;
  return (0, _hyperapp.h)(
    PaginationWrapper,
    null,
    (0, _hyperapp.h)(UpPage, { onclick: function onclick() {
        return pageUp(state, actions);
      } }),
    (0, _hyperapp.h)(DownPage, { onclick: function onclick() {
        return pageDown(state, actions);
      } })
  );
};

exports.default = Pagination;
},{"hyperapp":13,"picostyle":25}],23:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _hyperapp = require("hyperapp");

var _picostyle = require("picostyle");

var _picostyle2 = _interopRequireDefault(_picostyle);

var _pagination = require("./pagination.js");

var _pagination2 = _interopRequireDefault(_pagination);

var _store = require("../../utils/store.js");

var _store2 = _interopRequireDefault(_store);

var _common = require("../../utils/common.js");

var _common2 = _interopRequireDefault(_common);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var style = (0, _picostyle2.default)(_hyperapp.h); /*
                                                   * @Author: 28906
                                                   * @Date:   2018-01-11 15:29:53
                                                   * @Last Modified by:   28906
                                                   * @Last Modified time: 2018-01-24 00:24:10
                                                   * @Description: content body component
                                                   */

var ContentBody = style('section')({
  position: 'absolute',
  top: '80px',
  width: '100%',
  bottom: '0'
});

var ContentListItem = style('li')({
  position: 'relative',
  listStyleType: 'none',
  padding: '16px',
  width: '80%',
  color: '#555',
  border: '1px solid #E3CBCD',
  borderRadius: '4px',
  marginTop: '5px'
});

var ContentDeleteLabel = style('a')(Object.assign({
  display: 'inline-block',
  float: 'right',
  position: 'relative'
}, _common2.default['del']));

var CompletedLabel = style('a')({
  display: 'inline-block',
  float: 'right',
  position: 'relative',
  width: '20px',
  height: '20px',
  borderRadius: '50%',
  border: '1px solid #E3CBCD',
  transition: 'all .4s ease-out',
  cursor: 'pointer',
  margin: '0 0 0 10px',
  '::before': {
    content: "''",
    position: 'absolute',
    width: '40%',
    height: '70%',
    left: '50%',
    borderBottom: '1px solid #E3CBCD',
    borderRight: '1px solid #E3CBCD',
    top: '0',
    transform: 'translateX(-50%) rotate(45deg)',
    display: 'block',
    backgroundColor: 'rgba(245, 245, 245, 0.5)'
  },
  ':hover': {
    transform: 'scale(1.3)',
    '-webkit-transform': 'scale(1.3)'
  }
});

var NoData = style('h4')({
  textAlign: 'center',
  fontSize: '20px',
  color: '#E3CBCD',
  paddingTop: '60px'
});

// delete todo item
var delItem = function delItem(item, state, actions) {
  actions.del(item);
  _store2.default.remove(item.id);
};

// completed item
var completedItem = function completedItem(item, state, actions) {
  actions.completed(item.id);
};

var ContentList = function ContentList(_ref) {
  var state = _ref.state,
      actions = _ref.actions;
  return (0, _hyperapp.h)(
    ContentBody,
    null,
    (0, _hyperapp.h)(
      "ul",
      null,
      state.todos.map(function (item) {
        return (0, _hyperapp.h)(
          ContentListItem,
          { key: item.id },
          (0, _hyperapp.h)(
            "span",
            null,
            item.title
          ),
          (0, _hyperapp.h)(CompletedLabel, { onclick: function onclick() {
              return completedItem(item, state, actions);
            } }),
          (0, _hyperapp.h)(ContentDeleteLabel, { onclick: function onclick() {
              return delItem(item, state, actions);
            } })
        );
      })
    ),
    (0, _hyperapp.h)(_pagination2.default, { state: state, actions: actions })
  );
};

exports.default = ContentList;
},{"hyperapp":13,"picostyle":25,"./pagination.js":24,"../../utils/store.js":9,"../../utils/common.js":20}],19:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _hyperapp = require("hyperapp");

var _picostyle = require("picostyle");

var _picostyle2 = _interopRequireDefault(_picostyle);

var _contentbody = require("./contentbody.js");

var _contentbody2 = _interopRequireDefault(_contentbody);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var style = (0, _picostyle2.default)(_hyperapp.h); /*
                                                   * @Author: 28906
                                                   * @Date:   2018-01-11 15:16:11
                                                   * @Last Modified by:   28906
                                                   * @Last Modified time: 2018-01-11 21:43:49
                                                   * @Description: todo content warpper component
                                                   */

var Content = style('section')({
  position: 'absolute',
  left: '100px',
  right: '5px',
  top: '5px',
  bottom: '5px',
  backgroundColor: 'rgba(245,245,245,0.5)'
});

var Title = style('h3')({
  textAlign: 'center',
  color: '#E3CBCD',
  fontSize: '24px'
});

var ContentWrapper = function ContentWrapper(_ref) {
  var state = _ref.state,
      actions = _ref.actions;
  return (0, _hyperapp.h)(
    Content,
    null,
    (0, _hyperapp.h)(
      Title,
      null,
      "todo list"
    ),
    (0, _hyperapp.h)(_contentbody2.default, { state: state, actions: actions })
  );
};

exports.default = ContentWrapper;
},{"hyperapp":13,"picostyle":25,"./contentbody.js":23}],12:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _hyperapp = require("hyperapp");

var _container = require("./container.js");

var _container2 = _interopRequireDefault(_container);

var _label = require("./label.js");

var _label2 = _interopRequireDefault(_label);

var _content = require("./content.js");

var _content2 = _interopRequireDefault(_content);

var _store = require("../../utils/store.js");

var _store2 = _interopRequireDefault(_store);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// get todos from web storage
var handleLocalStorageTodos = function handleLocalStorageTodos(state, actions) {
  actions.empty();
  _store2.default.forEach(function (item) {
    actions.add(JSON.parse(item));
  });
}; /*
   * @Author: 28906
   * @Date:   2018-01-11 11:05:52
   * @Last Modified by:   28906
   * @Last Modified time: 2018-01-24 00:13:06
   * @Description: todo view body
   */

var TdBody = function TdBody(_ref) {
  var state = _ref.state,
      actions = _ref.actions;
  return (0, _hyperapp.h)(
    _container2.default,
    { oncreate: function oncreate(e) {
        return handleLocalStorageTodos(state, actions);
      } },
    (0, _hyperapp.h)(_label2.default, null),
    (0, _hyperapp.h)(_content2.default, { state: state, actions: actions })
  );
};

exports.default = TdBody;
},{"hyperapp":13,"./container.js":17,"./label.js":18,"./content.js":19,"../../utils/store.js":9}],5:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _hyperapp = require("hyperapp");

var _picostyle = require("picostyle");

var _picostyle2 = _interopRequireDefault(_picostyle);

var _wrapper = require("./wrapper.js");

var _wrapper2 = _interopRequireDefault(_wrapper);

var _tdHeader = require("./td-header/");

var _tdHeader2 = _interopRequireDefault(_tdHeader);

var _tdBody = require("./td-body/");

var _tdBody2 = _interopRequireDefault(_tdBody);

var _store = require("../utils/store.js");

var _store2 = _interopRequireDefault(_store);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
* @Author: 28906
* @Date:   2018-01-06 01:33:37
* @Last Modified by:   28906
* @Last Modified time: 2018-01-21 00:30:00
* @Description: entry view wrapper
*/

var style = (0, _picostyle2.default)(_hyperapp.h);
var Container = style('section')({
  position: 'absolute',
  top: '90px',
  width: '70%',
  left: '50%',
  transform: 'translateX(-50%)',
  padding: '20px'
});

var view = function view(state, actions) {
  return (0, _hyperapp.h)(
    _wrapper2.default,
    null,
    (0, _hyperapp.h)(
      Container,
      null,
      (0, _hyperapp.h)(_tdHeader2.default, {
        state: state,
        actions: actions
      }),
      (0, _hyperapp.h)(_tdBody2.default, {
        state: state,
        actions: actions
      })
    )
  );
};

exports.default = view;
},{"hyperapp":13,"picostyle":25,"./wrapper.js":7,"./td-header/":11,"./td-body/":12,"../utils/store.js":9}],6:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _store = require("../utils/store.js");

var _store2 = _interopRequireDefault(_store);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /*
                                                                                                                                                                                                    * @Author: 28906
                                                                                                                                                                                                    * @Date:   2018-01-06 01:07:45
                                                                                                                                                                                                    * @Last Modified by:   28906
                                                                                                                                                                                                    * @Last Modified time: 2018-01-24 00:23:09
                                                                                                                                                                                                    * @Description: actions, change the state must use actions!
                                                                                                                                                                                                    */


var actions = {
  add: function add(todo) {
    return function (state) {
      return { todos: [].concat(_toConsumableArray(state.todos), [todo]) };
    };
  },
  del: function del(todo) {
    return function (state) {
      return state.todos = state.todos.filter(function (item) {
        return item.id !== todo.id;
      });
    };
  },
  empty: function empty() {
    return function (state) {
      return state.todos = [];
    };
  },
  completed: function completed(key) {
    return function (state) {
      [].concat(_toConsumableArray(state.todos)).map(function (item) {
        if (item.id === key) {
          item.completed = true;
          _store2.default.update(key);
        }
      });
    };
  }
};

exports.default = actions;
},{"../utils/store.js":9}],4:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _todo = require("../entity/todo.js");

var _todo2 = _interopRequireDefault(_todo);

var _uuid = require("../utils/uuid.js");

var _uuid2 = _interopRequireDefault(_uuid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
* @Author: 28906
* @Date:   2018-01-06 00:47:18
* @Last Modified by:   28906
* @Last Modified time: 2018-01-24 00:23:28
* @Description: state, compare with React state
*/
var state = {
  todos: [],
  text: 'what do you want to do?'
};

exports.default = state;
},{"../entity/todo.js":8,"../utils/uuid.js":10}],2:[function(require,module,exports) {
"use strict";

var _hyperapp = require("hyperapp");

var _index = require("./views/index.js");

var _index2 = _interopRequireDefault(_index);

var _actions = require("./actions/");

var _actions2 = _interopRequireDefault(_actions);

var _todos = require("./states/todos.js");

var _todos2 = _interopRequireDefault(_todos);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
* @Author: 28906
* @Date:   2018-01-05 15:59:29
* @Last Modified by:   28906
* @Last Modified time: 2018-01-11 20:32:06
* @Description: '入口'
*/

(0, _hyperapp.app)(_todos2.default, _actions2.default, _index2.default, document.body);
},{"hyperapp":13,"./views/index.js":5,"./actions/":6,"./states/todos.js":4}],0:[function(require,module,exports) {
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
  var ws = new WebSocket('ws://' + window.location.hostname + ':51677/');
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
},{}]},{},[0,2])