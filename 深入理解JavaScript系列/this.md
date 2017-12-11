# 深入理解JavaScript系列（5） -- this

***

# 前言
***

回顾之前的知识，我们知道在进入<a href="executionContext.md">执行上下文</a>阶段会完成<a href='vo.md'>变量对象（ VO ）</a>的创建、<a href="scope.md">作用域链的建立</a>，还有就是确定 this 的指向。

本章节就会从 <a href="http://es5.github.io/#x10.3.1"> ECMA-262-5 </a>规范去解读 this 的指向，这样去理解是更底层的，当然建议你先了解我们最常见的<a href="../读书笔记/你不知道的JS系列/this.mdown">对 this 的理解</a>。本章节是对其中包含的各种情况更底层的解释。

我们再次复习一下<a href="executionContext.md">执行上下文</a>：

```javascript
ECStack = {
    VO: {...},
    Scope: [],
    this: ...
}
```

根据前边的知识，我们知道在进入上下文阶段 VO 被初始值填充，函数的 \[[scope]\] 属性也被创建。而且 VO|AO 可以在执行上下文阶段被改写，函数的作用域链在这个阶段也可以受到 with 或者 catch 的影响。但是 this 在进入上下文阶段确定之后，在执行上下文阶段也不会改变了。

前边也提到了一共有 3 种 ECMA 脚本可执行代码，分别是全局代码、函数代码、eval代码。我们也知道在控制器转到不同的可执行代码的时候会生成对应的上下文，也就是说 VO 、Scope、this都与可执行代码类型有着很大的联系，我们接下来会具体的阐述。

>eval()，真心不要用了，这里就忽略了。

# 全局代码中的 this
***

这个是最简单的了，全局代码中的上下文我们之前提到过，其 this 始终指向全局对象。

```javascript
globalEC = {
    VO: global object,
    Scope: [ globalEC.VO ],
    this: global object
}
```

既然 this 在全局代码中始终指向全局对象:

```javascript
var a = 10;
console.log( window.a ); // 10

b = 20; // 这里的 b 严格说并不是一个变量，之前有提过。
console.log( window.b ); // 20

this.c = 50;
console.log( window.c ); // 50
```


# 函数代码中的 this
***


如果你读过我总结的<你不知道的JS系列>一书中关于<a href="../读书笔记/你不知道的JS系列/this.mdown"> this </a>的文章，你就会知道对应的 4 种绑定规则、丢失绑定等等情况是多么的复杂。不过这都是前辈们总结出来的规则
、经验，本文尝试从规范去解读 this 的指向，希望能从另一个角度诠释那篇文章中提到的部分 this 指向的问题。


首先我们得做一些准备工作，熟悉一些规范中的概念( 这很重要！ )：

1. <a href='http://es5.github.io/#x8'>类型定义</a>

    > Types are further subclassified into ECMAScript language types and specification types.
    > 简译：类型又再分为 ECMAScript 语言类型和规范类型。


    > An ECMAScript language type corresponds to values that are directly manipulated by an ECMAScript programmer using the ECMAScript language. The ECMAScript language types are Undefined, Null, Boolean, String, Number, and Object
    > 简译：ECMAScript 语言类型就是我们直接用来操作的值对应的类型，包括未定义（Undefined）、 空值（Null）、布尔值（Boolean）、字符串（String）、数值（Number）、对象（Object）。


    > A specification type corresponds to meta-values that are used within algorithms to describe the semantics of ECMAScript language constructs and ECMAScript language types. The specification types are Reference, List, Completion, Property Descriptor, Property Identifier, Lexical Environment, and Environment Record. Specification type values are specification artefacts that do not necessarily correspond to any specific entity within an ECMAScript implementation. Specification type values may be used to describe intermediate results of ECMAScript expression evaluation but such values cannot be stored as properties of objects or values of ECMAScript language variables.
    > 简译： 规范类型是描述 ECMAScript 语言构造与 ECMAScript 语言类型语意的算法所用的元值对应的类型。规范类型包括引用、列表、完结、属性描述式、属性标示、词法环境（Lexical Environment）、环境纪录（Environment Record）。规范类型的值是不一定对应 ECMAScript 实现里任何实体的虚拟对象。规范类型可用来描述 ECMAScript 表式运算的中途结果，但是这些值不能存成对象的变量或是 ECMAScript 语言变量的值。

    语言类型肯定大家都没问题，规范类型咋看有点懵逼。这里大家可以参考<a href="https://www.zhihu.com/question/31911373/answer/53870311">尤雨溪</a> 在知乎的回答。

    >  规范类型也就是 “只存在于规范里的抽象类型”。它们是为了更好地描述语言的底层行为逻辑才存在的，但并不存在于实际的 js 代码中。

    在规范类型中，我们重点关注的是 Reference、LexicalEnvironment、EnvironmentRecord。

2. <a href="http://es5.github.io/#x11.2">左值表达式</a>

    MemberExpression： 
    >   PrimaryExpression
    >   FunctionExpression
    >   MemberExpression [ Expression ]
    >   MemberExpression . IdentifierName
    >   new MemberExpression Arguments

    这里关注 MemberExpression ，可以理解为 () 左边的部分。比如：

    ```javascript
    function foo(){}; 
    foo(); // MemberEcpression --> foo

    function foo(){
        return function(){

        }
    };
    foo()(); //MemberEcpression --> foo()

    var foo = {
        bar: function(){}
    }
    foo.bar(); //MemberEcpression --> foo.bar
    ```

3. <a href="http://es5.github.io/#x8.7">Reference 类型</a>
    
    这是确定 this 指向最重要的依据之一。
    
    > The Reference type is used to explain the behaviour of such operators as delete, typeof, and the assignment operators......
    > 简译：引用类型用来说明 delete，typeof，赋值运算符这些运算符的行为。
    
    > A Reference is a resolved name binding. A Reference consists of three components, the base value, the referenced name and the Boolean valued strict reference flag. The base value is either undefined, an Object, a Boolean, a String, a Number, or an environment record (10.2.1). A base value of undefined indicates that the reference could not be resolved to a binding. The referenced name is a String.
    > 简译：一个引用 (Reference ) 是个已解决的命名绑定。一个引用由三部分组成， 基 (base) 值，引用名称（referenced name）和严格引用布尔值 (strict reference) 标志。基值是 undefined, 一个 Object, 一个 Boolean, 一个 String, 一个 Number, 一个 environment record 中的任意一个。基值是 undefined 表示此引用可以不解决一个绑定。引用名称是一个字符串。

    这里明白 Reference 组成就好：

    1. base  引用指向的原值，可能是 undefined、Object、Boolean、String、Number、EnvironmentRecord。
    2. referenced name    引用的名称，字符串。
    3. strict reference   是否是严格模式，布尔值。
  
    举个例子：

    ```javascript
    function foo(){
        console.log( this )
    };

    foo();

    // 对应的 Reference
    fooReference = {
        base: EnvironmentRecord,
        referencedName: 'foo',
        strictReference: false
    };
    ```
    
    规范中还提到了一些<a href="http://es5.github.io/#x8.7">操作 Reference 中组件的方法</a>，我们列出几个我们需要的：

    - GetBase(V) 返回引用值 V 的基值组件( 返回 fooReference.base )。
    - HasPrimitiveBase(V) 如果基值是 Boolean, String, Number，那么返回 true。
    - IsPropertyReference(V) 如果基值是个对象或 HasPrimitiveBase(V) 是 true，那么返回 true；否则返回 false。
    - IsUnresolvableReference(V) 如果基值是 undefined 那么返回 true，否则返回 false。
    - GetValue(V) 返回一个具体的值，*不再是 Reference 类型*
    

    其中，GetBase(V)返回的就是你想知道的 this 指向。另外<a href="http://es5.github.io/#x8.7.1">GetValue(V)</a>是一个很重要的方法，单独说一下：
    
    ```js
    function GetValue(V){
        // 根据规范模拟实现一下 GetValue(V)
        // 1. If Type(V) is not Reference, return V.
        if(Type(V) != Reference){
            return V;
        }

        // 2. Let base be the result of calling GetBase(V).
        var base = GetBase(V);

        // 3. If IsUnresolvableReference(V), throw a ReferenceError exception
        if(IsUnresolvableReference(V)){
            throw new ReferenceError;
        }

        // 4. If IsPropertyReference(V), then
        //   a. If HasPrimitiveBase(V) is false, then let get be the [[Get]] internal method of base, otherwise let get be the special [[Get]] internal method defined below
        //   b. Return the result of calling the get internal method using base as its this value, and passing GetReferencedName(V) for the argument.
        if(IsPropertyReference(V)){
            var get;
            if(!HasPrimitiveBase(V)){
                get = base.[[Get]];
            }else{
                get = [[specialGet]]
            }
            return base.get(GetReferencedName(V));
        }

        // 5. Else, base must be an environment record
        //    Return the result of calling the GetBindingValue (see 10.2.1) concrete method of base passing GetReferencedName(V) and IsStrictReference(V) as arguments
        return  GetBindingValue(GetReferencedName(V), IsStrictReference(V));
    };
    ```

    按照规范，伪实现一次代码，能够加深理解。GetValue() 能够从引用类型中得到一个对象真正的值，这也是一个很重要的点，记住，调用了 GetValue() 返回的就不再是一个 Reference 类型了，而是一个具体的值。
    
4. <a href="http://es5.github.io/#x10.2.1.1.6">ImplicitThisValue</a>

    > Declarative Environment Records always return undefined as their ImplicitThisValue. Return undefined.
    > 简译：声明式环境记录项永远将 undefined 作为其 ImplicitThisValue 返回。
        
    也就是说如果 Reference 中的 base 是一个 Environment Records，那么 GetBase()的结果将会是执行 ImplicitThisValue 的结果，也就是得到一个 undefined。最终也就是 this 指向 undefined。

    那么什么情况下会得到一个 Reference 中的 base 是一个 Environment Records 的情况呢？

    ```js
    function foo(){
        alert(this);
    }

    foo();
    ```
    
    上面这种就是最简单的情况，看过我总结的<你不知道的JS系列>一书中关于<a href="../读书笔记/你不知道的JS系列/this.mdown"> this </a>的文章，你可能立即就会知道是函数独立调用，采用默认绑定规则，所以 this 绑定到全局对象。

    但是从规范上看，过程很复杂。
    
    首先第一步是进行标识符解析。
    所谓标识符，在这里就是 "foo" ，标识符可理解为变量名，函数名，函数参数名和全局对象中未识别的属性名。

    获得其引用类型(这一点在讲作用域链的时候提过)：
    解析的过程大概分为，<a href="http://es5.github.io/#x11.1.2">标识符引用</a> -> <a href="http://es5.github.io/#x10.3.1">标识符解析</a>。

    我们从<a href="http://es5.github.io/#x10.3.1">标识符解析</a>开始，重点关注下面的语句：

    > Identifier resolution is the process of determining the binding of an Identifier using the LexicalEnvironment of the running execution context...
    > 简译：标识符解析是使用正在运行的执行上下文的词法环境来确定标识符的绑定的过程...
    
    > Let env be the running execution context’s LexicalEnvironment.
    > 简译：let env = LexicalEnvironment
    
    > Return the result of calling GetIdentifierReference function passing env, Identifier, and strict as arguments。
    > 简译：返回值是调用GetIdentifierReference(env, Identifier, strict)的结果。

    所以，我们再看看<a href="http://es5.github.io/#x10.2.2.1"> GetIdentifierReference </a>方法。

    ```js
    function GetIdentifierReference(lex, name, strict){
        // 我们同样模拟实现
        // 1. If lex is the value null, then Return a value of type Reference whose base value is undefined, whose referenced name is name, and whose strict mode flag is strict.
        if(lex == null){
            return Reference(base = undefined, name = name, strict = strict);
        }

        // 2. Let envRec be lex’s environment records.
        let envRec = lex.[[ environment records ]];
        // 3. Let exists be the result of calling the HasBinding(N) concrete method of envRec passing name as the argument N.
        let exists = envRec.HasBinding(N=name)
        // 4. If exists is true, then Return a value of type Reference whose base value is envRec, whose referenced name is name, and whose strict mode flag is strict.
        if(exists){
            // 返回一个 Refernce 对象，base 为 Environment Record。
            return Reference(base = envRec, name = name, strict = strict);
        }
        // 所以这里的 base 是一个 Environment Record。
        // 所以 fooReference.base = Environment Record

        // 5. Else 
        //   a. Let outer be the value of lex’s outer environment reference,
        //   b. Return the result of calling GetIdentifierReference passing outer, name, and strict as arguments.

        // outer environment reference 下面简写为 [[outer]]
        // 参见:http://es5.github.io/#x10.2
        // 大致有两个重点：
        // 1. Lexical Environment = Environment Record + outer Lexical Environment
        //    就是说词法环境等于环境记录项+可能为空的外部词法环境
        // 2. outer environment reference( 外部词法环境引用 ) 表示词法环境的逻辑嵌套关系模型。
        //  外部词法环境引用是逻辑上包含内部词法环境的词法环境。
        let outer = lex.[[outer]];
        return GetIdentifierReference(outer, name, strict);
    };
    ```
    
    可见，标识符解析肯定会返回一个 Reference 类型，而且不出意外的话会把其LexicalEnvironment中的 Environment Records 作为 baseValue。

    一时不理解没关系，先记住咱们上面的 foo(); 经历了词法解析后得到：

    ```js
    fooReference = {
        base: Environment Records,
        referencedName: 'foo',
        strictReference: false
    };
    ```
    

5. <a href="http://es5.github.io/#x11.2.3">函数调用</a>

    最重要的当然是理解在函数调用过程中，如何一步一步确定 this 指向的。这个过程有很多前面提到的概念，如果不清楚的回过头看看即可。
    我们把函数调用规范中与 this 有关的剥离出来：

    > 1. Let ref be the result of evaluating MemberExpression
    > 6. If Type(ref) is Reference, then：
    >       a. If IsPropertyReference(ref) is true ,Let thisValue be GetBase(ref).
    >       b. Else, the base of ref is an Environment Record Let thisValue be the result of calling the ImplicitThisValue concrete method of GetBase(ref).
    >  7. Else, Type(ref) is not Reference, Let thisValue be undefined.

    上面的流程大致就是这样：

    先通过 MemberExpression 得到一个 ref。判断这个 ref 的类型是不是 Reference。如果不是，this 指向 undefined，如果是的话，就再判断 IsPropertyReference(ref) 的结果，如果为 true ，thisValue = GetBase(ref)。
    否则 base = Environment Record， thisValue = ImplicitThisValue(ref) = undefined。
    
    根据 <href="http://es5.github.io/#x11.2.3"> Entering Function Code </a> ：

    > Else if thisArg is null or undefined, set the ThisBinding to the global object.
    > 简译：如果thisArg为空、未定义，this指向全局对象。注意是非严格模式下。

    再画个图：
    
    ![this](./imgs/this.png)

# 实战分析

前边铺垫了那么那么多，一时难以消化是正常的，结合我们这里给出的 demo 。多分析几次，你就会发觉其实没那么复杂。如果有记不住的往上翻翻~

1. demo1

```js
function foo(){
    alert(this);
}
foo();

// 其 Refernce
fooReference = {
    base: Environment Records,
    referencedName: 'foo',
    strictReference: false
}

// 结合上边的流程图分析
// 1. MemberExpression 得到 foo。
// 2. 对 foo 进行标识符解析，调用 GetIdentifierReference 方法，该方法会返回一个 Reference 对象 ref。所以 typeof ref = Reference。
// 3. fooReference.base = Environment Records，所以 thisValue = ImplicitThisValue(ref)的结果，ImplicitThisValue总是返回 undefined ，非严格模式下，会 set the ThisBinding to the global object。

// 变化一下
// 我们都知道原型对象有一个contrucor属性指向其构造函数。
console.log(foo === foo.prototype.constructor); // true
// 那么，他们应该是一样的函数，this指向一样吗？
foo.prototype.constructor(); // foo.prototype

// 因为（参考 demo2 属性访问）：
fooPrototypeRefernce = {
    base: foo.prototype,
    referencedName: 'constructor',
    strictReference: false
}
```


2. demo2

先补充一个规范：<a href="http://es5.github.io/#x11.2.1"> Property Accessors </a>，属性访问的规范。所谓属性访问，直白的说就比如 a.b，a['b']。

规范定义了其返回结果：

> 1. Let baseReference be the result of evaluating MemberExpression.
> 简译：baseReference 就是解释执行 MemberExpression 的结果，直白的说就是 .左边的，或者说\[\]左边的

> 2. Let baseValue be GetValue(baseReference).
> 简译: baseValue = GetValue(baseReference)

> 8. Return a value of type Reference whose base value is baseValue and whose referenced name is propertyNameString, and whose strict mode flag is strict.
>  最终返回的是一个 Reference 类型。


```js
var foo = {
  bar: function () {
    return this;
  }
};

foo.bar();

// 其 Refernce
fooBarRefernce = {
    base: foo,
    referencedName: 'bar',
    strictReference: false
}

// 1. MemberExpression 得到 foo.bar
// 2. foo.bar 是一个属性访问，根据上边说的，baseValue = GetValue( baseReference ),而 baseReference 就是 foo，所以得出 baseValue = foo
// 3. 根据上边规范第8点，返回的是 Reference，而且 base 是一个对象
// 4. 判断 IsPropertyReference ，结果为 true，所以 thisValue = GetBase(fooBarRefernce) = foo。

// 变化一下
var test = foo.bar;
test(); // global

// 这个时候，标识符为 test 
// testReference
testReference =　{
    base: Environment Records,
    referencedName: 'test',
    strictReference: false
}
```

3. demo3

由 demo2 演化而来：

```js
var foo = {
  bar: function () {
    return this;
  }
};

foo.bar();
(foo.bar)(); // 分组表达式 http://es5.github.io/#x11.1.6
(foo.bar = foo.bar)(); // 赋值运算 http://es5.github.io/#x11.13.1
(false || foo.bar)(); // 逻辑与运算 http://es5.github.io/#x11.11
(foo.bar, foo.bar)(); // 逗号操作符 http://es5.github.io/#x11.14

// 分析
// 上面 4 种运算我都列出了在规范中的位置。
//  1. 分组表达式， 规范中的 note 是重要的细节
// NOTE This algorithm does not apply GetValue to the result of evaluating Expression. The principal motivation for this is so that operators such as delete and typeof may be applied to parenthesised expressions
// 大概就是说GetValue()不会作用于表达式的结果。因此其与 foo.bar()结果一样。

// 2. 赋值运算，规范中有这么一句：
//  Let rval be GetValue(rref). 右值 = GetValue()；
// 我们前边模拟实现了 GetValue() 方法，使用此方法，意味着返回的不是 Reference 类型，根据我们前边的流程图，可知非严格模式下 this 指向 全局对象。

// 逻辑与运算、逗号操作符 同 赋值运算一样。都调用了 GetValue()。
```


4. demo4

执行 MemberExpression 得不到结果的情况：

```js
(function(){
    alert(this)
})();

// 分析
// 前边提到 MemberExpression 可以理解为取 () 左边，但是左边是一个函数对象，不是一个可以解析的标识符或者属性访问器，那么最终得到的结果为 null。
// 非严格模式下，最终 this 指向 全局对象。
```


上边只是涉及 this 指向的一部分内容，主要是提供给大家一个结合规范去分析问题的思考路线，诸如没提到的 with & catch、call、bind、apply、new 这些情况下，确定 this 的指向，同样可以结合规范去分析。


# 下一章
***
<a href='func.md'>深入理解JavaScript系列（6） -- 函数</a>


# 结语
***
撸主实力有限，高手历来在民间，希望广提意见，补肾感激。如果喜欢或者有所启发，欢迎star，对我也是一种鼓励。


# 参考

<a href="https://github.com/mqyqingfeng/Blog/issues/7">JavaScript深入之从ECMAScript规范解读this</a></br>
<a href="http://es5.github.io/#x11.2">ECMA-262-5.1</a></br>
