# Switch

# 基础

[源文档点击这里][1]

我们知道 Route 标签是当 match 的时候就会渲染，那么在多个 Route 的时候就会有多个渲染的情况：

```jsx
<Route path='/about' render={} />
<Route path='/:id' render={} />
<Route component={NoMatch}/>
```
上面的路由，假如 /about 路径，都会触发渲染。

Switch 的作用就是避免这种情况，只会渲染第一个匹配到的。

这样也有利于在同一位置做动画的过渡效果。

switch 是可以接受一个 location 参数的，之前在 [react-motion][2] 的路由动画中，用到了这个特点，使得 switch 可以接收一个 location 保持对路由的监听。

# 源码

```jsx
render() {
  const { route } = this.context.router;
  const { children } = this.props;
  const location = this.props.location || route.location;

  let match, child;
  React.Children.forEach(children, element => {
    // 如果 match 到了，就不会再执行后边的了。所以是只渲染第一个匹配到的
    if (match == null && React.isValidElement(element)) {
      const {
        path: pathProp,
        exact,
        strict,
        sensitive,
        from // ? <Redirect>
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
  // clone 一个子元素，并且传进去 location 和 computedMatch.
  // computedMatch 传递给 Route 之后，就会快速渲染
  return match
    ? React.cloneElement(child, { location, computedMatch: match })
    : null;
}
```



[1]: https://reacttraining.com/react-router/web/api/Switch
[2]: https://github.com/cbbfcd/all-of-javascript/blob/master/%E5%BC%80%E6%BA%90%E9%A1%B9%E7%9B%AE/react-router-motion/README.md