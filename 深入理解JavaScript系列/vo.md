# 深入理解JavaScript系列（3）-- 变量对象
***

# 前言
***
最近手上事儿挺多的，忙着做OIDC的认证平台，还得完善爬虫项目。不过对JS轴线的整理万万不能停，是药啊！

我们首先回顾前边的知识：

**每次函数或者构造器的调用都会进入到一个新的上下文，即使函数是在递归的调用寄几。完事儿之后会从上下文堆栈中弹出该上下文，'完事儿'可以是每次顺利的返回，也可能是因为未被catch的异常抛出等原因。**

所以，我们将进入执行上下文(下面都简称EC了，打字很累的)内部一探究竟，而本节关注的焦点是一个抽象的概念--变量对象(Variable Object 简称VO)。

我们在写代码的时候会声明变量或者函数，那么解释器(interpreter)是如何、在哪儿找到它们的呢?

带着这些，我们继续前行。

# 执行上下文生命周期

上一节<a href='executionContext.md'>执行上下文</a>中我们提到了函数(构造器)调用的时候会创建新的执行上下文压入上下文堆栈中。

其生命周期(好像React火了之后这个词也特么的火了)大致如下。

还是用png来说明:

![EC-LIFE](./imgs/vo1.png)

大体上说EC的生命周期平稳无波折，健健康康。创建(进入)、执行、GG，就这么简单。

也看出了EC中的三贱客:

1. VO
2. 作用域链(Scope Chain)
3. this

我掐指一算，JS中几大迷雾重重的雷区，比如作用域、闭包、this指向、变量提升等都特么在这里有埋伏啊，也就是说我们骄傲的踩过EC的坑之后就可以浩浩荡荡的杀出这些雷区啊。

突然就有了一种<<垂死病中惊坐起,笑问客从何处来>>的感觉！

三个一起上! ...有点欺负寄几了，我们还是从VO开始。

# VO

我见过很多说法说明什么是VO:

1. 变量与执行上下文相关，它应该知道自己在哪儿以及怎么找到自己，这得益于一种叫做变量对象的机制。

2.  所有的执行上下文都有一个与之关联的可变对象，这个对象把声明的函数、变量、参数列表作为其属性。这个可变对象就是VO。

...

万变不离其宗，反正都表示VO与执行上下文关联，然后目的是为了存取我们代码中声明的变量、函数、函数的形参。不管看到多少文章说VO的概念，抓住其核心点，咱不怕。

所以，进入执行上下文时，生成VO，然后 **按照下面的顺序** 把属性绑定到VO:

1. 函数的形参
2. 函数声明
3. 变量声明

上面加粗的部分说明了绑定的优先级。此时你回味一下变量提升。有点意思吧?

# AO

活动对象。Active Object 简称AO，ECMA-262@3中的解释大概是:

>当控制进入函数代码的执行上下文时，创建一个活动对象并将它与该执行上下文相关联， 并使用一个名为 arguments、特征为 { DontDelete } 的属性初始化该对象。该属性的初始值是稍后将要描述的一个参数对象Arguments Object(简称ArgO)。
活动对象纯粹是一种规范性机制，在 ECMAScript 访问它是不可能的。只能访问其成员而非该活动对象本身。对一个基于对象为活动对象的引用值应用调用运算符时，这次调用的 this 值为 null。


我们总结一下:

```
VO(functionContext) === AO
```

1. VO是不能访问的(除了全局上下文的VO可以间接访问)，但是可以访问AO的成员(属性)。

2. VO和AO其实是一个东西，只是处于不同的执行上下文生命周期。AO存在于执行上下文位于执行上下文堆栈顶部(就是上边说的'当控制进入函数代码的执行上下文时')的时期。再粗暴点，就是函数调用时，VO被激活成了AO。

3. AO通过函数的arguments属性初始化，其值是一个ArgO，包括 callee、length、arg属性。其中arg属性就相当于下标,比如第一个参数对应arg = 0。


# 小试牛刀

为了方便说明，我们模拟VO/AO是一个对象:

```
VO = {}
```

执行上下文就是这样:

```
ECStack = {
    VO: {},
    Scope Chain: [],
    this
}
```


我们得举个例子了:

```
var a = 20;

function foo(x){
    var b = 40;
}

foo(10);
```

上面这段代码有两个执行上下文，一个全局上下文(GlobalEC),一个foo函数执行上下文fooEC。如果这里不清楚，送<a href='executionContext.md'>车票</a>。

我们分别分析其VO/AO:

```
GlobalEC={
    VO:{
        foo: <reference to FunctionDeclaration 'foo'>,
        a: undefined
    }
    ...
}

fooEC={
    AO:{
        arguments:{
            callee:'指向函数的引用(已经废弃)',
            length: 1, // 参数长度
            arg-> 0: 10 // 改变这个属性也会改变对应活动对象的属性，反之亦然
        },
        b: undefined,
        this: window
    }
    ...
}
```

1. 上边的undefined是系统默认的初始值。

2. AO/VO在代码解释期间是可以被修改的。比如 b 初始值是系统默认的undefined。解释期间被修改为 b:40。

3. 解释一下'改变这个属性也会改变对应活动对象的属性，反之亦然' 

```
function foo(x,y,z){
    alert(arguments.length); // 2
    alert(arguments.callee === foo); // true
    alert(arguments[0]); // 1

    arguments[0] = 10; //改变arg->0 对应的值，x对应的值也改变了。

    alert(x); // 10
}

foo(1,2) // 反之亦然就是这里改变 1，比如传入50.
```

改变arg->0 对应的值，x对应的指也改变了:

```
fooECStack={
    VO:{
        arguments:{
            // 简写为
            x: 1
        }
    }
}

// 解释期间改变arg，改写VO
fooECStack={
    VO:{
        arguments:{
            // 简写为
            x: 10
        }
    }
}
```


# 全局上下文的变量对象

上边不经意提到了全局上下文的VO是可以被间接访问的。为啥呢?

因为 **全局上下文中的变量对象就是全局对象自身**

```
// 全局上下文
GlobalEC = {
    VO: global object, // 全局对象
    Scope Chain:'全局上下文的作用域链只包含全局代码',
    this: global object // 全局对象
}
```

这里copy一个全局对象的定义:

>全局对象(Global object) 是在进入任何执行上下文之前就已经创建的对象；这个对象只存在一份，它的属性在程序中任何地方都可以访问，全局对象的生命周期终止于程序退出那一刻。

全局对象就变态了，根据上边的代码，我们知道全局上下文中this指向全局对象。所以:

```
console.log(this);
// 输出一大串
// ...

大致是:
Window:{
    MathJax:{...},
    alert: func,
    applicationCache:{},
    ...
    window: Window{ MathJax:... }, // 指向自身的属性
    ...
}
```

说明全局对象初始化的时候加入了一大堆属性，比如Math、String、blur、screen...。
全局对象是不能直接通过名字访问的，所以全局对象中添加了指向自身的属性，比如DOM中的window。

```
// 试试
var a = 2;

console.log(this.a); // 2
console.log(a); // 2
console.log(window.a); // 2
console.log(this.window.a); // 2

console.log(this === window); // true
console.log(this instanceof Object);// true 
```


# 变量对象的生命周期

说是生命周期有点优雅过了。其实就是不同阶段的VO。

1. 进入上下文阶段

    VO会依次添加三剑客：

   * 函数的所有形式参数
   
   * 所有函数声明，这个属性由一个函数对象的名称和值组成如果变量对象已经存在相同名称的属性，则完全替换这个属性
   
   * 所有变量声明，这个属性由变量名称和undefined值(系统默认初始值)组成；如果变量名称跟已经声明的形式参数或函数相同，则变量声明被忽略。

    此刻不能没有代码啊

    ```
    function foo(x){
        var a = 10;
        var b = function(){}
        function b(){}
        (function x(){})
        e = 50
    }

    foo(10);
    ```
    
    这个阶段其VO/AO对象是:
    
    ```
    fooECStack = {
        AO:{
            arguments: {
                callee:'指向函数的引用',
                length: 1,
                arg->0 : 10
            },
            b: <reference to FunctionDeclaration 'b'>,
            a: undefined,
            this: window
        }
        ...
    }
    ```
    
    发觉没有，有三个意外的没有在AO中。

    1. 该阶段，首先function b(){}是函数声明，var b = function(){}则是函数表达式(被看作为变量声明)，因为函数声明优先级更高，此时再添加b函数表达式的时候发觉b重名了啊，根据上边的第三剑，被忽略。所以不在AO中。
    
        单独给你们抄袭一个demo,自己撸一撸、想一想。

        ```
        function test() {
            console.log(foo);
            console.log(bar);

            var foo = 'Hello'; // 进入上下文阶段会被忽略
            console.log(foo);
            var bar = function () {
                return 'world';
            }

            function foo() {
                return 'hello';
            }
        }

        test();



        // 进入上下文阶段
        VO = {
            foo: <reference 'foo'>,
            bar: undefined
        }

        // 执行代码阶段 AO被改写
        AO = {
            arguments: {...},
            foo: 'Hello', 
            bar: <reference 'bar'>,
            this: Window
        }
        ```
        
        这个撸清楚了，提升也就差不多难不倒你了。

    2. 该阶段AO没有添加(function x(){})，因为其是一个函数表达式，并且没有存到一个变量中，无法应用变量声明规则。所以也被忽略了。
    
    3. 该阶段的AO也没有e，因为它是不是一个变量呢? 如果不是，那肯定没法用变量声明规则，从而没办法加入AO中。大神冴羽的博客中(见参考)是将其加入了AO中的。然而我翻看一些资料，证明它不是一个变量。
    
        ```
        // 首先大家知道为啥不报错吧，非严格模式下，对e进行LHS查询，找不到就去外层全局找，也没有，就为其建一个声明。
        // 你可以console.log(window.e);

        // 这仅是给全局对象创建了一个新属性(但是它不是变量).

        // demo
        alert(a); // undefined
        alert(b); // 'b' is not defined

        var a = 10;
        b = 20;
        
        // 我们分析这个demo的VO
        // 进入上下文阶段
        VO:{
            a: undefined
        }
        // 在进入上下文阶段没有b,所以alert(b)报错。
        ```

        
        执行代码阶段是有输出的
        
        ```
        alert(a); // undefined
        var a = 10;
        b = 20;
        alert(b); // 20
        alert(a); // 10

        // 代码执行阶段
        VO:{
            a: 10,
            b: 20
        }
        ```
        
        还有一个很重要的区别，var 声明的变量是不能通过delete删除的。

        ```
        // copy一个demo
        a = 10;
        alert(window.a); // 10
         
        alert(delete a); // true
         
        alert(window.a); // undefined
         
        var b = 20;
        alert(window.b); // 20
         
        alert(delete b); // false
         
        alert(window.b); // still 20
        ```
        
        你在浏览器执行可能不是这个结果，没关系，在eval环境也不是这个结果，都可以删除。所以可能是你的浏览器是使用eval来执行控制台里你的代码

        没关系，我们这样来看:

        ```
        var a = 10; 
        Object.getOwnPropertyDescriptor(window,'a');

        // {value: 10, writable: true, enumerable: true, configurable: false}
        // 注意： configurable: false


        b = 20;
        Object.getOwnPropertyDescriptor(window,'b');
        // {value: 20, writable: true, enumerable: true, configurable: true}
        // 注意：configurable: true

        // 所以也说明了var声明的变量是不可以delete的，除非在eval环境下。
        // 这也是变量和普通属性的区别，而普通属性在进入执行上下文阶段是不会添加到AO的。
        ```
        
        有关对象属性概念不熟悉可参考:
        <a href="https://github.com/cbbfcd/all-of-javascript/blob/master/%E8%AF%BB%E4%B9%A6%E7%AC%94%E8%AE%B0/%E4%BD%A0%E4%B8%8D%E7%9F%A5%E9%81%93%E7%9A%84JS%E7%B3%BB%E5%88%97/obj.mdown">对象全面解析</a>



2. 执行代码

    其实前边已经说出了代码执行阶段的AO情况，就是解释过程中改写AO。

        ```
        alert(x); // function
     
        var x = 10; // 进入上下文阶段会被忽略
        alert(x); // 10
         
        x = 20;
         
        function x() {};
         
        alert(x); // 20
        ```


    其AO:


        ```
        // 进入上下文阶段
        AO:{
            x: <reference 'x'>
        }

        // 代码执行阶段
        AO:{
            x: 10
        }

        // 然后
        AO:{
            x: 20
        }
        ```

# 参考
***
<a href='http://lzw.me/pages/ecmascript/#143'>ECMA-262</a></br>
<a href='https://github.com/mqyqingfeng/Blog/issues/5'>冴羽's blog</a></br>

# 下一章
***
<a href='scope.md'>Scope Chain</a>

# 结语
***
撸主实力有限，高手历来在民间，希望广提意见，补肾感激。如果喜欢或者有所启发，欢迎star，对我也是一种鼓励。