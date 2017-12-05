"use strict";
var cacheName = 'pwa-demo-v2';
// self.addEventListener('install', function (event) {
//     event.waitUntil(self.skipWaiting());
// });


// self.addEventListener('activate', function (event) {
//     event.waitUntil(self.clients.claim());
// });

// webp格式是google推出的图片格式，图片质量不变，但是体积更小
// 比如说本 demo 中的 jpg格式图片为 137kb, webp 格式的为 87kb。
// 拦截图片请求，返回webp格式的图片。
self.addEventListener('fetch', function(event) {
    // Check if the image is a jpeg
    if (/\.jpg$|.png$/.test(event.request.url)) {

        // 判断是否支持 webp 格式
        // 浏览器支持改格式的花，在 headers 中有 accept: image/webp 首部
        var supportsWebp = false;
        if (event.request.headers.has('accept')) {
            supportsWebp = event.request.headers.get('accept').includes('webp');
        }

        // 支持WebP
        if (supportsWebp) {
            // Clone the request
            var req = event.request.clone();
            var returnUrl = req.url.substr(0, req.url.lastIndexOf(".")) + ".webp";
            console.log(returnUrl)

            // 改进一下 缓存一下 webp 格式的图片
            event.respondWith(
                // fetch(returnUrl,{
                //     mode: 'no-cors'
                // }).then(function(response){
                //     return response;
                // })
                caches.match(returnUrl, { ignoreSearch: true })
                .then(function(response){
                    if(response){
                        return response; //缓存有，就直接返回
                    }

                    return fetch(returnUrl).then(function(response){
                        if(!response || response.status !== 200){
                            return response; // 绝不缓存错误的
                        }

                        var responseToCache = response.clone();
                        caches.open(cacheName).then(function(cache){
                            cache.put(returnUrl, responseToCache);
                        })

                        return response;
                    })
                })
            );
        }
    }
});


this.addEventListener('fetch', function (event) {
    if(event.request.headers.get('save-data')){
        // 我们想要节省数据，所以限制了图标和字体
        if (event.request.url.includes('fonts.googleapis.com')) {
            // 不返回任何内容
            event.respondWith(new Response('', {status: 417, statusText: 'Ignore fonts to save data.' }));
        }
    }
});
