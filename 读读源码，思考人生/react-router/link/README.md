# Link

[源文档点击这里][1]

# props

## 1. to (string | object)

相当于 a 标签的 href。

```jsx
<Link to='/a/b?id=01'/>

<Link to={{
  pathname: '/a/b',
  search: '?id=01',
  hash: '',
  state: {}
}}/>
```

源码：

```js
const location =
  typeof to === "string"
    ? createLocation(to, null, null, history.location)
    : to;

const href = history.createHref(location);
```

## 2. replace (bool)

还记得 history 中的 API: replaceState 吗？

设置 replace 为 true，可以修改 history 栈，而不是添加。

```jsx
<Link to='/a/b?id=01' replace/>
```

源码：

```js
if (replace) {
  history.replace(to);
} else {
  history.push(to);
```

## 3. innerRef (func)

挂载后获取 dom 节点的方法。unmounted 的时候为 null。

```jsx
<Link to='/a' innerRef={node => {...}} />
```
源码：

```jsx
<a {...props} onClick={this.handleClick} href={href} ref={innerRef} />
```

# 源码分析

Link 最终是通过 a 标签实现的，所以最终返回的组件是这样的结构：

```jsx
<a {...props} onClick={this.handleClick} href={href} ref={innerRef} />
```
## 1. href 

通过 this.context.router 获取到传递过来的 history，然后通过 this.props.to 生成 href。

记住 location 的结构：
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

源码：

```jsx
const {replace, to, innerRef, ...props} = this.props;

// 验证 this.context.router, to 省略

const {history} = this.context.router;
const location = typeof to === 'string' ? createLocation(to, null, null, history.location) : to;
const href = history.createHref(location);
```

[createLocation][4], [createHref][3] 都是 history 中的方法。

## 2. handleClick

用户定义的 onClick 事件优先级最高。

```jsx
const isModifiedEvent = event =>
  !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);

handleClick = event => {
  if(this.props.onClick) this.props.onClick(event);
  if(
    !event.defaultPrevented && // 是否组织默认事件
    event.button === 0 && // 鼠标左击
    !this.props.target && // 有没有设置 target='_blank'这类的
    !isModifiedEvent(event) // 忽略点击修饰键
    ){
      event.preventDefault();
      const { history } = this.context.router;
      const { replace, to } = this.props;
      // 如果设置了 replace
      if (replace) {
        history.replace(to);
      } else {
        history.push(to);
      }
    }
}
```

[1]: https://reacttraining.com/react-router/web/api/Link
[2]: http://www.w3school.com.cn/html5/att_a_target.asp
[3]: https://github.com/ReactTraining/history/blob/master/modules/PathUtils.js
[4]: https://github.com/ReactTraining/history/blob/master/modules/LocationUtils.js