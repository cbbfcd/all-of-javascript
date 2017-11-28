# React Internals, Part One: basic rendering

重新写一个我们自己的的React一共分为了5个系列。 完成之后，你应该对React如何工作，以及何时和为什么要调用组件的各种生命周期方法有一个很好的把握。


# 特别声明

这个系列是基于React15.3，特别是使用ReactDOM和 stack reconciler (协调器)。因此对于最新的Fiber是不适用的，我们会自己构建一个React，但是不会实现所有的部分，只是尽可能的反映出React的特点。


# 背景: Elements and Components

React的核心是三种不同类型的实体：本地DOM元素，虚拟元素和组件。

1. native DOM elements ( 本地DOM元素 )
    
    正如其名，本地DOM元素实际上就是浏览器用来构建网页的构件块。在某些时刻，React 会调用 document.createElement() 来创建一个。并使用浏览器的 DOM API 来更新它们，比如 element.insertBefore()，element.nodeValue 等。

2. virtual React elements

    一个虚拟的 React 元素(在源代码里叫做"元素")是一种内存表现形式。

    用于表示对给定的 DOM 元素(或者整个元素树)做特定的渲染。一个元素可以直接表示一个DOM元素，例如h1，div等。或者它可以表示一个用户定义的复合组件，这在下面解释。

3. Components 

    "组件"是 React 中一个非常通用的术语。 他们是 React 中的各种类型的工作的实体。不同类型的组件做不同的事情。例如，来自 ReactDOM 的 ReactDOMComponent 负责在 React 元素和它们相应的本地 DOM 元素之间进行桥接。

## 用户定义的复合组件

你其实已经熟悉了这种类型的组件：复合组件，只是你还不知道。 

每当你调用 React.createClass()，或者使用一个 es6 类扩展 React.Component 时，你就正在创建一个复合组件类。 

事实上，我们使用的 componentWillMount，shouldComponentUpdate 等组件的生命周期 hook 只是复合组件类中的一部分。

React组件还有其他的生命周期方法，比如 mountComponent 和 receiveComponent。 我们从来没有实现，调用它们，甚至不知道这些其他生命周期方法的存在。因为它们只在 React 内部使用。

事实是我们创建的组件是不完整的。React 将采用我们的组件类，并将其包装在一个 ReactCompositeComponentWrapper 中，然后给予我们编写的组件完整的生命周期钩子以及参与进React的能力。


# React 是声明式的

说到组件，我们的工作就是定义组件类。但我们从来没有实例化它们。相反，React会在需要的时候实例化一个类的实例。

当我们使用 JSX 编写的时候，可能已经隐式的实例化了元素:

```
class myComponent extends React.Component{
    render(){
        return <div>hello</div>;
    }
}
```

上面的代码会被编译器翻译为：

```
class MyComponent extends React.Component {
    render() {
        return React.createElement('div', null, 'hello');
    }
}
```

所以从某种意义上讲，我们正在创建一个元素，因为我们的代码会调用 React.createElement()。

但是从另一个角度来说，又并不是，因为它需要React实例化我们的组件，然后为我们调用 render()。

最简单的方式去理解React是声明式的。就是我们描述我们想要的，而React则会去实现它。

# 一个轻量级、假的React，叫做Feact

现在我们开始编写我们的轻量级的、假的React，我们给它取名叫做Feact。因为是fake的。

我们希望我们也能这样使用:

```
Feact.render(<h1>hello world</h1>, document.getElementById('root'));
```

我们不会去实现一个JSX语法。假设我们已经实现了，我们的代码编译后就是:

```
Feact.render(
    Feact.createElement('h1', null, 'hello world'),
    document.getElementById('root')
);
```

JSX本身就是一个很大的话题，让我们有点分心。所以从这里开始，我们将使用Feact.createElement而不是JSX，所以让我们继续实现它。

```
const Feact = {
    createElement(type, props, children) {
        const element = {
            type,
            props: props || {}
        };

        if (children) {
            element.props.children = children;
        }

        return element;
    }
};
```

元素只是表示我们想要渲染的东西的简单对象。

## Feact.render() 应该做什么？

我们调用Feact.render()的时候传递了我们想要渲染的东西以及它应该去的地方。这是任何Feact应用程序的起点。对于我们的第一次尝试，让我们定义render()看起来像这样

```
const Feact = {
    createElement() { /* as before */ },

    render(element, container) {
        const componentInstance = new FeactDOMComponent(element);
        return componentInstance.mountComponent(container);
    }
};
```

所以我们知道了 FeactDOMComponent 才是真正为我们创建 DOM 的。让我们继续前进：

```
class FeactDOMComponent {
    constructor(element) {
        this._currentElement = element;
    }

    mountComponent(container) {
        const domElement = document.createElement(this._currentElement.type);
        const text = this._currentElement.props.children;
        const textNode = document.createTextNode(text);
        domElement.appendChild(textNode);

        container.appendChild(domElement);

        this._hostNode = domElement;
        return domElement;
    }
}
```

这里用 *_hostNode* 存储了我们创建的DOM。后边会用到。

## 添加用户定义的组件

```
const Feact = {
    createClass(spec) {
        function Constructor(props) {
            this.props = props;
        }

        Constructor.prototype.render = spec.render;

        return Constructor;
    }, 

    render(element, container) {
        // 我们之前的实现并不能很好的应用于用户自定义的组件。
        // 我们需要重新思考。
    }
};

const MyTitle = Feact.createClass({
    render() {
        return Feact.createElement('h1', null, this.props.message);
    }
};

Feact.render({
    Feact.createElement(MyTitle, { message: 'hey there Feact' }),
    document.getElementById('root')
);
```

我们没有使用JSX语法，但是如果使用JSX，上面的代码其实就是这样:

```
Feact.render(
    <MyTitle message="hey there Feact" />,
    document.getElementById('root')
);
```

我们将组件类传递给createElement。一个元素可以表示一个基本的DOM元素，或者它可以表示一个复合组件。

区别很简单，如果type是一个字符串，则该元素是一个基本元素。如果它是一个函数，则该元素表示一个复合组件。

## 改进 Feact.render()

为了解决处理复合组件的问题，我们改进我们的Feact.render()如下:

```
Feact = {
    render(element, container) {
        const componentInstance = new FeactCompositeComponentWrapper(element);
        return componentInstance.mountComponent(container);
    }
}

class FeactCompositeComponentWrapper {
    constructor(element) {
        this._currentElement = element;
    }

    mountComponent(container) {
        const Component = this._currentElement.type;
        const componentInstance = new Component(this._currentElement.props);
        const element = componentInstance.render();

        const domComponentInstance = new FeactDOMComponent(element);
        return domComponentInstance.mountComponent(container);
    }
}
```

## 复合组件的改进

目前我们的复合组件必须返回表示原始DOM节点的元素，我们不能返回其他复合组件元素。 我们来解决这个问题。 我们希望能够做到这一点:

```
const MyMessage = Feact.createClass({
    render() {
        if (this.props.asTitle) {
            return Feact.createElement(MyTitle, {
                message: this.props.message
            });
        } else {
            return Feact.createElement('p', null, this.props.message);
        }
    }
}
```

我们改进一下我们的FeactCompositeComponentWrapper

```
class FeactCompositeComponentWrapper {
    constructor(element) {
        this._currentElement = element;
    }

    mountComponent(container) {
        const Component = this._currentElement.type;
        const componentInstance = new Component(this._currentElement.props);
        let element = componentInstance.render();

        while (typeof element.type === 'function') {
            element = (new element.type(element.props)).render();
        }

        const domComponentInstance = new FeactDOMComponent(element);
        domComponentInstance.mountComponent(container);
    }
}
```

## 再次修复Feact.render()

Feact.render()的第一个版本只能处理原始元素。现在只能处理复合元素。它需要能够处理两者。我们可以编写一个“工厂”函数，根据元素的类型为我们创建一个组件，但React还有另一种方法。由于FeactCompositeComponentWrapper组件最终产生一个FeactDOMComponent，我们只需要把我们提供的任何元素包装起来，这样我们就可以使用FeactCompositeComponentWrapper。

```
const TopLevelWrapper = function(props) {
    this.props = props;
};

TopLevelWrapper.prototype.render = function() {
    return this.props;
};

const Feact = {
    render(element, container) {
        const wrapperElement = this.createElement(TopLevelWrapper, element);

        const componentInstance =
            new FeactCompositeComponentWrapper(wrapperElement);

        // as before
    }
};
```


# 第一部分的结论

Feact可以呈现简单的组件。就基本渲染而言，我们已经考虑了大部分的主要考虑因素。
虽然在真实的React中，渲染要复杂得多，因为还有很多其他事情要考虑，比如事件，焦点，窗口的滚动位置，性能等等。
