# 强制类型转换

## 类型转换与强制类型转换

类型转换发生在静态语言的编译阶段，强制类型转换发生在动态语言的运行期间。
在JavaScript中都统称为强制类型转换，分为显式强转和隐式强转。

JavaScript中的强转总是返回的是标量基本类型，如数字、字符串、布尔，不会返回对象或者函数类型。

```
var a = 1;

var b = a + ''; // 隐式强转
var c = new String( a ); // 显式强转
```

## 抽象操作

抽象操作就是ES5规范中关于强制转换的一些基本规则。

### 1. toString

toString的抽象操作用来处理非字符强转为字符串。

首先是基本的规则：
    1. null -> "null"
    2. undefined -> "undefined"
    3. true -> "true"
    4. 5 -> "5" 如果是极大或者极小的数字返回的是指数形式的字符串。
    5. \[1,2,3\] -> "1,2,3" 将所有单元字符串化后用","拼接
    6. Object -> "\[Object object\]"

toString操作是可以被显式的调用的：

```
5..toString(); // "5"
true.toString(); // "true"
[1,2,3].toString(); // "1,2,3"
Object.prototype.toString.call(5); // "[object Number]"
```

对于上述第6点的对象，如果重写了自己的toString()方法，就不会默认返回内部属性\[\[class\]\]。而是调用重写了的toString()方法返回结果。实际上对象的抽象操作还有toPrimitive的过程，后边会提到。

这一点像Java中定义一个实体类的时候重写toString()方法的效果。

### 2. JSON.stringify()

这是我们常用的一个工具方法，用来把Json对象序列化为字符串。

这一过程并不是严格意思上的强制类型转换，但是也用到了toString()。

对于简单值来说其效果和toString()相似，总是返回一个字符串：
```
JSON.stringify( 5 ); // "5"
JSON.stringify( true ); // "true"
JSON.stringify( null ); // "null"
JSON.stringify( "null" ); // ""null"" 双引号哦
JSON.stringify( [1, 4] ); // "[1,4]"
```

但是对于<a href="#">非JSON安全</a>(不能够呈现有效JSON格式)的值，会被<a href="#">忽略</a>，在数组中则<a href="#">返回null，以保证数组单元的位置不变。</a>

一般<a href="#">非JSON安全</a>的值指的是undefined、function、symbol、包含循环引用的对象等。

```
JSON.stringify( undefined ); // undefined 注意不是"undefined"
JSON.stringify( function(){} ); // undefined
JSON.stringify( {a:'2', b: undefined, c: function(){}} ); // "{"a":"2"}"
JSON.stringify( [1, function(){}, undefined, 4] ); // "[1,null,null,4]"
```

JSON对象也有类似toString()的方法可以重写，用来定义序列化输出的结果。==> toJSON

```
var a = {
    name: 'tom',
    age: 15
}
a.toJSON = function(){
    return {
        name: '就不输出tom',
        age: '永远18'
    }
}
JSON.stringify( a ); // "{"name":"就不输出tom","age":"永远18"}"
```

toJSON方法返回的应该是一个能够被序列化的JSON安全的值，比如对象或者数组。不要返回一个字符串，不然最后输出的是""{}""这样的结果。

##### JSON.stringify的其他黑科技

1. replacer参数
    作为JSON.stringify()的第二个参数，用于确定或者排除对象序列化过程中哪些属性可以被序列化，该参数可以是一个数组或者一个函数。数组用于指定允许序列化的属性的名字。
    
    ```
    var a = {
        name: 'tom',
        age: 15
    }
    // 只序列化name
    JSON.stringify(a, ['name']); // "{"name":"tom"}"
    ```

2. space参数
    第三个参数用于制定缩进，可以是字符串或者是数字
    ```
    var a = {
        b: 'bbb',
        c: 'ccc',
        d: {
            e: 'eee'
        }
    }
    JSON.stringify(a, 4);
    JSON.stringify(a, '------'); // 我在opera上没看到效果...
    ```

### 3. toNumber
