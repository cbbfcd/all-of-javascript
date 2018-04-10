# react-router

---

## 前言

使用 react-router 也有一段时间了，现在基于[官方文档][3]以及[源码][7]做一下总结。

文章略长 ```^_^``` 如果有不正确的地方，请务必指正。

---

## 1. Router

Router 是一个公共的接口组件，有一个必须的参数 history。通过 [history][1] 库中的不同的 createXXXHistory 实现。

[官方文档点这里][2]

#### 源码：

```jsx
class Router extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired, // 由 history 库提供不同的实现
    children: PropTypes.node
  };
  // this.context.router
  static contextTypes = {
    router: PropTypes.object
  };

  static childContextTypes = {
    router: PropTypes.object.isRequired
  };
  // 将传入的 history mixin 到 this.context.router 中
  // 然后往下层传递
  getChildContext() {
    return {
      router: {
        ...this.context.router,
        history: this.props.history,
        route: {
          location: this.props.history.location,
          match: this.state.match
        }
      }
    };
  }
  
  state = {
    match: this.computeMatch(this.props.history.location.pathname)
  };
  // 初始化 computeMatch 返回的是一个 match 对象
  computeMatch(pathname) {
    return {
      path: "/",
      url: "/",
      params: {},
      isExact: pathname === "/"
    };
  }

  componentWillMount() {
    const { children, history } = this.props;
    // 要么没有 children, 要么只能有 1 个
    invariant(
      children == null || React.Children.count(children) === 1,
      "A <Router> may have only one child element"
    );

    // history 库中，发布-订阅模式实现的注册监听和触发通知
    // 当 history.push() 或者 replace() 执行 notifyListeners，
    // 因为注册监听函数的同时还开启了对 popstate 事件的监听
    // 所以回退、前进之类的操作同样会触发 notifyListeners

    // 这里在组件挂载前注册一个监听函数，触发后会更新 match 对象
    // 触发的时机就是一旦执行了 history.push() | history.replace() | popstate
    this.unlisten = history.listen(() => {
      this.setState({
        match: this.computeMatch(history.location.pathname)
      });
    });
  }

  componentWillReceiveProps(nextProps) {
    // 不能够改变 history 对象
    warning(
      this.props.history === nextProps.history,
      "You cannot change <Router history>"
    );
  }
  // 取消监听
  componentWillUnmount() {
    this.unlisten();
  }

  render() {
    const { children } = this.props;
    return children ? React.Children.only(children) : null;
  }
}
```

#### history 库中的相关代码片段：

*[发布-订阅模型][6]*：

```js
let listeners = [];
// 将监听函数加入到数组中
const appendListener = fn => {
  let isActive = true;
  // 柯里化
  const listener = (...args) => {
    if (isActive) fn(...args);
  };

  listeners.push(listener);
  // 执行返回的函数就会清除这个监听函数
  return () => {
    isActive = false;
    listeners = listeners.filter(item => item !== listener);
  };
};
// 通知函数，执行监听数组中的所有函数
const notifyListeners = (...args) => {
  listeners.forEach(listener => listener(...args));
};
```

*监听函数(以 [createBrowserRouter][4] 为例)*

```js
const listen = listener => {
  // 加入到监听函数数组
  const unlisten = transitionManager.appendListener(listener);
  // 1 -> window.addEventListener('popstate', handlePop)
  // 0 -> window.removeEventListener...
  checkDOMListeners(1);
  // 返回取消函数
  return () => {
    checkDOMListeners(-1);
    unlisten();
  };
};
```

*触发通知(以 [createBrowserRouter][4] 为例)*

```jsx
// 不管是 history.push() 或者是 replace()
// 亦或者是触发 popstate 事件的回调函数 handlePop 
// 最终都会执行一个 setState 函数
const setState = nextState => { 
  // nextState: {action, location}
  // 将 action 和 location 等 mixin 进 history 对象中。
  Object.assign(history, nextState);
  // 更新 history 堆栈的长度
  history.length = globalHistory.length;
  // 触发通知，执行监听函数
  transitionManager.notifyListeners(history.location, history.action);
};
```

将上面的过程串联起来(以 BrowserRouter 为例)：

Link | Redirect 组件中使用了 history.replace() 或者 history.push()，
或者是点击浏览器的前进、回退按钮，最终都会触发 history 去通知监听函数的执行。

这里假设是点击了 <pre><Link to='/a'></pre>
根据之前的分析，这里会执行 history.push() = history.pushState + setState

history.pushState 会往历史堆栈中加入一条记录，但是不会更新页面，只是url变了。这部分可以参见[这里][5]

setState的作用就是 mixin 一个 location 进 history 中，然后触发 notifyListeners。
这时候注册的监听函数触发，会根据 history 更新 match 对象，
假设有<pre><Route path='/a' exact component={A}></pre>
这时候 match 成功，就会马上 render A 组件。
---

## 2. BrowserRouter

利用公共 Router 接口，通过传入 [createBrowserHistory][8] 创建的历史记录实现。

```jsx
import { createBrowserHistory as createHistory } from "history";
history = createHistory(this.props);
render() {
  return <Router history={this.history} children={this.props.children} />;
}
```
其余 Router 组建同理，只是 history 的实现不同而已：

  2.1 [browser history][8]
  2.2 [hash history][9]
  2.3 [memory history][10] 


## 3. Route

这应该是最重要的组件了，当 location 与 Route's path 匹配的时候就会渲染组件。

[参数介绍][11]：

### 3.1 render 方式 

三种 render methods 的参数都是 props: ({match, location, history})

##### 3.1.1 component

当 match 的时候渲染，因为使用了 React.createElement(component, props) 创建新的组件进行渲染，所以当你使用 <pre><Route path='/a' component={()=>A}/></pre> 
这种内联函数的时候每一次渲染都会去创建一个新的组件，造成浪费。这种时候务必使用 render

PS: 优先级 component > render > children, 不要同时使用！

##### 3.1.2 render

同样是 match 的时候才会渲染。与 component 的区别就是没有使用 createElement, 你可以放心的使用内联函数。

PS: 优先级 component > render > children, 不要同时使用！

##### 3.1.3 children

children 可以是函数，也可以是子组件对象。
这里讨论是函数的情况，无论是否 match，都会执行。这种特性在动画中很有用处。

```jsx
<Route children={({ match, ...rest }) => (
  {/* Animate will always render, so you can use lifecycles
      to animate its child in and out */}
  <Animate>
    {match && <Something {...rest}/>}
  </Animate>
)}/>
```
PS: 优先级 component > render > children, 不要同时使用！

### 3.2 path 的匹配配置

react-router 是使用[正则进行路由的匹配的][12]。所以可以配置一些匹配的规则，

exact 表示精确匹配，严格一致<br/>
strict 表示结尾斜线的一致<br/>
sensitive 表示大小写一致<br/>

### 3.3 location参数

其实 Switch 组件同样也可以传入 location 参数，这样就可以去 match 一个当前 history location 之外的 location，这种应用场景常见于动画中！

比如这个利用 react-motion 实现的动画路由组件：[TransitionRoute][13]

PS: 如果给 Switch 中传入了一个 location，其子组件 Route 中的 location 将会被覆盖，这个在 Switch 源码中可以看到。

### 3.4 源码

```jsx
// 判断children是否为空
const isEmptyChildren = children => React.Children.count(children) === 0;

/**
 * The public API for matching a single path and rendering.
 */
class Route extends React.Component {
  static propTypes = {
    computedMatch: PropTypes.object, // 私有参数, from <Switch>
    path: PropTypes.string,
    exact: PropTypes.bool, // 严格匹配
    strict: PropTypes.bool, // 尾部斜线
    sensitive: PropTypes.bool, // 大小写
    component: PropTypes.func,
    render: PropTypes.func,
    children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
    location: PropTypes.object
  };
  // this.context.router
  static contextTypes = {
    router: PropTypes.shape({
      history: PropTypes.object.isRequired,
      route: PropTypes.object.isRequired,
      staticContext: PropTypes.object
    })
  };

  static childContextTypes = {
    router: PropTypes.object.isRequired
  };

  getChildContext() {
    return {
      router: {
        ...this.context.router,
        // 如果有 this.props.location
        // minxin 进 this.conotext.router 中传递
        route: {
          location: this.props.location || this.context.router.route.location,
          match: this.state.match
        }
      }
    };
  }

  state = {
    match: this.computeMatch(this.props, this.context.router)
  };
  // 返回 match 对象
  computeMatch(
    { computedMatch, location, path, strict, exact, sensitive },
    router
  ) {
    // 如果 Switch 把这事儿给你干了！
    if (computedMatch) return computedMatch;

    invariant(
      router,
      "You should not use <Route> or withRouter() outside a <Router>"
    );

    const { route } = router;
    // 如果传了 location 参数，用之！
    const pathname = (location || route.location).pathname;
    // 使用 path-to-regexp 去匹配
    // strict, exact, sensitive 是在这里作为配置参数
    return matchPath(pathname, { path, strict, exact, sensitive }, route.match);
  }

  componentWillMount() {
    // component 和 render 不能一起用，render 会被忽视
    warning(
      !(this.props.component && this.props.render),
      "You should not use <Route component> and <Route render> in the same route; <Route render> will be ignored"
    );
    // component 和 children 不能一起用，children 会被忽视
    warning(
      !(
        this.props.component &&
        this.props.children &&
        !isEmptyChildren(this.props.children)
      ),
      "You should not use <Route component> and <Route children> in the same route; <Route children> will be ignored"
    );
    // render 和 children 不能一起用，children 会被忽视
    warning(
      !(
        this.props.render &&
        this.props.children &&
        !isEmptyChildren(this.props.children)
      ),
      "You should not use <Route render> and <Route children> in the same route; <Route children> will be ignored"
    );
  }
  // 为了让location从一而终
  componentWillReceiveProps(nextProps, nextContext) {
    // location 这个东西啊，你开始的时候没传，后边就不能突然又有了。
    warning(
      !(nextProps.location && !this.props.location),
      '<Route> elements should not change from uncontrolled to controlled (or vice versa). You initially used no "location" prop and then provided one on a subsequent render.'
    );
    // location 这个东西啊，你开始的时候传了一个，后边就不能突然没有了。
    warning(
      !(!nextProps.location && this.props.location),
      '<Route> elements should not change from controlled to uncontrolled (or vice versa). You provided a "location" prop initially but omitted it on a subsequent render.'
    );
    // 如前面的分析，在监听到路由变化的时候，重新计算 match
    this.setState({
      match: this.computeMatch(nextProps, nextContext.router)
    });
  }

  render() {
    const { match } = this.state;
    const { children, component, render } = this.props;
    const { history, route, staticContext } = this.context.router;
    const location = this.props.location || route.location;
    // 三种渲染函数的参数
    const props = { match, location, history, staticContext };
    // match && createElement()
    if (component) return match ? React.createElement(component, props) : null;
    // match && render()
    if (render) return match ? render(props) : null;
    // 不管 match 与否
    if (typeof children === "function") return children(props);

    if (children && !isEmptyChildren(children))
      return React.Children.only(children);

    return null;
  }
}
```

## 4. Link

[参数说明可以参见这里][14]

### 4.1 to: (string | obj)

可以是对象{pathname, search, hash, state}<br/>
可以拼接成字符串 '/a?sort=name#foo'

### 4.2 replace: bool

```js
if(replace){
 history.replace(to);
}else{
  history.push(to)
}
```

### 4.3 innerRef: func

获取 DOM 节点

```jsx
refCallBack = node => { ... }
<Link to='/a' innerRef={refCallBack} />
```

### 4.4 源码
 
```jsx
// 判断这几个键是不是被摁了
const isModifiedEvent = event =>
  !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);

/**
 * The public API for rendering a history-aware <a>.
 */
class Link extends React.Component {
  static propTypes = {
    onClick: PropTypes.func,
    target: PropTypes.string,
    replace: PropTypes.bool,
    to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    innerRef: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
  };

  static defaultProps = {
    replace: false
  };
  // this.context.router
  static contextTypes = {
    router: PropTypes.shape({
      history: PropTypes.shape({
        push: PropTypes.func.isRequired,
        replace: PropTypes.func.isRequired,
        createHref: PropTypes.func.isRequired
      }).isRequired
    }).isRequired
  };

  handleClick = event => {
    // 执行用户定义的点击事件
    if (this.props.onClick) this.props.onClick(event);

    if (
      !event.defaultPrevented && // 没有阻止默认事件
      event.button === 0 && // 左点击
      !this.props.target && // 没有 "target=_blank" 之类的
      !isModifiedEvent(event) // ignore clicks with modifier keys
    ) {
      event.preventDefault(); // 阻止默认事件

      const { history } = this.context.router;
      const { replace, to } = this.props;
      // 这里会触发 notifyListeners 去通知注册的监听事件执行
      // replace -> replaceState
      // push -> pushState
      if (replace) {
        history.replace(to);
      } else {
        history.push(to);
      }
    }
  };

  render() {
    const { replace, to, innerRef, ...props } = this.props;
    invariant(
      this.context.router,
      "You should not use <Link> outside a <Router>"
    );

    invariant(to !== undefined, 'You must specify the "to" property');

    const { history } = this.context.router;
    const location =
      typeof to === "string"
        ? createLocation(to, null, null, history.location)
        : to;

    const href = history.createHref(location);
    return (
      <a {...props} onClick={this.handleClick} href={href} ref={innerRef} />
    );
  }
}
```

## 5. Switch

[参数说明可以参见这里][15]

Switch 的作用是只渲染第一个匹配到的 Route 或者 Redirect 组件。
可以传入一个 location 给 Switch，这种方式在动画场景很常见。
比如: [TransitionSwitch][16]

PS: Switch 匹配的是 Redirect 中的 from , 这个 from 和 Route's path 是差不多的，同样可以设置  exact, and strict。

### 5.1 源码

```jsx
/**
 * The public API for rendering the first <Route> that matches.
 */
class Switch extends React.Component {
  // this.context.router
  static contextTypes = {
    router: PropTypes.shape({
      route: PropTypes.object.isRequired
    }).isRequired
  };

  static propTypes = {
    children: PropTypes.node,
    // 可以传入一个 location, 
    // 使之不再监听当前的 history location (usually the current browser URL)
    location: PropTypes.object 
  };

  componentWillMount() {
    invariant(
      this.context.router,
      "You should not use <Switch> outside a <Router>"
    );
  }
  // 确保 location 从一而终
  componentWillReceiveProps(nextProps) {
    warning(
      !(nextProps.location && !this.props.location),
      '<Switch> elements should not change from uncontrolled to controlled (or vice versa). You initially used no "location" prop and then provided one on a subsequent render.'
    );

    warning(
      !(!nextProps.location && this.props.location),
      '<Switch> elements should not change from controlled to uncontrolled (or vice versa). You provided a "location" prop initially but omitted it on a subsequent render.'
    );
  }

  render() {
    const { route } = this.context.router;
    const { children } = this.props;
    const location = this.props.location || route.location;

    let match, child;
    React.Children.forEach(children, element => {
      // 这里保证只会执行第一次匹配到的
      if (match == null && React.isValidElement(element)) {
        const {
          path: pathProp,
          exact,
          strict,
          sensitive,
          from // Redirect 中的 from
        } = element.props;
        const path = pathProp || from;

        child = element;
        match = matchPath(
          location.pathname,
          { path, exact, strict, sensitive },
          route.match
        );
      }
    });
    // 覆盖了子组件的 location
    // 传递 computedMatch 给子组件，使其渲染组件。 
    return match
      ? React.cloneElement(child, { location, computedMatch: match })
      : null;
  }
}
```

## 6. Redirect

会覆盖当前的 history.location, 就像HTTP's 3XX.

[参数说明可以参见这里][17]

## 6.1 props

to: string | object 

同 Link's to.

from: string

这个只能在 Switch 标签包裹的情况下使用。

push: bool

```jsx
if(push) history.push(to);
```

## 6.2 源码

```jsx
/**
 * The public API for updating the location programmatically
 * with a component.
 */
class Redirect extends React.Component {
  static propTypes = {
    computedMatch: PropTypes.object, // private, from <Switch>
    push: PropTypes.bool,
    from: PropTypes.string,
    to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired
  };

  static defaultProps = {
    push: false
  };

  static contextTypes = {
    router: PropTypes.shape({
      history: PropTypes.shape({
        push: PropTypes.func.isRequired,
        replace: PropTypes.func.isRequired
      }).isRequired,
      staticContext: PropTypes.object
    }).isRequired
  };
  
  // staticContext 只在 <StaticRouter> 也就是 SSR 的情况下存在。
  // 判断是不是服务端渲染
  isStatic() {
    return this.context.router && this.context.router.staticContext;
  }

  componentWillMount() {
    invariant(
      this.context.router,
      "You should not use <Redirect> outside a <Router>"
    );
    
    if (this.isStatic()) this.perform(); // SSR
  }

  componentDidMount() {
    if (!this.isStatic()) this.perform(); // 非 SSR
  }
  // re-render 之后触发，判断是不是重定向到当前的 route。
  componentDidUpdate(prevProps) {
    const prevTo = createLocation(prevProps.to);
    const nextTo = createLocation(this.props.to);

    if (locationsAreEqual(prevTo, nextTo)) {
      warning(
        false,
        `You tried to redirect to the same route you're currently on: ` +
          `"${nextTo.pathname}${nextTo.search}"`
      );
      return;
    }

    this.perform();
  }
  // 计算路径
  // 带上 Switch 中传过来的 match 对象参数
  computeTo({ computedMatch, to }) {
    if (computedMatch) {
      if (typeof to === "string") {
        return generatePath(to, computedMatch.params);
      } else {
        return {
          ...to,
          pathname: generatePath(to.pathname, computedMatch.params)
        };
      }
    }

    return to;
  }
  // 改变历史堆栈记录，触发监听事件执行
  perform() {
    const { history } = this.context.router;
    const { push } = this.props;
    const to = this.computeTo(this.props);

    if (push) {
      history.push(to);
    } else {
      history.replace(to);
    }
  }

  render() {
    return null;
  }
}
```

## 7. Prompt

[参数说明可以参见这里][18]

[官方demo][19]

相当于 window.confirm 的功效。

用于在导航离开页面之前提示用户。 当你的应用程序进入一个应该阻止用户导航的状态时（比如一个表单被填满了一半,你就想跳转到别的地方去），呈现一个```<Prompt>```。

## 7.1 message: string | func

将在用户尝试导航到的下一个位置和操作中调用.

返回一个字符串以向用户显示提示，或者返回 true 以允许转换。

message 函数的参数是 ({location, action})

```jsx
<Prompt message={location => (
  location.pathname.startsWith('/app') ? true : `Are you sure you want to go to ${location.pathname}?`
)}/>
```
## 7.2 when: bool

when 为 true 的时候就会 always render it! 默认值就是 true.

通过 when 来允许或者阻止用户的导航。

## 7.3 源码

### 7.3.1 history 库中的相关函数代码片段

```jsx
let isBlocked = false;
// history.block() 函数
// 设置 prompt， 其实就是上边说的 message
const block = (prompt = false) => {
  const unblock = transitionManager.setPrompt(prompt);

  if (!isBlocked) {
    checkDOMListeners(1); // 监听 popstate 事件
    isBlocked = true;
  }
  // 返回一个取消函数
  return () => {
    if (isBlocked) {
      isBlocked = false;
      checkDOMListeners(-1); // 取消监听 popstate
    }

    return unblock(); // 设置 prompt = null
  };
};
// transition to 函数
// 执行 push replace 或者 popstate 事件触发，都会走这个函数
// 所以设置了 prompt 之后，点击别的 link 或者浏览器的回退按钮之类的都会
// 触发这个函数，弹出用户提示信息或者直接允许
// 而 history.push 或者 replace 中触发监听的逻辑则是在 callback 中实现的
// 这种编程设计很是巧妙！是不是有 AOP 的感觉？
const confirmTransitionTo = (
    location,
    action,
    getUserConfirmation, // 这个其实就是 window.confirm(message: string)
    callback
  ) => {
    // prompt 就是 Prompt 组件中的 message！
    if (prompt != null) {
      // message 可以是函数也可以是字符串
      const result =
        typeof prompt === "function" ? prompt(location, action) : prompt;

      if (typeof result === "string") {
        if (typeof getUserConfirmation === "function") {
          // getUserConfirmation 其实就是封装的 window.confirm
          getUserConfirmation(result, callback);
        } else {
          warning(
            false,
            "A history needs a getUserConfirmation function in order to use a prompt message"
          );

          callback(true);
        }
      } else {
        // message 函数返回 bool 的情况，
        // 如果返回 true，表示允许，执行 cb(true)
        callback(result !== false);
      }
    } else {
      callback(true);
    }
  };
```
### 7.3.2 Prompt 源码 

```jsx
/**
 * The public API for prompting the user before navigating away
 * from a screen with a component.
 */
class Prompt extends React.Component {
  static propTypes = {
    when: PropTypes.bool,
    message: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired
  };

  static defaultProps = {
    when: true
  };

  static contextTypes = {
    router: PropTypes.shape({
      history: PropTypes.shape({
        block: PropTypes.func.isRequired
      }).isRequired
    }).isRequired
  };
  // 设置 message
  enable(message) {
    if (this.unblock) this.unblock();

    this.unblock = this.context.router.history.block(message);
  }
  // 取消
  disable() {
    if (this.unblock) {
      this.unblock();
      this.unblock = null;
    }
  }

  componentWillMount() {
    invariant(
      this.context.router,
      "You should not use <Prompt> outside a <Router>"
    );
    // 初始化设置 prompt
    if (this.props.when) this.enable(this.props.message);
  }
  // 当接收到新的 props 的时候
  // 比如上面说的官方 demo 中, when 的值改变的时机触发
  componentWillReceiveProps(nextProps) {
    if (nextProps.when) {
      if (!this.props.when || this.props.message !== nextProps.message)
        this.enable(nextProps.message);
    } else {
      this.disable();
    }
  }

  componentWillUnmount() {
    this.disable();
  }

  render() {
    return null;
  }
}
```

## 8. withRouter

常用的一个高阶组件。可以随时随地的把 updated match, location, and history props

传递给 wrapped component. 这也是它可以解决 [update blocking][21] 问题的原因。

[官方文档了解一下?][20]

源码：

```jsx
/**
 * A public higher-order component to access the imperative API
 */
const withRouter = Component => {
  // a stateless component
  const C = props => {
    const { wrappedComponentRef, ...remainingProps } = props;
    return (
      // inject history, location, match 到 Component 中
      <Route
        children={routeComponentProps => (
          <Component
            {...remainingProps}
            {...routeComponentProps}
            ref={wrappedComponentRef}
          />
        )}
      />
    );
  };
  // for debug
  C.displayName = `withRouter(${Component.displayName || Component.name})`;
  C.WrappedComponent = Component; // 可以用来测试
  C.propTypes = {
    wrappedComponentRef: PropTypes.func
  };
  // Copies non-react specific statics from a child component to a parent component
  // hoistStatics(target, source)
  // 类似于一个排除了 react static keywords 的 Object.assign 方法
  return hoistStatics(C, Component);
};
```

## 9. matchPath

一个工具函数，参数是 pathname 和 Route 中接收到的 path, exact 等参数，

返回一个 match 对象。服务端渲染的时候 path 可能就是 req.path。

[文档了解一下?][22]

源码:

[path-to-regexp][12]

```js
var keys = []
var re = pathToRegexp('/foo/:bar', keys, {end, sensitive, strict})
// re = /^\/foo\/([^\/]+?)\/?$/i
// keys = [{ name: 'bar', prefix: '/', delimiter: '/', optional: false, repeat: false, pattern: '[^\\/]+?' }]
```
matchPath:

```js
import pathToRegexp from "path-to-regexp";

// 缓存
const patternCache = {};
const cacheLimit = 10000;
let cacheCount = 0;

// 从缓存中取出 compiledPattern
const compilePath = (pattern, options) => {

  // 缓存 options 配置一样的，存到 cache 中
  // 所以 patternCache 最多只能缓存 2*2*2 个对象。
  // 因为 key 只有 8 种组合，'truefalsefalse', 'truetruetrue', ...

  const cacheKey = `${options.end}${options.strict}${options.sensitive}`;
  const cache = patternCache[cacheKey] || (patternCache[cacheKey] = {});

  // 再从 cache 中根据 pattern 取数据
  if (cache[pattern]) return cache[pattern];

  // 如果 cache 中没有就存进去
  // 这时候可能就会有很多情况了，因为 path 是不确定的，所以要有 limit
  const keys = [];
  const re = pathToRegexp(pattern, keys, options);
  const compiledPattern = { re, keys };

  if (cacheCount < cacheLimit) {
    cache[pattern] = compiledPattern;
    cacheCount++;
  }

  return compiledPattern;
};

/**
 * Public API for matching a URL pathname to a path pattern.
 */
const matchPath = (pathname, options = {}, parent) => {
  // 封装 options 对象
  if (typeof options === "string") options = { path: options };
  const { path, exact = false, strict = false, sensitive = false } = options;

  // parent 就是指最近的 parent's match
  if (path == null) return parent;

  const { re, keys } = compilePath(path, { end: exact, strict, sensitive });
  // match 是一个数组 like: ['/test/route', 'test', 'route']
  const match = re.exec(pathname);

  if (!match) return null;

  const [url, ...values] = match;
  const isExact = pathname === url;
  // 严格匹配
  if (exact && !isExact) return null;
  // 返回一个 match 对象
  return {
    path, 
    url: path === "/" && url === "" ? "/" : url, 
    isExact, 
    // 这里获取参数
    // 比如 path: '/:foo', pathname: '/a'
    // 匹配得到的 keys: [{name: 'foo', ...}], match: ['/a', 'a'], values: ['a']
    params: keys.reduce((memo, key, index) => {
      memo[key.name] = values[index];
      return memo;
    }, {})
  };
};
```

[1]: https://github.com/ReactTraining/history
[2]: https://reacttraining.com/react-router/web/api/Router
[3]: https://reacttraining.com/react-router/
[4]: https://github.com/ReactTraining/history/blob/master/modules/createBrowserHistory.js
[5]: https://developer.mozilla.org/en-US/docs/Web/API/History
[6]: https://github.com/ReactTraining/history/blob/master/modules/createTransitionManager.js
[7]: https://github.com/ReactTraining/react-router/
[8]: https://github.com/ReactTraining/history/blob/master/modules/createBrowserHistory.js
[9]: https://github.com/ReactTraining/history/blob/master/modules/createHashHistory.js
[10]: https://github.com/ReactTraining/history/blob/master/modules/createMemoryHistory.js
[11]: https://reacttraining.com/react-router/web/api/Route
[12]: https://github.com/pillarjs/path-to-regexp
[13]: https://github.com/cbbfcd/all-of-javascript/blob/master/%E5%BC%80%E6%BA%90%E9%A1%B9%E7%9B%AE/react-router-motion/src/lib/TransitionRoute.js
[14]: https://reacttraining.com/react-router/web/api/Link
[15]: https://reacttraining.com/react-router/web/api/Switch
[16]: https://github.com/cbbfcd/all-of-javascript/blob/master/%E5%BC%80%E6%BA%90%E9%A1%B9%E7%9B%AE/react-router-motion/src/lib/TransitionSwitch.js
[17]: https://reacttraining.com/react-router/web/api/Redirect
[18]: https://reacttraining.com/react-router/core/api/Prompt
[19]: https://reacttraining.com/react-router/web/example/preventing-transitions
[20]: https://reacttraining.com/react-router/web/api/withRouter
[21]: https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/guides/blocked-updates.md
[22]: https://reacttraining.com/react-router/web/api/matchPath