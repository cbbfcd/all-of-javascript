# Hyperapp + picostyle + parcel + webStorage + PWA + MST todolist demo 

偶然看到一个很酷的库，大小只有 1kb，对，没错，你没看错。

>1 KB JavaScript library for building web applications

这个项目起先我还没怎么注意，后来看其增长速度不错，截止到现在在github上已经 10374 star。

这里附上官网 [hyperapp][1]

当然还有最近很火的[parcel][2]

>快速，零配置的 Web 应用程序打包器

然后找了个style-components风格的 picostyle, 撸了一个潦草的todolist。

# start

```
yarn install
yarn start   // 8080 可以在package.json 中"parcel src/index.html -p 8080"修改
```

# todo

1. PWA
2. 通过 MST 管理state tree
3. 简单的分页
4. 已完成和未完成的分类选择

[1]:https://hyperapp.js.org
[2]:http://www.css88.com/doc/parcel