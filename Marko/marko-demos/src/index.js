/*
* @Author: 28906
* @Date:   2017-10-09 15:41:05
* @Last Modified by:   28906
* @Last Modified time: 2017-10-13 17:06:31
*/

// 组件需要 require 获取。如果是 node.js 环境，需要引入工具。
const myComponent = require('./components/comp1/index.marko')
const asyncComponent = require('./tempaltes/aysnc_example.marko')
const customComponent = require('./pages/index.marko')
// 1. renderSync(input) 同步渲染
// 参数是一个对象，会在view中定义为 input 变量。通过 ${input.name}来获取这个输入值
// myComponent.renderSync({name: 'Marko'}) 返回的是一个 RenderResult 对象
// 代码:
// myComponent.renderSync({name: 'Marko'}).appendTo(document.getElementById('root'))
// console.dir(myComponent.renderSync({name: 'Marko'})) //RenderResult

// 2. render(input) 异步的渲染
// 参数是一个对象，会在view中定义为 input 变量。通过 ${input.name}来获取这个输入值
// 返回的是一个 Promise.resolve(RenderResult) 对象
// 代码：
let input = {
	name: 'Marko',
	$global:{
		author: 'huangteng'
	},
	flag: true,
	attrs:{
		class: 'active',
		href: 'http://www.baidu.com'
	},
	items: [1,2,3]
}

// 基本知识demo
if(location.pathname === '/'){
	myComponent.render(Object.assign({}, input)).then( result => {
		result.appendTo(document.getElementById('root'));
	})

	// 单独render异步的模板
	asyncComponent.render({}).then( res => {
		res.appendTo(document.getElementById('test'))
	})
}

// 自定义标签、组件demo
if(location.pathname === '/custom'){
	customComponent.render({}).then( res => {
		res.appendTo(document.getElementById('root'))
	})
}
