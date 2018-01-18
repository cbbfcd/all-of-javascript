/*
* @Author: 28906
* @Date:   2018-01-05 16:49:03
* @Last Modified by:   28906
* @Last Modified time: 2018-01-06 00:33:26
* @Description: 'for world peace'
*/

"use strict";


let CACHE_NAME = 'todolist-v1.0';

self.addEventListener('install', event => {
    event.waitUntil(self.skipWaiting());
})

self.addEventListener('activate', event => {
	event.waitUntil(
		Promise.all([
			// 更新客户端
            self.clients.claim(),

            // 清理旧版本
            caches.keys().then(function (cacheList) {
                return Promise.all(
                    cacheList.map(function (cn) {
                        if (cn !== CACHE_NAME) {
                            return caches.delete(cn);
                        }
                    })
                );
            })
		])
	)
})


self.addEventListener('fetch', event => {
	
	event.respondWith( 
		caches.match(event.request, { ignoreSearch: true })
		.then(function(response){
			if(response){
				return response; 
			}

			var fetchRequest = event.request.clone();
			return fetch(fetchRequest).then(function(response){
				if(!response || response.status !== 200){
					return response; // 绝不缓存错误的
				}

				var responseToCache = response.clone();
				caches.open(CACHE_NAME).then(function(cache){
					cache.put(fetchRequest, responseToCache);
				})

				return response;
			})
		}).catch(function(){ 
			return caches.match('./index.html');
		})
	)
})