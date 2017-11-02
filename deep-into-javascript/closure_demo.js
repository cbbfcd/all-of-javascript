/*
* @Author: 28906
* @Date:   2017-10-31 15:39:39
* @Last Modified by:   28906
* @Last Modified time: 2017-10-31 16:02:03
* @Description: 通过闭包隐藏函数或者属性，提升性能
*/

// 假如实现一个可以计算输入参数的乘积的方法
var cal = (function(){
	var cache = {}; // 缓存，提升性能
	var calculate = function(){
		var a = 1;
		for( var i = 0, len = arguments.length; i < len; i++ ){
			a *= arguments[i]
		}
		return a;
	}
	// 闭包
	return function(){
		var args = Array.prototype.join.call(arguments, ',');
		if(cache[args]){
			return cache[args]
		}

		return cache[args] = calculate.apply(null, arguments);
	}
})();
