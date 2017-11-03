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

将非数字转为数字。
基本规则：
```
true --> 1
false --> 0
null --> 0
undefined --> NaN
```

自己试试：
```
Number( true ); // 1
Number( false ); // 0
Number( undefined ); // NaN
Number( null ); // 0
Number( "" ); // 0
Number( " " ); // 0
Number( "''" ); // NaN
Number( [] ); // 0
...
```

对于对象(包括数组)会首先被转换为相应的基本类型值，如果返回的是非数字的基本类型值，则遵循上面的规则强转为数字。

至于如何转换为基本类型呢，就会执行抽象操作toPrimitive。该操作会首先检查该对象是不是定义了valueOf()方法，有就首先调用，不然就判断有没有toString()方法,如果有就用其返回值用上面的规则进行类型强制转换的操作。valueOf的优先级更高。

```
// 如果定义了valueOf，就会用其返回值利用上面的规则进行转换
var a = {

    valueOf: function(){
        return '42'
    }
}
Number( a ); // 42

// 如果同时有valueOf和toString
var a = {
    valueOf: function(){
        return '42'
    },
    toString: function(){
        return '43'
    }
}

Number( a ); // 42 说明先调用的是valueOf

// 数组
var arr = [1,2,3]
var arr1 = [1]
Number( arr ); // NaN
Number( arr1 ); // 1
arr.toString = function(){
    return this.join('')
}

Number( arr ); // 123
```

### 4. toBoolean

这里我们必须纠正一个错误的观点，相信大多数人都会认为1和0分别等同于true和false。
这个观点是错误的，虽然他们相互强转确实是那样的结果。

##### falsy

这个列表是掌握强转为布尔类型最重要也是最有效的，请记住：
1. undefined
2. null
3. false
4. +0, -0, NaN
5. ""

上面的5种类型强制转换的结果为false。如果不在上述范围内，强转结果基本为true。
这里说基本，也是要纠正我们的一个错误观点，比如对象不在上述范围内，很多人认为对象强转为布尔类型是恒等于true的，这也是不准确的。

```
Boolean(undefined || null || NaN || 0 || ""); // false

// 对象大多数情况是true
Boolean({} && [] && Object("") && function(){} && Object.create(null)); // true

// 有一种对象，比如 document.all,我们常用来判断IE版本
Boolean( document.all ); // false

// 除了空字符串，其余的都是true，注意 "''" ==> true
Boolean('0' && 'false' && "''" && '  '); // true
```


## 显式强制类型转换

1. 字符串和数字间的显示强转

    最基本的就是利用内建函数String()、Number()利用上面的规则进行转换。

    ```
    var a = '42';
    var b = Number( a );
    var c = String( b );
    ```

    除了这还有很多转换的方法：

    ```
    // 转数字
    var a = '42';
    typeof parseInt(a); // "number"
    typeof parseFloat('42'); // "number"
    typeof +a; // "number" 一元运算符实现字符串转数字
    -(~a)-1 ; // 42

    // 转字符串
    var a = 42;
    typeof a.toString(); // "string"
    // 如果 42.toString()会报错的，因为小数位.比调用的.优先级高
    // 可以使用42..toString()或者 42 .toString()，都不建议使用。
    typeof (a+''); // "string"
    ```

    上面提到了一元运算符可以用来将字符串转为数字，但是不要滥用，不然你会懵逼的！
    ```
    var a = '5';
    var b = 5 + +a; // 10

    // 这样呢
    5 + - + + + - + a; // 10
    5 + - - + - + a; // 0
    ```

    一元运算符"+"可以把Date对象转化为时间戳。

    ```
    new Date(); // hu Nov 02 2017 23:55:20 GMT+0800 (中国标准时间)
    +new Date(); // 1509638132808
    ```
    
    ~位运算符。 ~返回的是2的补码。

    大体上 ~x == -(x+1);
    ```
    ~42; // -43
    ```

    所以 ~x等于0的情况就是x = -1;这个细节很有作用，比如在indexOf()判断
    ```
    var a = 'hello world';
    if(!~a.indexOf('eh')){
        console.log('没匹配到')
    }
    ```
    
    ~~ 用于字位截除，虽然常用来截取小数部分，但是和Math.floor()是不一样的。
    ~~ 运算，第一个~用于 TOINT32 操作并反转，第二个~再反转回原值，注意对负数进行操作的时候其结果与Math.floor是不同的。
    ```
    ~~25.867; // 25
    ~~0.435345346; //0
    ~~-49.5; // -49
    Math.floor(-49.6); // -50
    ```
    
    ##### 还可以使用 | 
    ```
    25.867 | 0; // 25
    -123.23423 | 0; // -123
    ```

    ##### Numer()与parseInt()
    
    Number()和parseInt()对字符进行转换的时候有一个区别。
    ```
    var a = '42'
    var b = '42px'

    Number( a ); // 42
    parseInt( a ); // 42

    Number( b ); // NaN
    parseInt( b ); // 42
    parseInt( 'xp24' ); // NaN
    ```
    
    parseInt从左边开始解析，遇到非数字就停止。第二个参数默认是10.

    parseInt是一个有很多让人迷惑的地方：
    ```
    // "Infinity" 对I进行19为基数转换为18，遇到第二个'n'是数字字符，停止。
    parseInt(1/0, 19); // 18

    // 拆箱后解析
    parseInt(new String(42)); // 42
    var a = {
        num: 54,
        toString: function(){
            return this.num
        }
    }

    parseInt( a ); // 54

    // 7位小数会用科学计数法，6位的时候不会
    parseInt(0.000008); // 0 --> 0.000008
    parseInt(0.0000008); // 8 --> 8e-7

    // '105' --> '10'
    parseInt('105', 2); // 2
    
    // f --> 15; f来自function()...
    parseInt(parseInt, 16); // 15
    parseInt(false, 16); // 250  --> 'fa'
    ```
    




    