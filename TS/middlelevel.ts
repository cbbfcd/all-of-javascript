/**
* TypeScript进阶篇读书笔记
*/

// 1. 类型别名
// TS 中用 type 定义类型别名，其实就是为了书写更方便
type Name = string;
type nameFunc = () => string;
type unionNameType = Name | nameFunc;
function getName(n: unionNameType): Name{
	if(typeof n === 'string'){
		return n;
	}else{
		return n();
	}
}



// 2. 字符串字面量类型
// 也是用 type 定义，就是限定你取值的范围只能是给定的字面量之一

type _str = 'A' | 'B' | 'C'
function getStr(n: _str): string{
	return n;
}
getStr('a'); // 报错，'a' 不在给定的字面量范围内
getStr('A'); // 通过编译




// 3. 元组( tuple )

// 元组的概念和python中的元组异曲同工，可以容纳不同类型的数据。
let tmp: [string, number] = ['123', 123];
// 可以通过索引访问, TS会帮你把类型分的清清楚楚
tmp[0].slice();
tmp[0]='234'; // 不像python，它是可以改变的
tmp[1].toFixed(2);

// 但是在初始化阶段，必须每个类型都要赋值的
let tmp2: [string, number] = ['123']; // 报错，每个类型的都要初始化

// 如果往元组中新增了一个数据(越界的时候)，其类型是已有类型的联合类型
let tmp3: [string, number];
tmp3.push('1');
tmp3.push(1);
tmp3.push('123');
tmp3.push(true); // 报错，boolean类型并不是已有类型的联合类型包括的
tmp3[2].slice(1); //报错，当访问这个越界的元素的时候，他的类型是联合类型的，这里就是string|number
                  //所以，只能访问公共属性啊。
(<string>(tmp3[2])).slice(1); // 可以这样访问，断言属性，忘了吗?





// 4. 枚举( Enum )
// 枚举的概念取于 c# ,直白的说就是自定义的一个集合，转载任何你想的类型，比如星期、颜色、方向...
// TS 中使用 enum 定义枚举

enum colors {black, white, red};
// 枚举成员会被赋值为从 0 开始递增的数字，同时也会对枚举值到枚举名进行反向映射
console.log(colors['black'] === 0) // true
console.log(colors['white'] === 1) // true
console.log(colors[1] === 'white') // true

// 手动赋值
// 未被赋值的会接着上一级以 1 为步长递增，上一级如果赋值为 2.5, 下一个就为 3.5。
// 如果与手动赋值的数产生了冲突， TS 会忽视手动赋值的数，如下， Web 与 Sun
// 其实是先给 Sun 赋值了 3，然后进行到 Web 的时候也刚好是 3，就把前面的覆盖了。
// 手动赋值不一定非要是数字的，你只要断言一下，让 ts 不要检查类型就可以使用字符串赋值。 
enum days { Sun = 3, Mon = 1, Tue, Wed, Thu, Fri, Sat };
enum days2 { Sun = 3, Mon = 1.3, Tue, Wed, Thu, Fri, Sat };

console.log(colors['Tue'] === 2) // true
console.log(colors['Tue'] === 2.3) // true

console.log(colors['Wed'] === 3) // true
console.log(colors[3] === 'Wed') // true
console.log(colors[3] === 'Sun') // false

// 计算项目
// 就是成员赋值也是可以用计算式的
enum colors2 {black, red, yellow='orange'.length};

// 常数枚举
// 常数枚举与普通枚举的区别是，它会在编译阶段被删除，并且不能包含计算成员
const enum colors3 { black, red }


// 外部枚举
// declare 定义的类型只会用于编译时的检查，编译结果中会被删除
// 外部枚举与声明语句一样，常出现在声明文件中。
// 同时使用 declare 和 const 也是可以的
declare enum colors4 { black, red }



// 5. 类
// TS 在 ES6 类的基础上丰富了更多关于类的实现。
// 首先我们要对 类 ( class ) 有个认识，要有 oop 的思想
// 类是把一个事物或者说对象的属性和行为抽象出来进行封装，具有封装、继承、多态的特性。
// 抽象类中只包含抽象方法，不能实例化( new )
// 类是单继承，多实现


// 实现一个ES6的类
class Animal{
	name: string;
	//构造函数，用于初始化
	constructor(name) {
		this.name = name;
	}
	sayHi() {
		return `My name is ${this.name}`;
	}
}

let a = new Animal('Jack');// new 的时候会调用constructor 实例化一个对象，this指向new出来的对象;
// new 建立了原型链的关联， a.proptoty = Object.creat(Animial.prototype)
console.log(a.sayHi()); // My name is Jack

// 实现继承( extends )
class Cat extends Animal{
	constructor(name){
		super(name); // 原生实现类似 Animal.call(this)
		console.log(name);
	}
	// override
	sayHi(){
		return `Ohhhh~,` + super.sayHi();  // 原生实现类似 Animal.prototype.sayHi.call(this)
	}
}

let cat = new Cat('tom'); // tom
console.log(cat.sayHi()) // Ohhhh~,My name is tom

// [[GET]] and [[SET]]
// 提供get/set方法，可以设置和返回自定义的值
// 实现方式 1：利用原生js的Object提供的方法
Object.defineProperty(this,'Animal',{
	set: function(value){
		this.value = value;
	},

	get: function(){
		return this.value
	}
})

// 实现方式2
class Animal2 {
	constructor(name){
		this.name = name;
	}

	get name(){
		return 'Tom';
	}

	set name(value){
		console.log('setter: ', value);
	}
}

let cat2 = new Animal2('jj') // setter jj
cat2.name = 'gg' // setter gg
console.log(cat2.name) // Tom


// 静态方法
// 用static 修饰，不用实例化的对象来调用，直接由类调用，存储在栈中。
// 静态属性已经在 ES7 提案中
class Person{
	static sayHello(){
		console.log('hello')
	}
}

let p = new Person();
p.sayHello() //报错
Person.sayHello();


// TS 中的拓展
// 1. 访问限制修饰符
// 和 java 中的修饰符一样， public private protected
// public 修饰的属性或方法是公有的，可以在任何地方被访问到，默认所有的属性和方法都是 public 的
// private 修饰的属性或方法是私有的，不能在声明它的类的外部访问
// protected 修饰的属性或方法是受保护的，它和 private 类似，区别是它在子类中也是允许被访问的

class Cars{

	public name: string;
	private price: number;
	protected bands: string;

	constructor(name, price, bands){
		this.name = name;
		this.price = price;
		this.bands = bands;
	}

}

class Toyota extends Cars{
	constructor(name, price, bands){
		super(name, price, bands)
		console.log(this.name, this.price, this.bands); // 只有price访问不到。
	}
}

let car = new Cars('BMW', 500000, 'BMW520Li');
car.name;
car.price; // 报错 只能在类里边访问
car.bands;// 报错 只能在类里边和之类里面访问


// 抽象类
// abstract 用于定义抽象类和其中的抽象方法。
// 只含有抽象方法和抽象属性的类，抽象方法就是没有方法体的方法。
// 抽象类的特点:
// 1. 不能被实例话
// 2. 实现的时候必须实现其抽象方法

abstract class Computers{

	protected name: string;

	constructor(name: string){
		this.name = name;
	}

	protected abstract printName(): string;
}


class Lenovo extends Computers{

	constructor(name: string){
		super(name);
	}
	// 必须实现这个抽象方法
	protected printName(): string{
		return `this name is:${ this.name }`
	}
}

let thinkpad: Lenovo = new Lenovo('thinkpadE550C');


// 接口
// 这里的接口和前边提到的接口不是一个东西。
// 接口是面向对象中很重要的一个环节，需要实现类去实现( implements )
// 接口使得我们的oop编程更加灵活，我们可以把公共的属性和行为提取出来，这样只需要实现它就可以使用了。
// 类 继承一个类 可以实现多个接口,必须实现接口的所有方法，其实接口就是一个抽象类

// 比如 灯  是一个类， 台灯是其中一个类型， 灯都可以开和关，这段关系可以这样实现

// 接口
interface LampOper{
	lightOn(a: string): void;
	lightOff(): void;
}
// 灯
class Lamp {

	protected name: string;

	constructor(name: string){
		this.name = name;
	}

	lightOn(b: string): void{
		console.log('lightOn with Lamp', b)
	}

	lightOff(): void{
		console.log('lightOff with Lamp')
	}
}

// 台灯
class DeskLamp extends Lamp implements LampOper{
	protected name: string;
	constructor(name: string){
		super(name)
	}

	lightOn(a: string): void{
		console.log('lightOn with DeskLamp', a)
	}

	lightOff(): void{
		console.log('lightOff with DeskLamp')
	}
} 

// 接口定义函数
interface Counter{
	(start: number): any; // 类似于定义函数的构造参数和返回值
	interval: number; //函数自己的属性
	reset(): void; //函数自己的方法
}

function getCounter(): Counter{
	let counter = <Counter>function(start: number){};
	counter.interval = 5;
	counter.reset = function(){

	}

	return counter;
}

let c = getCounter();
c(10);
c.interval = 5.0;
c.reset();


// 泛型
// 泛型其实就是先给它一个万能类型，直到使用的时候我再具体的给它一个类型

function creatArray<T>(length: number, x: T): Array<T>{
	let result = [];
	for(let i = 0, len = length; i<len; i++){
		result[i] = x;
	}

	return result
}

creatArray(3, 'x'); // ['x', 'x', 'x']

// 多个类型
function changeType<T,U>(a: [T,U]): [U,T]{
	return  [a[1],a[0]];
}

// 泛型约束
// 采用泛型的时候，由于不知道类型，所以不能盲目的去调用什么属性
// 比如你泛型为 T ,你去用 .length ，它万一是数字呢
// 这个时候就可以采用泛型约束

function justTest<T>(a: T): T{
	//console.log(a.length); // T 不一定有length属性啊
	return a;
	
}

// So
interface justInterface{
	length: number;  //约束必须有length属性
}

function justTest2<T extends justInterface>(a: T): T{
	console.log(a.length); 
	return a;
}


// 当然接口也可以加泛型，类也可以加泛型。




