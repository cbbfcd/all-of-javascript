# Route

# 基础

[源文档点击这里][1]

Route 组件的作用是在 location 与 path 匹配 (match) 的时候，渲染对应的 UI。

## 1. Route render methods

Route 组件中提供了 3 种渲染的方式：

* component
* render
* children

这三种方式都被赋予了一样的参数: ({match, location, history})

### component (PropTypes.func)

only when location matches 的时候渲染。

使用component 的一个特点是会利用 React.createElement() 来创建一个新的 React 元素渲染传给 Route 的 component。

源码：

```jsx
if (component) return match ? React.createElement(component, props) : null;
```

Note:

当希望使用内联函数的时候 eg: ```<Route component={()=>someUI}/>```，如果是使用 component 渲染，就会在每次渲染的时候创建一个新的元素，就会不停的卸载现有组件，然后再挂载新的组件，而不是我们希望的单纯的更新现有组件就好，所以这种情况，请使用 render | children。

### render (PropTypes.func)

源码：

```jsx
if (render) return match ? render(props) : null;
```

所以使用 render 不必担心新建元素的困扰，我们可以大胆的使用内联函数。该函数会在 location matches 的时候被调用。

由于不会创建新的元素并进行卸载挂载，我们可以对需要渲染的元素进行针对于需要的场景进行自定义封装。

这种封装很多场景非常有用，比如我之前提到的利用 [react-motion 实现路由动画中][2]，就使用到了 render 渲染。

利用 render 实现的封装在某些动画场景中真的很有用：

```jsx
const FadeRoute = ({component: Component, ...rest}) => (
  <Route {...rest} render={props => (
    <FadeIn>
      <Component {...props}/>
    </FadeIn>
  )}
)
// use
<FadeRoute path='' component={} />
```
Note: 

component 的优先级是比 render 高的！

### children (PropTypes.oneOfType(```[PropTypes.func, PropTypes.node]```))

children 和 render 很相似，就是一点不同，children 无论 location matches 或者 no matches 都会触发！

源码：

```jsx
if (typeof children === "function") return children(props);
if (children && !isEmptyChildren(children))
  return React.Children.only(children); // 只能有并返回一个子元素
```

children 当然也是被赋予了 ({match, location, history}) 三个参数，只是要注意，在 location 没有 match 的时候，参数中的 match 为 null。

官方有一个 active link 的 demo:

```jsx
<ul>
  <ListItemLink to='/someurl'/>
  <ListItemLink to='/someother'/>
</ul>

const ListItemLink = ({to, ...rest}) => (
  <Route path={to} children={
    ({match})=>(
      <li className={match ? 'active' : ''>
        <Link to={to} {...rest}/>
      </li>
    )
  }/>
)
```

在动画中，children 也很有用，可以参考[react-motion 路由动画][3]。

Note: children 优先级较之前两个是最低的！

## 2. other basic props

### path: string

* 满足 [path-to-regexp][4]
* no path 的时候意味着 always match。

### exact: bool

path 是否精确匹配 location.pathname

|path | location.pathname | exact | matches?|
|- | :-: | -:| -:|
|/one | /one/two | true | no|
|/one | /one/two | false |  yes|

### strict: bool

strict === true 意味着 path 和 location.pathname 两者的尾部斜线一定要严格一致。

|path | location.pathname | matches?|
|- | :-: | -: |
|/one/ | /one | no|
|/one/ | /one/ | yes|
|/one/ | /one/two | yes|

当和 exact 搭配使用(both true):

|path | location.pathname | matches?|
|- | :-: | -: |
|/one | /one | yes|
|/one | /one/ | no|
|/one | /one/two | no|

### location: object

```jsx
{
  key: 'ac3df4', // not with HashHistory!
  pathname: '/somewhere'
  search: '?some=search-string',
  hash: '#howdy',
  state: {
    [userDefined]: true
  }
}
```

location 代表现在、过去、或者将来的位置对象。除了前边说的 3 种渲染方式之外，

router 为 withRouter() 也提供了 location，所以可以使用 withRouter 解决 [Mobx(observer) | Redux(connect) 中 blocked-update 的问题][5]。原理其实就是 withRouter 注入了 location，使得监听到了路由变化。

位置对象永远不会发生变化，因此您可以在生命周期钩子中使用它来确定何时导航，这对数据抓取和动画非常有用。

如果你还是对 location 感到陌生，那么官方给出的 demo 可能让你恍然大悟：

```jsx
// usually all you need
<Link to="/somewhere"/>

// but you can use a location instead
const location = {
  pathname: '/somewhere',
  state: { fromDashboard: true }
}

<Link to={location}/>
<Redirect to={location}/>
history.push(location)
history.replace(location)
```

这些都是我们常用的一些方式，其实都是在利用 location。

Note:

除此之外，你还可以把 location 传递给 Route | Swith 组件。

比如我前边提到的 [react-motion 实现的路由动画场景][2]中，就是把动画组件外边套了一个 Route 然后把它的 location 传递到了这个动画组件包裹的 Route 或者 Swith中，因为这样它们就会监听你传进去的 location，而忽略了自己'实际的' location，从而实现监听了浏览器的'路由位置变化'而做出反映。因此这种方式在动画中是很常见的！

### sensitive: bool

是否区分大小写

|path | location.pathname | sensitive | matches?|
|- | :-: | -:| -:|
|/one | /one | true | yes|
|/One | /one | true | no|
|/One | /one | false | yes|

# 源码分析




[1]: https://reacttraining.com/react-router/web/api/Route
[2]: https://github.com/cbbfcd/all-of-javascript/blob/master/%E5%BC%80%E6%BA%90%E9%A1%B9%E7%9B%AE/react-router-motion/src/lib/TransitionRoute.js
[3]: https://github.com/cbbfcd/all-of-javascript/blob/master/%E5%BC%80%E6%BA%90%E9%A1%B9%E7%9B%AE/react-router-motion/src/lib/TransitionSwitch.js
[4]: https://github.com/pillarjs/path-to-regexp
[5]: https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/guides/blocked-updates.md