# 深入理解JavaScript系列（6） -- 函数

---

本章节是对函数的简要说明。需要涉及之前提到的一些知识，如果不熟悉请回过去看看：

[执行上下文][4]

[作用域链][3]

[VO][2]

# 函数的类型

---

函数一共有三种类型：

1. 函数声明（Function Declaration）
    
    > 语法：function Identifier ( FormalParameterListopt ) { FunctionBody }
    
    > Return the result of creating a new Function object as specified in 13.2 with parameters specified by FormalParameterListopt, and body specified by FunctionBody. Pass in the VariableEnvironment of the running execution context as the Scope. Pass in true as the Strict flag if the FunctionDeclaration is contained in strict code or if its FunctionBody is strict code.
    
    > 简译：创建并返回一个新的函数对象，并且把 FormalParameterListopt 作为函数的参数，FunctionBody 作为函数的 body。传递运行中的执行上下文中的 VariableEnvironment 作为其 Scope。如果 FunctionDeclaration 包含在严格模式代码里或 FunctionBody 是严格模式代码 ，那么传递 Strict: true。

    说明函数声明的特点：

    * 要有个名字。
    
    * 代码只出现在程序级的全局上下文或者别的函数的函数体中。

    * 仅仅影响变量对象。
    
    * 可以提升，其实质是因为函数声明在进入执行上下文阶段就已经创建并包含在 VO 中了，所以在执行阶段已经是可以使用的了。

    比如：

    ```javascript
    // 这里可以正常调用，我们知道是提升的作用。
    // 但是其实质是因为执行阶段，函数声明早已经在 VO 中了。
    foo(); 
    
    // 出现在全局
    function foo(){
        console.log( 'hello world!' );
        // 出现在别的函数体
        function bar(){
            console.log('yeah!')
        }
        bar();
    }
    ```


2. 函数表达式（Function Expression）：

    > var someName = function Identifier? ( FormalParameterListopt ) { FunctionBody }

    具体规范有点长，我就不 copy 过来翻译了，[这是传送门][1]。

    分为了两种情况，就是 Identifier 这个函数名字有或者没有。

    ```javascript
    var foo = function(){};

    //or

    var bar = function _bar(){};
    ```

    总结其特点：

    * Identifier (函数名字)可选。这里要注意规范中的 Note。
        
        > NOTE The Identifier in a FunctionExpression can be referenced from inside the FunctionExpression's FunctionBody to allow the function to call itself recursively. However, unlike in a FunctionDeclaration, the Identifier in a FunctionExpression cannot be referenced from and does not affect the scope enclosing the FunctionExpression.
        
        > 这里强调的是可以通过 Identifier 实现递归的情况。 
        
        ```javascript
        var foo = function _foo(){
            _foo(); // 通过 Identifier 实现递归
        };
        ```

    * 代码执行阶段创建，并且不会影响变量对象（因为传递给 Scope 或者作为 argument 的都是上下文的 LexicalEnvironment）。
    
    * 不会提升，比如上面的代码，在进入执行上下文阶段其 VO:
        
        ```javascript
        VO = {
            foo: undefined // 所以，如果提前调用 foo() 会报错的。
        };
        ```
    
    *注意，上面的代码 VO 对象中有 foo 是因为变量是可以影响 VO 的，但是表达式中的 _foo 是不在变量对象中的,因为表达式不会污染 VO*
    
    *函数表达式在代码执行阶段创建，并且不存在于变量对象中*
    
    * 既然是函数表达式，说明其必须出现在[表达式][5]的位置。
    
        ```javascript
        var f = function(){};// 这是一个函数表达式 -- 左值表达式
        (function foo(){}); // 这是一个函数表达式 -- 分组操作符
        [function foo(){}]; // 这是一个函数表达式 -- 数组操作符
        1, function foo(){};// 这是一个函数表达式 -- 逗号操作符
        (function(){})();   // 立即执行函数表达式
        !function(){};      // 这也是一个函数表达式 -- 逻辑操作符
        true && function(){alert(1)};// 这也是一个函数表达式
        ...
        ```
    
    好的，现在让我们继续深入。

    前边说了

    > 函数表达式在代码执行阶段创建，并且不存在于变量对象中
    
    我们验证一下：

    ```javascript
    alert(f); // f is not defined
    (function f(){});
    alert(f); // f is not defined


    alert(b); // b is not defined
    [function b(){}];
    alert(b); // b is not defined
    
    alert(c); // c is not defined
    1, function c(){};
    alert(c); // c is not defined

    // 说明表达式根本不在外边的(父级)变量对象中。
    ```

    这是一个非常重要的特点，之前的某些版本的浏览器可能还有 bug ，上面的代码会输出一些别的结果，但是现在几乎都改正过来了。因为规范中定义了表达式是不存在变量对象中的。

    这一特点也能被我们所用，利用其不污染变量对象的优点：
    
    ```javascript
    // 1. 函数作为参数
    // 因为函数表达式不会影响其VO对象，所以是安全的。
    function foo(callback){
        callback();
    }

    foo(function(){console.log(1)});

    // 2. 建立私有的域隐藏一些数据
    var obj = {};
    (function(){
        var a = 10;
        obj.f = function(){
            alert(a);
        }
    })()
    obj.f(); // 10
    alert(a); // a is not defined
    // 首先 obj 能够访问到 f 是因为函数的 [[Scope]] 属性。
    // 函数表达式不存在于外边的 VO 对象中，所以直接访问 a 会报错。

    // 3. 利用其执行阶段创建的特性，动态的根据条件创建函数表达式。
    var foo = 10;
    var bar = (foo % 2 == 0
      ? function () { alert(0); }
      : function () { alert(1); }
    );
     
    bar(); // 0
    ```
    
    ### IIFE 

    叫做立即执行函数表达式，所以，函数声明可不可以加个括号也立即执行？
    
    ```javascript
    function f(){}(); // 语法错误
    function(){}(); // 语法错误  所以不能...
    // 因为解析器不知道这个函数是表达式还是函数声明啊



    function foo(x){
        alert(x)
    }(1); // 没报错，但是这只是一个分组操作符，并不是函数调用哦！
    
    foo(10); //这才是函数调用

    !function baz(x){
        alert(x)
    }(10); // 10 ,WTF! 不是说是分组操作符，不是调用吗？
    // 注意！前边有一个 ！运算符。
    // 所以此时解析器是知道这货是一个函数表达式的。

    // 这里得出一个结论：
    // 当一个函数表达式遇到一个括号的时候，就会立即执行，括号不是分组运算符了。
    // 而且解析器知道这货是表达式的时候可以不用加个括号括起来。
    
    //所以
    (function(){})(); //拆开看左边是一个表达式(function(){}); 右边括号
    1, function(){alert(150)}(); // 也是立即执行不报错
    [function(){alert(100)}()]; // 也是立即执行不报错

    var ff = {
        bar: function(){
            console.log('test');
        }(1)
    };
    
    ff.bar; // test
    ```
    

3. Function 创建的函数

    我们之前就提过，其特殊之处在于 \[[Scope]\] 中只有全局对象。
    
    ```javascript
    var a = 100;

    function bar(){
        var a = 50;

        var baz = new Function('alert(a);');

        baz();
    }

    bar(); // 100
    ```


**关于前边提到的函数表达式中的递归**

函数表达式可以通过对 Identifier 的引用实现递归。

```javascript
(function foo(bar){
    if(bar){
        alert(123);
        return;
    }

    foo(true); // 这个 foo 哪里来的？
})()

foo(); //报错
```

从外边的 VO 中来的？不可能啊，在外边执行foo()；会报错，而且我们已经知道函数表达式不会存在于 VO 中啊。那是 foo 函数内部来的？也不对啊，根本没有这个定义啊。

其实是在创建函数表达式的时候创建了一个第三方的特殊对象，然后这个对象的属性的 key 就是函数表达式的名字，值就是函数自己，然后这个对象会添加到作用域链的前端，执行完了机会销毁。是不是有点像前边提到的 with & catch 的变量对象一样。

```javascript
var specialObj = {};
specialObj.foo = foo;

foo.[[Scope]] = specialObj.concat(Scope);

delete Scope[0];
```

# 创建函数对象

[猛戳这里][6]


# 下一章
***
TODO


# 结语
***
撸主实力有限，高手历来在民间，希望广提意见，补肾感激。如果喜欢或者有所启发，欢迎star，对我也是一种鼓励。


# 参考
[1. ES5规范][1]
[2. Functions][7]


[1]: http://es5.github.io/#x13
[2]: ./vo.md
[3]: scope.md
[4]: executionContext.md
[5]: http://es5.github.io/#x11
[6]: http://es5.github.io/#x13.2
[7]: http://dmitrysoshnikov.com/ecmascript/chapter-5-functions/