
// 1. 原始数据类型的ts表示

// 布尔型

// 使用 boolean 定义数值类型

let isBoolean: boolean = false;

let creatByNewBoolean: boolean = new Boolean(1);

let createdByBoolean: boolean = Boolean(5);

// 这里可以看到第二个构造函数创建boolean对象编译不会通过。
// 说明了: 1. ts是一种将javaScript转换为强类型(静态)语言的方案
//         2. new Boolean() 与 Boolean() 的区别

// 补充:
// new 可以理解为构造函数，会建立原型链的继承、链接关系，返回的是一个对象。
// 在 TypeScript 中，boolean 是 JavaScript 中的基本类型，而 Boolean 是 JavaScript 中的构造函数。
// const Boolean : BooleanConstructor(value?: any) => boolean,
// 所以 Boolean(5) 是构造函数调用，返回的是一个 boolean
// 其他的基本类型，除了(null,undefined)也一样。


// 数值型

// 使用 number 定义数值类型

let num1: number = 6;

let num2: number = NaN;

let num3: number = Infinity;

let num4: number = 5.6;

let num5: number = +0;

let num6: number = 0xfff;

let num7: number = new Number(5);

let num8: number = Number(5);

// 二进制和八进制会在编译的时候转成十进制。



// 字符型

// 使用 string 定义字符串类型

let str: string = 'huangteng';

let age: number = 25;

let teml: string = `this is temp str by ${str} who's age is ${age}`



// 空值

// 用void表示没有任何返回值, 用其声明的变量只能是null\undefined

function saySomething(): void {
	alert('test');
}

let unuse: void = 5;

let unuse2: void = null;

let unuse3: void = undefined;



// null or undefined

// TypeScript 中，可以使用 null 和 undefined 来定义这两个原始数据类型

let un: undefined = undefined;

let nu: null = null;

let nu2: null = 5;  // null 只能定义null, undefined同样

let un1: undefined;

let num9: number = un1;

// 任意类型

// TypeScript中可以用any表示任意类型。使其使用起来的效果就像js变量一样

let any1: any = '123';

any1 = 7;

let any2: number = 123;

any2 = '123';  // 如果不是使用any, 会报错。

// 在任意值上访问任何属性都是允许的，对其任何操作返回的结果都是any的
// 变量如果在声明的时候，未指定其类型，那么它会被识别为任意值类型

let any3;  // 这里注意不能初始化，如果let any3 = '5'; 就不再是any；而是string了；
           // TypeScript 会在没有明确的指定类型的时候推测出一个类型，这就是类型推论。
any3 = 5;

any3 = '5';

// 最好的方式是杜绝这种声明但是不赋值和不确定type的写法。



// 联合类型

// 联合类型使用 | 分隔每个类型，表示类型只能是a |(或者) b

let union: number | string = '5';

union = 15;

// 当 TypeScript 不确定一个联合类型的变量到底是哪个类型的时候，
// 我们只能访问此联合类型的所有类型里共有的属性或方法.

function getLength(something: string|number): number{
	return something.length;
}

// 上述方法报错是因为不确定参数是string | number,而number是没有length属性的；

function getString(something: string|number): string{
	return something.toString();
}

// 上述方法访问 string 和 number 的共有属性是没问题的

// 联合类型的变量在被赋值的时候，会根据类型推论的规则推断出一个类型

console.log(union.length); // union 被推论为 number;


// 接口

// 那么对象的类型用什么定义呢？

// TypeScript用interface来表示接口，接口的作用是定义对象的 type;

// 以面向对象思想思考，接口封装的是抽象的公共的行为、动作。由具体的个体(class)去实现(implements);

// TypeScript的接口还可以定义对象的属性、特征，对象的属性、特征必须保持和接口的一致,不能多也不能少

interface Person{
	name: string;
	age: number;
}

let guy: Person = {
	name: 'jack',
	age: 25
}

// 但是这样有时候会很麻烦，我们很多时候不需要都实现接口的属性，可以使用可选属性，就是加一个?
// 这时可以少，但是还是不可以多
interface Person2{
	name: string;
	age?: number;
}

let guy2: Person2 = {
	name: 'jack'
}


// 如果我们非要给它新增一个未定义的属性呢，我们可以使用任意属性

interface Person3{
	name: string;
	age?: number;
	[propName: string]: any;  // 任意属性,要求该接口内的基本属性、可选属性都必须是它的子属性
}

let guy3: Person3= {
	name: 'jack',
	job:'jser',
	address:'xxxxx'
}


interface Person4{
	name: string;
	age?: number; // type是number 并不是stirng的子属性，改成string 就可以了。
	[propName: string]: string;  // 任意属性,要求该接口内的基本属性、可选属性都必须是它的子属性
}

let guy4: Person4= {
	name: 'jack',
	job:'jser',
	address:'xxxxx'
}


// 只读属性

// 如果我们需要定义接口中的属性在初始化赋值之后就不可以被改变，就可以使用readonly表示只读属性。

interface Animal{
	type: string;
	readonly id: number;
}

let cat: Animal = {
	type: 'miao',
	id: 123 // 这里如果不给id初始化赋值，会报错
}

cat.id = 123;  // 报错， 因为 id 初始化后就变成只读属性了。


// 在typeScript中，对于数组的定义非常灵活

// 1. 使用 类型 + [] 的方式来表示，类似于java那样

let arr1: number[] = [1, 2, 3];
let arr2: number[] = [1, 2, 3, '4']; // error

// 联合类型数组
let arr3: (number | string)[] = [1, 2, '3'];
arr3.push(arr1);
arr3.push(5);
arr3.push('5');


// 2. 使用泛型表示  Array<ElementType>

let arry4: Array<number> = [1, 2, 3];

// 3. 用接口表示数组

interface numArray{
	[index: number]: number // 意思是index和值都必须是数字
}

let numArr: numArray = [1, 2, '3'] // 只能是数字
let numArr2: numArray = [1, 2, 3]
let numArr3: numArray = {1:1,2:2} // 但是这貌似也满足


// 4. 能装载各种数据类型的数组，就得使用我们之前学习的 any

let anyArr: any[] = [1, 2, '123', {}];
let anyArr2: Array<any> = [1, 2, '123', {}];

// 5. 在TS中类数组不是数组，用数组的表示会出错，比如函数的参数

function foo(){
	let args: number[] = arguments;
}


// 函数声明与表达式

// 函数的声明
// 限定了参数的格式只能是number,返回值的类型也是number
// 参数不能多，也不能少，bar(1,2,3)  bar(1) 都会报错
function bar(x: number, y: number): number{
	return x + y;
}

// 函数表达式

let myFun = (x: number, y:number) => {
	return x + y;
}

// 上面的表达式左边没有限定类型，会通过类型推导给一个类型；或者是直接给它写全了,但是忒麻烦
let myFun2:(x: number, y: number) => number = function(x: number, y: number):number{
	return x + y;
}

// 可选参数
// 语法上也是加一个 ? , 写法的要求是必须写在后边，也就是说可选参数后边不能再跟一个必须参数了；

function getMySum(x: number, y?: number){
	if(y){
		return x + y;
	}else{
		return x + 5;
	}
}
getMySum(5);
getMySum(5,12);



function getMySum2(x: number, y?: number, z: number){ // z 报错
	if(y){
		return x + y;
	}else{
		return x + 5;
	}
}


// 参数默认值
// 在 ES6 中，我们允许给函数的参数添加默认值，TypeScript 会将添加了默认值的参数识别为可选参数
// 此时就不再有可选参数后边不能再有必选参数的限制了

function getName(firstName: string = 'liu', lastName: string){
	if(lastName){
		return firstName
	}else{
		return firstName + ' ' + lastName
	}
}

getName(,'test'); // 第一个不传或者传一个undefined


// 拓展剩余参数
// 主要还是利用ES6的语法，记住 ...rest 只能反正最后一个参数的位置
function makeArr(arr: Array<any>, ...rest: Array<any>){
	if(rest.length){
		rest.map((val, index)=>{
			arr.push(val);
		})
	}
}

makeArr([], [1, 2, '3']);


// 重载
// 重载可以通俗的理解为传入不同的参数( 参数个数不同 | 类型不同 ),对应作出不同的处理，编译器会根据参数
// 的个数，类型去匹配到对应的执行函数执行。
// 前面写的两个reverse函数只有定义，没有实现，是为了重载的时候精确匹配返回值。
// TypeScript 会优先从最前面的函数定义开始匹配，
// 所以多个函数定义如果由包含关系，需要优先把精确的定义写在前面
function reverse(a: number | string): number;
function reverse(a: number | string): string;
function reverse(a: number | string): number | string{
	if(typeof a === 'string'){
		return a.split('').reverse().join('');
	}else if(typeof a === 'number'){
		return Number((a.toString()).split('').reverse().join(''));
	}
}

reverse(123);
reverse('123')


// 类型断言
// 类型断言（Type Assertion）可以用来绕过编译器的类型推断，手动指定一个值的类型（即程序员对编译器断言）。
// 语法 <类型>值
// note: 在react的TSX语法则必须是 值 as 类型

// 断言和测试中的断言使用理念差不多，其实就是假设一个类型，我断定他就是这个类型，不是就拉到。
// 目的是为了解决一种问题，就是前边提到的联合类型，我不确定我的参数是什么类型，可能是 number
// 还可能是 string ,直接调用 .length方法肯定会报错的，这个时候就可以用类型断言
// 类型断言不是类型转换，断言成一个联合类型中不存在的类型是不允许的
function testAssert(x: number | string): number{
	if(x.length){
		return x.length; // 报错。x不确定类型，只能使用公共属性
	}else{
		x.toString().length;
	}
}

function testAssert2(x: number | string): number{
	if((<string>x).length){
		return (<string>x).length; // 编译通过，我断言它就是个string类型的
	}else{
		x.toString().length;
	}
}


// 声明文件
// 当使用第三方库时，我们需要引用它的声明文件，约定以 .d.ts结尾
// 其实就是我们使用第三方库，但是TS并不认识它，比如 $ Jquery之类的，
// 我们就需要 声明 他们，使用关键字 declare 
declare var Jquery: (string) => any;

// 这种声明我们一般单独放在一个 .d.ts文件中，这就是声明文件。
// 社区推荐的方式还是通过 @types 来管理声明模块； 
// 如： npm install @types/jquery --save-dev
// 参考: https://blogs.msdn.microsoft.com/typescript/2016/06/15/the-future-of-declaration-files/


// 内置对象
// TS把JS、DOM、BOM中的内置对象都放进了它的核心库中，除了nodejs 的;
// 要想使用TS写node,需要: npm install @types/node --save-dev
// 具体的js内置对象，比如Error、Date、RegExp..., DOM/BOM内置对象 如: HTMLElement,Document...
// 可参见MDN
