/*
* @Author: 28906
* @Date:   2017-12-01 15:23:28
* @Last Modified by:   28906
* @Last Modified time: 2017-12-01 19:02:58
* @Description: 核心JS
*/


// PS: 从豆瓣api fetch数据，这里从movies.json中读取来模拟这一过程


// fetch 工具方法
function fetchData( url, callback ){
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function(){
		if(this.readyState === 4 && this.status === 200){
			var result = JSON.parse(this.responseText);
			callback( result );
		}
	}
	xhttp.open('GET', url, true);
  	xhttp.send();
}


// load 数据
function loadData(){
	var _url = './movies.json';
	fetchData(_url, buildPage)
}

// 分时函数
// 比如如果要建1000个<li>，肯定消耗惊人，可以采取分时，每300毫秒创建8个<li>
var timeChunk = function(data, fn, count, interval){
	var timer, _data = data;

	var start = function(){
		for(var i = 0, len = Math.min(_data.length, count || 8); i< len; i++){
			var arg = _data.shift();
			fn(arg);
		}
	}

	return function(){
		timer = setInterval(function(){
			if(_data.length === 0){
				clearInterval(timer)
			}

			start();
		}, interval || 300)
	}
}

// build page
function buildPage(data){
	var sb = []
	if(data != null){
		var subjects = data.subjects;
		for(var i = 0, item; item = subjects[i++];){
			var str = "<div class='douban-movie-item'><span>"+
					item.title
					+"</span><img alt='douban-img' src='"+item.images.large+"'/></div>";

			sb.push(str);
		}

		document.querySelector('#root').innerHTML = sb.join('');
	}
}

// execute
loadData()