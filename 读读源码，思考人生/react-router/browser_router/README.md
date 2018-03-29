# BrowserRouter

[源文档点击这里][1]

# props

[HTML5 History API][4] (pushState, replaceState and the popstate event)

## 1. basename: string

The base URL for all locations。必须有一个 "/" 在前边。

```jsx
<BrowserRouter basename="/calendar"/>
<Link to="/today"/> // renders <a href="/calendar/today">
```

## 2. getUserConfirmation: func

window.confirm 而已

## 3. forceRefresh: bool

full page refreshes on page navigation！！

当你的浏览器不支持 [HTML5 History API][4] 的时候~

## 4. keyLength: number

key 的长度，默认是 6

# 源码

使用了 [history][3] 库中的 [createBrowserHistory][2] 来创建 history。

[1]: https://reacttraining.com/react-router/web/api/BrowserRouter
[2]: https://github.com/ReactTraining/history/blob/master/modules/createBrowserHistory.js
[3]: https://github.com/ReactTraining/history
[4]: https://developer.mozilla.org/zh-CN/docs/Web/API/History_API