# JavaScript中的异步

异步所关注的核心点就是现在运行的部分与未来运行的部分之间的关系。

## 1. 事件循环

JavaScript 引擎是依托宿主环境运行的。宿主环境可以是 Web浏览器、也可以是服务器等。

这些环境还提供了一种机制，用以在适当的时候调用 JS 引擎来执行代码块。这种机制就是事件循环。

在 ES6 之后，事件循环纳入了 JS 引擎的势力范围。主要是因为 Promise 可以精细的控制事件循环队列。

我们模拟一个事件循环，虽然不准确，可以加深理解。

```
var eventLoop = []; // 先进先出队列
var event;

while( true ){
    if( eventLoop.length > 0 ){
        event = eventLoop.shift();
    }

    try{
        event();
    }catch( err ){
        console.log( err );
    }
}
```

这一段简洁的有些粗暴的代码不能够说明事件循环具体的机制，只能说明概念。

比如 setTimeout(...,0) 之类的代码并不是直接把回调放进了事件循环排队执行。而是放进了 Marco Tasks 中。与之相对的是 Micro Tasks。这个后边会说。

我又改主意了，不打算说这个问题了。因为网上好文太多了。

参考: <a href='https://juejin.im/post/59e85eebf265da430d571f89'>JS如何执行</a>

## 2. 并行线程

异步执行指的是现在执行和未来执行的关系，并行强调的是同时执行。二者不能混为一谈。

并行最常见的工具就是线程和进程，多个线程共享一个进程。事件循环是事件队列排队执行，不允许对共享内存的并行访问和修改。

并行是语句级别的交替执行，而JS是单线程的，其代码执行具有原子性。二者粒度不同。

```
var a = 20;

function foo(){
    a = a + 1;
}

function bar(){
    a = a * 2;
}

Ajax('someurl', foo);
Ajax('someurl', bar);
```

所谓原子性，就是指上面代码中 foo 执行和 bar 执行是完整执行的。也就是说， foo 执行的时候不会被 bar 中断， bar 执行的时候不会被 foo 中断。二者谁先执行，需要竞争，而且输出的结果是不一样的。这就是竞态条件。

假如JS可以多线程并行执行上面的代码，这样的并行是语句级别的，其结果和过程更加的复杂。需要我们外加条件，比如同步锁机制来限制并行的访问和操作内存。

并发则是进程级别的"并行"，单线程事件循环是并发的一种形式。可以把一个事件看作一个进程。


## 条件

"进程"之间的交替执行可能会产生意想不到的结果，这个时候我们就需要给其一个条件。

```
var a ,b;

function foo(){
    a = 4;
    baz()
}

function bar(){
    b = 5;
    baz()
}

function baz(){
    console.log(a*b)
}

ajax('...', foo)
ajax('...', bar)
```

上面的代码因为不管是foo先执行还是bar先执行，都可能造成异常，因为有一个变量没有赋值。解决办法是加一个条件(也叫做"门")。让他们都执行完了再一起打开门(执行baz)。

```
var a ,b;

function foo(){
    a = 4;
    if(a && b){
        baz()
    }
}

function bar(){
    b = 5;
    if(a && b){
        baz()
    }
}

function baz(){
    console.log(a*b)
}

ajax('...', foo)
ajax('...', bar)
```

有时候我们不关心谁先执行，这就需要竞态条件。

```
var a;

function foo(){
    a = 5;
    baz();
}

function bar(){
    a = 6;
    baz();
}

function baz(){
    console.log(a)
}

ajax('...', foo);
ajax('...', bar);
```

我们不关心谁先执行，但是这样会产生覆盖。我们加一个竞争条件，让第一个执行的执行，后执行的忽略。

```
var a;

function foo(){
    a = 5;
    if(!a){
        baz();
    }
}

function bar(){
    a = 6;
    if(!a){
        baz();
    }
}

function baz(){
    console.log(a)
}

ajax('...', foo);
ajax('...', bar);
```

这样就是一个简单的竞态模型了。只有先达到的才会被执行。

## 并发协作

并发协作是一种并发合作方式。这中协作方式一般就不是通过共享作用域中的值进行交互了。

而是旨在提供协作性更好，不会阻塞的并发系统。我们举一个例子说明。
假如我们需要处理Ajax响应的一个超级大的数组。我们如果这样处理:

```
var res = [];

function response(data){
    res = res.concat(
        data.map( function(val){
            return val * 2
        })
    )
}

ajax('...1', response);
ajax('...2', response);
```

这样处理的话，假如数组数组有个100万条数据，你就GG了。阻塞的你不要不要的。

所以我们尝试着改造成更有好的并发系统：

```
var res = [];

function response(data){
    // 切片
    var chunk = data.splice(0, 1000);

    res = res.concat(
        chunk.map( function(val){
            return val * 2
        })
    )
    
    // 关键在这里
    if(data.length>0){
        setTimeout(function(){
            response(data)    
        },0)
    }
}

ajax('...1', response);
ajax('...2', response);
```

如果你读懂了前边说的:《 参考: <a href='https://juejin.im/post/59e85eebf265da430d571f89'>JS如何执行</a> 》中的内容。

你就能理解这里的hack(setTimeout(..0))的作用。大概就是每次把response放进了Marco Tasks队列中，把主线程让出来给别的程序跑，当主线程上的代码和Micro Tasks执行完了再执行。

这样就不会造成阻塞，而且并发提高了效率，但是有一个缺点就是顺序就不确定了。如果要排序的话，就要费劲的加一些条件了。

事实上就算两个连续挨着的setTimeout，你也不能保证其按照调用顺序处理，诸如定时器飘逸之类的意外使其不能被预测。



