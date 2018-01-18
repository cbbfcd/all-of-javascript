"use strict";

if('serviceWorker' in navigator){
    navigator.serviceWorker.register('./sw.js').then(function(registration){
        console.log('注册service-worker成功，scope：', registration.scope);
    }).catch(function(err){
        console.log('注册service-worker失败：', err);
    })
}