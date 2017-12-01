/*
* @Author: 28906
* @Date:   2017-12-01 15:23:54
* @Last Modified by:   28906
* @Last Modified time: 2017-12-01 17:11:57
* @Description: service-worker
*/


var cacheName = 'douban_movie'; // 缓存的名字


// service-worker下载、注册、激活之后，install事件就可以被监听了。
// 如其名，install，表示页面上的js,css,img等都可以被缓存的时机成熟了。
// 这些数据都是静态的，也就是不会变的，比如本demo中引入的 svg, main.js, style.css 等
// 每次进来都会加载的静态的，不会变化的数据，我们把它缓存起来，
// 它们就像是这个demo app的外壳一样，缓存起来的好处就是没有网络的时候打开app，这个壳至少会
// 显示出来，从而增加用户体验。当然第一次还是相对很慢的，以后的重复访问都是从缓存拿出来，就很快了。
self.addEventListener('install', function(event){
	event.waitUntil( //waitUntil表示等到资源加载好，service-worker激活
		caches.open(cacheName)
		.then(function(cache){ // 把外壳需要的不变的资源缓存起来
			cache.addAll([
				'./main.js',
				'./movie.svg',
				'./style.css',
				'./movies.json'
			])
		})
	)
})


// 当页面有了新的资源的时候，我们也要缓存起来。
// 这个时候就不能上边那样用了，因为是动态的，比如一个新闻网站 懂球帝 之类的
// 它的新闻是在不断的更新的，也就是打开页面额时候会去请求新的数据。
// 这个时候我们监听请求 fetch 事件，缓存请求的数据，下一次同一请求就从缓存中返回了。
self.addEventListener('fetch', function(event){
	// 我们作为一个代理，劫持请求，判断缓存有没有请求的数据，有就从缓存返回，
	// 没有就正常去访问服务器响应的数据，然后缓存起来，再返回。
	// 这也是respondWith的意思
	event.respondWith( 
		// caches.match判断缓存里面有没有对应的数据
		caches.match(event.request, { ignoreSearch: true })
		.then(function(response){
			if(response){
				return response; //缓存有，就直接返回
			}

			//如果缓存没有，我们就要去发起请求获取数据，再缓存起来
			// 记住，请求和响应都是流，只能用一次，所以都要clone一次。
			var fetchRequest = event.request.clone();
			return fetch(fetchRequest).then(function(response){
				if(!response || response.status !== 200){
					return response; // 绝不缓存错误的
				}

				var responseToCache = response.clone();
				// 把获得到数据缓存，下一次同一请求就从缓存拿数据了
				caches.open(cacheName).then(function(cache){
					cache.put(fetchRequest, responseToCache);
				})

				return response;
			})
		})
	)
})
// 这只是一个基础的demo，用以揭示 PWA 应用中缓存的实现。
// 缓存成功与否可以在 chrome F12 中找到 Cache下的 Cache Storage 查看。
// 你刷新页面也会发现速度更加快了。
// 当然，上面的demo还有很多缺点，比如上面的代码是对所有的请求数据做了缓存，实际上我们
// 并不需要这么多数据都缓存，所以只需要缓存特定的一些资源就好了，比如外壳需要的css,js，svg
// 至于动态的请求内容需要缓存不根据你的项目需要，另外加一些路由匹配可以精确的指定哪些请求
// 资源是需要缓存的。这个后边会说。

