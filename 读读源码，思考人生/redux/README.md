# redux

文章可能有点长。慎入!

[redux 的文档][1]

# index.js

[源码][2]

```js
// 省略
import ...

// 创建一个函数，通过其名字有没有改变判断代码是不是压缩了的。
function isCrushed() {}
// 如果在非生产环境下，使用了压缩的代码
if (
  process.env.NODE_ENV !== 'production' &&
  typeof isCrushed.name === 'string' &&
  isCrushed.name !== 'isCrushed'
) {
  warning(
    '你正在非生产环境使用压缩代码！'
  )
}

export {
  // redux 的所有核心 API
  createStore,
  combineReducers,
  bindActionCreators,
  applyMiddleware,
  compose,
  __DO_NOT_USE__ActionTypes
}
```

# createStore

[源码][3]

这里面引入了一个内部使用的 actionTypes 和判断是不是 plainObject 的工具方法

```js
export default function isPlainObject(obj) {
  if (typeof obj !== 'object' || obj === null) return false

  let proto = obj
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto)
  }
  // 如果原型链上除了 Object 之外还有别的层级，这里返回 false
  return Object.getPrototypeOf(obj) === proto
}
```

[createStore][4]:

```js
/**
* 参数：
* 1. reducer: rootReducers | combineReducers(reducers)
* 2. preloadedState: 同构应用中的 window.INIT_STATE 之类的
* 3. enhancer: compose(applyMiddleware(...middlewares), ...otherEnhancer);
*/
export default function createStore(reducer, preloadedState, enhancer) {
    /** 
    * 第一部分 
    */
    if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
      // 如果只传了两个参数，且第二个参数是函数的时候，第二个参数就是 enhancer
      enhancer = preloadedState
      preloadedState = undefined
    }
    
    if (typeof enhancer !== 'undefined') {
      if (typeof enhancer !== 'function') {
        throw new Error('Expected the enhancer to be a function.')
      }

      // 柯里化，返回一个store。
      return enhancer(createStore)(reducer, preloadedState)
    }

    if (typeof reducer !== 'function') {
      throw new Error('Expected the reducer to be a function.')
    }

    /** 
    * 第二部分 
    */
    let currentReducer = reducer // 存 reducer
    let currentState = preloadedState // 存 preloadedState
    let currentListeners = [] // 当前监听池
    let nextListeners = currentListeners 
    let isDispatching = false // 是否在执行 reducer
    
    // 更新 nextListeners 的值
    // 同时让 nextListeners 和 currentListeners 不会指向同一个内存空间
    function ensureCanMutateNextListeners() {
      if (nextListeners === currentListeners) {
        nextListeners = currentListeners.slice()
      }
    }

    // store.getState() 返回当前的 state
     function getState() {
      if (isDispatching) {
        throw new Error(
          '此时正在处理reducer!'
        )
      }

      return currentState
    }

    // store.subscrible(listener)
    // 注册监听函数，返回一个取消的方法
    function subscribe(listener) {
      if (typeof listener !== 'function') {
        throw new Error('listener必须是函数')
      }

      if (isDispatching) {
        throw new Error(
          '此时正在处理reducer!'
        )
      }

      let isSubscribed = true
      // 将监听放进 nextListeners 中
      ensureCanMutateNextListeners()
      nextListeners.push(listener)

      return function unsubscribe() {
        if (!isSubscribed) {
          return
        }

        if (isDispatching) {
          throw new Error(
            '此时正在处理reducer!'
          )
        }

        isSubscribed = false
        // 移除 listener
        ensureCanMutateNextListeners()
        const index = nextListeners.indexOf(listener)
        nextListeners.splice(index, 1)
      }
    }

    // store.dispatch(action)
    // action 就是把数据运送到 store 的载体
    // dispatch(action)是唯一改变 state 的方法
    function dispatch(action) {
      if (!isPlainObject(action)) {
        throw new Error(
          'Action必须是普通对象'
        )
      }

      if (typeof action.type === 'undefined') {
        throw new Error(
          'Action必须要有一个type属性'
        )
      }
      
      // 如果处于上一次 action 分发的过程中，可能会失败
      if (isDispatching) {
        throw new Error('Reducers may not dispatch actions.')
      }

      try {
        // 更新 state
        isDispatching = true
        currentState = currentReducer(currentState, action)
      } finally {
        // 无论如何都会执行
        isDispatching = false
      }

      // 触发监听
      const listeners = (currentListeners = nextListeners)
      for (let i = 0; i < listeners.length; i++) {
        const listener = listeners[i]
        listener()
      }
      
      return action
    }

    // replaceReducer
    function replaceReducer(nextReducer) {
      if (typeof nextReducer !== 'function') {
        throw new Error('Expected the nextReducer to be a function.')
      }
      // 替换当前的 reducer，并且分发一个内部定义的 action
      currentReducer = nextReducer
      dispatch({ type: ActionTypes.REPLACE })
    }

    // observable 对象方法，省略
    // ...

    // 发送初始化的 action
    // 返回 store 的 API
    dispatch({ type: ActionTypes.INIT })
    return {
      dispatch,
      subscribe,
      getState,
      replaceReducer,
      [$$observable]: observable
    }
}
```

# combineReducers

[源码][5]

```js
function getUndefinedStateErrorMessage(key, action) {
  // ...
  return (
    `reducer不要返回undefined,你可以返回null,或原来的state`
  )
}

// 1.是否传入了reducers参数
// 2.inputState是不是字面量对象
// 3.inputState的key必须在reducers的ownProperties中(不在原型链上),而且不能在unexpectedKeyCache中
// 返回错误信息
function getUnexpectedStateShapeWarningMessage(
  inputState,
  reducers,
  action,
  unexpectedKeyCache){
  // ...
}

// 1.每一个reducer在收到ActionTypes.INIT之后返回的state不能为undefined
// 2.每一个reducer在处理未知的action的时候不能返回undefined.
// 返回错误信息
function assertReducerShape(reducers){
  // ...
}

// combineReducers
// return rootReducer
export default function combineReducers(reducers) {
  const reducerKeys = Object.keys(reducers)
  const finalReducers = {}
  for (let i = 0; i < reducerKeys.length; i++) {
    const key = reducerKeys[i]
   
    // 非正式环境给一个提示
    if (process.env.NODE_ENV !== 'production') {
      if (typeof reducers[key] === 'undefined') {
        warning(`No reducer provided for key "${key}"`)
      }
    }
    
    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key]
    }
  }
  const finalReducerKeys = Object.keys(finalReducers)

  let unexpectedKeyCache
  if (process.env.NODE_ENV !== 'production') {
    unexpectedKeyCache = {}
  }

  let shapeAssertionError
  try {
    assertReducerShape(finalReducers)
  } catch (e) {
    shapeAssertionError = e
  }

  // return a rootReducer
  // 这个 rootReducer 会传入到 createStore(rootReducer)
  return function combination(state = {}, action) {
    if (shapeAssertionError) {
      throw shapeAssertionError
    }

    if (process.env.NODE_ENV !== 'production') {
      const warningMessage = getUnexpectedStateShapeWarningMessage(
        state,
        finalReducers,
        action,
        unexpectedKeyCache
      )
      if (warningMessage) {
        warning(warningMessage)
      }
    }

    let hasChanged = false
    const nextState = {}
    for (let i = 0; i < finalReducerKeys.length; i++) {
      const key = finalReducerKeys[i]
      const reducer = finalReducers[key]

      // 获取之前的state
      const previousStateForKey = state[key]

      // next state
      const nextStateForKey = reducer(previousStateForKey, action)
      if (typeof nextStateForKey === 'undefined') {
        const errorMessage = getUndefinedStateErrorMessage(key, action)
        throw new Error(errorMessage)
      }
      nextState[key] = nextStateForKey
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey
    }

    // 如果改变了
    return hasChanged ? nextState : state
  }
}
```
# bindActionCreators



[1]: http://cn.redux.js.org/docs/introduction/CoreConcepts.html
[2]: https://github.com/reactjs/redux/blob/master/src/index.js
[3]: https://github.com/reactjs/redux/blob/master/src/createStore.js
[4]: http://www.redux.org.cn/docs/api/createStore.html
[5]: https://github.com/reactjs/redux/blob/master/src/combineReducers.js
