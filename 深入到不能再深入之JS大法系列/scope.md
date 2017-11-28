# 执行上下文 -- scope chain


# 前言
***
上一章节我们讲了<a href="vo.md">VO</a>。

我们回顾一下之前的内容。

进入执行上下文会创建VO对象、建立作用域链、确定this指向。执行上下文的数据(函数形参、变量声明、函数声明)是作为属性存储在VO中的。

我们也知道变量对象在每次进入上下文时创建，并填入初始值，值的更新出现在代码执行阶段。

这一章节我们继续深入了解执行上下文，我们来认识作用域链。

# 作用域链

这里引用ECMA-262-3的定义:

>每一个执行上下文都与一个作用域链相关联。作用域链是一个对象组成的链表，求值标识
符的时候会搜索它。当控制进入执行上下文时，就根据代码类型创建一个作用域链，并用初始化对象填充。执行一个上下文的时候，其作用域链只会被 with 声明和 catch 语句所影响。

不能一下子看明白没关系，我们接着往下看，待会儿回过来自己思考思考。

一个demo:

```
var a = 10;
function foo(){
    var b = 100;
    function bar(){
        return c = a + b;
    }

    return bar;
}

foo()();
```

这个例子的执行上下文创建和弹出的过程不明白的参见<a href="executionContext.md">执行上下文</a>。

根据上边ECMA-262-3的定义，作用域链是一个变量对象组成的链表，用来进行变量查询。
比如上面的'bar'上下文的作用域链依次是 AO(bar)、AO(foo)、VO(global)。

我们这样模拟全局上下文：

```
someECStackContext={
    AO: ...,
    this: ...,
    Scope:[ 所有变量对象的列表 ]
}
```

其中：Scope = AO|VO + \[[Scope]\] 也就是当前变量对象加上所有父级变量对象的列表。

讲AO的时候我们说过了有两个阶段，进入上下文(初始化)、代码执行阶段(update值)。

我们还知道JS是词法作用域规则。直白的说就是你写代码的时候就确定了作用域。不考虑eval环境的话，\[[scope]\]与函数紧紧搂抱(有关)。

## 函数的生命周期

函数的生命周期分为两个阶段：创建、调用阶段。

1. 函数创建

    思考：

    ```
    var a = 20;
    function foo(){
        var b = 100;
        alert( a + b );
    }
    foo(); // 120
    ```
    
    我们会得到预期的结果，没毛病。我们可能是这样分析的:

    在foo的作用域内只有b的声明，执行alert的时候对a进行RHS查询，没找到，就去外层作用域查找，ok，我们找到了。

    现在我们得用更底层的思路去分析。虽然上边的分析没毛病。

    首先我们可以确定 foo 的 AO 对象、全局的 VO 对象：

    ```
    AO(foo) = {
        b: undefined
    }


    VO(global) = {
        foo: <reference 'foo'>,
        a: undefined
    }
    ```

    那么它是怎么找到 a 的呢?

    联系上前边我们说过的作用域链，是不是有一点点触碰到了。
    
    总结:

    1. \[[scope]\]是所有 **父级变量对象**的层级链，处于当前函数上下文之上，在函数创建时存于其中。当然对a的查找是顺着层级往上的(可以理解为从数组的头开始往右一层一层的找)。
    
    2. \[[scope]\]在函数创建时被存储，静态（不变的），永远永远，直到函数被销毁。也就是说函数一旦创建， \[[scope]\]属性已经写入，并存储在函数对象中，无论函数是否调用。
    
    3. \[[scope]\]和作用域链不是一个概念哦，\[[scope]\]是函数的一个属性而已。

        ```
        foo.[[Scope]] = [
            VO(global) 
        ];
        ```

2. 函数调用阶段

    前边提到了：Scope = AO|VO + \[[Scope]\]

    其实更容易理解的形式是这样:
    
    ```
    Scope = [AO|VO].concat([[Scope]]);
    ```
    
    在函数调用(进入上下文)阶段，会把当前的VO|AO加入到当前执行函数\[[scope]\]属性的前边。

    这时我们再回到文章开头提到的ECMA262-3对于作用域链的定义。定义中提到了标识符。

    标识符是干什么呢？
    
    标识符的作用就是确定一个变量（或函数声明）属于哪个变量对象。标识符解析算法在ECMA262-3中也有定义：
    
    **执行过程中**，使用下面的算法进行标识符解析查找:
    1. 获取作用域链中的下一个对象。如果没有，转到步骤5。 
    2. 调用 Result(1) 的 \[[HasProperty]\] 方法，把标识符作为属性名传递。 
    3. 如果 Result(2) 为 true，返回一个引用类型的值，其基对象是 Result(1)，属性名为标识符。 
    4. 转到步骤1。 
    5. 返回引用类型的值，基对象为 null，属性名为标识符。 
    6. 求值标识符的结果总是一个引用类型的值，其成员名字组件与标识符字符串相等
    
    多读几遍。

    大体上说明标识符解析总是会返回一个引用类型，这个引用类型的 getBase() 结果是对应的变量对象(或若未找到则为null)。属性名是向上查找的标识符的名称。
    在向上查找中，一个上下文中的局部变量较之于父作用域的变量拥有较高的优先级。可以理解为由内向外查找，如果找到了就会返回引用类型，外层有重名的也不会找到那儿去。

    引用类型在this的章节会详细说明。

    我们通过一个copy的复杂demo来熟悉熟悉：

    ```
    var x = 10;
 
    function foo() {
      var y = 20;
     
      function bar() {
        var z = 30;
        alert(x +  y + z);
      }
     
      bar();
    }
     
    foo(); // 60
    ```
    
    在上面代码的执行阶段：

    1. 首先全局上下文
    
        ```
        GlobalECStackContext={
            VO(global) = {
                foo: <reference 'foo'>,
                x: 10
            },
            Scope: [ VO(global) ] // 全局上下文的作用域链仅包含全局对象
        }
        ```
    
    2. 对于foo
    
        ```
        // AO对象
        fooECStackContext={
            AO:{
                bar: <reference 'bar'>,
                y: 20
            }
        }

        // [[scope]]属性
        foo.[[ scope ]] = [ GlobalECStackContext.VO(global) ]

        // 作用域链
        fooECStackContext = {
            AO:{
                bar: <reference 'bar'>,
                y: 20
            },
            Scope: [ fooECStackContext.AO, GlobalECStackContext.VO(global) ]
        }

        ```
    
    3. 对于 bar
    
        ```
        // AO对象
        barECStackContext = {
            AO:{
                z: 30
            }
        }

        // bar的[[scope]]属性
        bar.[[ scope ]] = [ fooECStackContext.AO, VO(global) ]

        // bar的作用域链
        barECStackContext = {
            AO:{
                z: 30
            },
            Scope:[ 
                barECStackContext.AO, 
                fooECStackContext.AO, 
                GlobalECStackContext.VO(global) 
            ]
        }
        ```

        对'x', 'y', 'z'标识符的解析过程：
    
        1. 对'x'进行查找：
           
           ```
            barECStackContext.AO // 没找到
            fooECStackContext.AO // 没找到
            VO(global) // Get it! 10 
           ```

        2. 对'y'进行查找：
        
            ```
            barECStackContext.AO // 没找到
            fooECStackContext.AO // Get it! 20
            ```
       
        3. 对'z'进行查找：
        
            ```
            VO(global) // Get it! 30 
            ```
        
        就是这样。虽然没有完全的解释清楚ECMA262-3中对于标识符解析的算法规则，但是这样容易理解，也就是这样找的。

# 闭包

闭包这玩意儿可以单独写一章节。这里只是说说其与\[[scope]\]属性的联系。

闭包，几乎所有的JS书籍上的介绍都略有不同，每个人都有每个人的理解。

在<<你不知道的JavaScript>>中，闭包定义是: 
>函数拥有对其词法作用域的访问，哪怕是在当前作用域之外执行

红宝书中是：
>闭包是指有权访问另一个函数作用域中的变量的函数。

我们通过一个demo来解读:

```
var x = 20;

function foo(){
    alert(x)
}

(function(){
    var x = 10;
    foo(); // 10
})()
```

我提几点，然后自己思考。得到的结论就是你对闭包的初步认识了。

从本章节的内容来看，闭包与\[[scope]\]属性息息相关。首先之前提到了函数的\[[scope]\]属性是静态属性，函数创建的时候就被存储到函数对象中，函数销毁才会销毁。

闭包的特点恰好就是持久的保有对其定义的词法作用域的访问权限。

再来一点，\[[scope]\]中保存的是当前函数的所有上层变量对象。上面的demo中foo()持久访问的正是其上层匿名立即执行函数的AO对象中的属性。

所以，闭包是函数代码和其\[[scope]\]的结合？

# Function构建的函数\[[scope]\]中只有全局的VO

这个Function是很有意思的，之前在一些讲解原型的高热度的文章中，发现作者很多会说所有的函数都有prototype属性。其实是错误的，比如Function.prototype.bind创建的函数就是没有prototype属性的。

同样Function构建的函数，其\[[scope]\]也比较特殊，里面只有全局的VO对象。

```
// 证明
var a = 10;

function foo(){
    var b = 20;
    // 函数声明
    function f1(){
        console.log(a, b);
    }
    
    // 函数表达式
    var f2 = function(){
        console.log(a, b);
    }

    var f3 = Function('console.log(a,b)')

    f1(); // 10, 20
    f2(); // 10, 20
    f3(); // 10, b is not defined
}

foo();
```

f3只能够访问全局VO中的属性，不能访问VO(foo)；印证了\[[scope]\]里面只有全局的VO对象。

# with & catch & eval

eval不建议使用，就简单提一提。代码eval的上下文与当前的调用上下文（calling context）拥有同样的作用域链：

```
evalContext.Scope === callingContext.Scope
```

文章开始部分引用的ECMA-262-3关于作用域的定义中提到了with & catch这一点。

事实上在代码执行阶段，可以通过with声明和catch语句修改作用域链。

它们将会被添加到作用域链的最前端：

```
Scope = [ withObj|catchObj, AO|VO, [[scope]] ]

// 这样好理解
Scope = [ withObj|catchObj ].concat( [ AO|VO ].concat( [[ scope ]] ) )
```

很多资料对这个过程解释的很绕，我们通过一段代码具体分析：

```
var a = 15, b = 15;

with( { a: 10 } ){
    var a = 30, b = 30;
    alert(a); // 30
    alert(b); // 30
}

alert(a); // 15 <-- 关键点在这里
alert(b); // 30
```

我们一步一步分析。

1. 代码开始执行

    ```
    // 此时的上下文
    EC = {
        VO(global):{
            a: 15,
            b: 15
        },
        Scope: [ VO(global) ]
    }
    ```

2. 执行with语句

    ```
    // 此时的上下文
    EC = {
        VO(global):{
            a: 30, // 这里先是10，然后又改写为30
            b: 30
        },
        Scope: [ { a:10 }, VO(global) ] // 添加到作用域链的最前端
    }
    ```

3. with结束

    ```
    // 此时的上下文
    EC = {
        VO(global):{
            a: 15, // --> a: 30 也会被移除,回到最初的状态。即第1步
            b: 30
        },
        Scope: [ VO(global) ] // 从前头移除{a:10}
    }
    ```

OK，catch的过程是一样的，就两个核心:
第一是withObject|catchObject会被添加到作用域链前端，其实就是标识符解析从withObj|catchObj先开始，因为它在头上嘛。这也是我们说with、catch可以挟持作用域的原因。

第二就是声明完成之后会移除这些状态，回到最初的美好。

留一个思考题:

```
var x = 1, y = 1;
function foo( data ){
    var x = 2, y = 2;
    function bar(){
        with( data ){
            alert(x);
            alert(y);
        }
    }

    bar();
}
foo( {x: 5} );
alert(x);
alert(y);
```


# 作用域链与原型链

二维作用域链查找，就是说在对象中没找到就去原型链上查找：

```
function f(){
    alert( a );
}

Object.prototype.a = 'jack ma';
f(); // jack ma
```

这个其实大家很熟悉，原型链末尾都是 -> Object.prototype -> null。

顺着原型链逐级的委托，最终会成功输出'jack ma'。

好的，接着:

```
function outer(){
    var x = 10;
    function inner(){
        alert(x);
    }

    inner();
}
Object.prototype.x = 50;
outer() // 10
```

这里输出了10，而不是顶层原型定义的50。上一个例子明明是输出的原型委托继承的值啊?

我们分析：

```
// 全局上下文
EC(global) = {
    VO:{
        outer: <reference 'outer'>,
        x: 50 // 这里不清楚的请注意前边的文章提到过 window instanceof Object
    }
}

// outer上下文
EC(outer) = {
    AO:{
        inner: <reference 'inner'>,
        x: 10
    },
    Scope: [AO, EC(global).VO]
}

// inner上下文
EC(inner) = {
    AO:{
        
    },
    Scope: [AO, EC(outer).AO, EC(global).VO]
}
```

现在写出这个流程大家应该驾轻就熟。我们能够得到一些什么呢?

执行阶段会顺着原型链的层级进行标识符解析工作。而活动对象(AO)是没有原型的。
所以inner的AO中没有x属性，就去下一链级的outer中找。找到了，如果没有就去全局找了，全局中的x是可以通过原型委托继承得到的。

所以，假如你删除var x = 10;得到的是原型委托继承的50。

# 下一章
***
<a href='this.md'>执行上下文 -- this</a>

# 参考

<a href='http://lzw.me/pages/ecmascript/#143'>ECMA-262-3</a></br>
<a href="http://dmitrysoshnikov.com/">dmitrysoshnikov.com</a>

# 结语
***
撸主实力有限，高手历来在民间，希望广提意见，补肾感激。如果喜欢或者有所启发，欢迎star，对我也是一种鼓励。