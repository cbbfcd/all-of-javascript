# css3-filter

css3-filter 是一个利用 filter 属性实现的滤镜功能的简单 demo。

# 实现思路

## 首先实现一个 slider 组件

其实可以直接使用 antd 的，这里我就自己简单写了一个。

首先构造出我们要的 DOM 结构：

```html
<div> <!-- wrapper -->
    <div> <!-- slider-line -->
        <div> <!-- slider-left -->
            ...
        </div>
    </div>
</div>
```

就是构造出一个容器，然后定义用来滑动的线条，再定位上去一个以左侧起点

为准的左侧线条，在这个左侧线条的最右侧就是显示的滑动球，再利用伪类写一个tooltip。

这里确定滚动球的圆心在 slider-left 的最右侧需要利用 margin-top| margin-right 简单的计算一下。

然后就是利用 mouseup、mousedown、mousemove 事件计算滑动的距离，然后进行位移和数据展示，需要进行适当的节流。

```js
// 鼠标移动
handleMouseMove(e){
    let {draging, startLeft, parentWidth, sliderLeft} = this.state;
    let {max, min, cb, id} = this.props;
    if(!draging) return;
    this.timer = setTimeout(()=>{
        this.timer = null;
        let nowLeft = e.clientX, 
            offset = nowLeft-startLeft, 
            percent = ~~((sliderLeft+offset)*100/parentWidth);
        if(sliderLeft+offset <= 0){
            percent = 0;
        }else if(sliderLeft+offset >= parentWidth-9){
            percent = 100;
        }

        let d = ~~(percent * (max-min) / 100 + min);
        this._isMounted && this.setState({
            left: percent,
            tooltip: d
        });

        cb({[id] : d});
    }, 17);
}
```


最终效果如下：

[![9g3Xdg.gif](https://s1.ax1x.com/2018/03/06/9g3Xdg.gif)](https://imgchr.com/i/9g3Xdg)

实现的很简单，但是够用了。

## 然后实现照片上传组件

这里使用的是 [react-dropzone][1] 实现的。然后上传到 [cloudinary][2] 中去，关于 

cloudinary 的使用，网上有很多教程，也有官方的文档，可以很清楚地了解它的 API。

这里上传成功后就会返回一个图片的 url。

```js
// image drop cb
onImageDrop = (files) => {
    this.setState({
        uploadFile: files[0],
        Msg: 'upload start...'
    })

    this.handleUploadFile(files[0]);
}
// upload file
handleUploadFile = (file) => {
    let uploader = null;
    try{
        // upload to cloudinay cloud zone
        uploader = request.post(CLOUDINARY_UPLOAD_URL)
                              .field('upload_preset', CLOUDINARY_UPLOAD_PRESET)
                                  .field('file', file);
    }catch(e){
        this.setState({
            Msg: `err: unkown error!`
        })
    }
    
    uploader && uploader.end((err, res) => {
        if(err){
            this.setState({
                Msg: `err: ${err.message}!`
            })
        }

        if(res.body.secure_url !== ''){
            this.setState({
                uploadImgUrl : res.body.secure_url,
                Msg: 'upload success! loading img...'
            })
        }
    })
}
```

效果如下:

![9gGa4J.gif](https://s1.ax1x.com/2018/03/06/9gGa4J.gif)

## 滤镜效果

这里的滤镜效果是用 filter 实现的。

```js
const Img = styled.img`
    position: absolute;
    max-width: 100%;
    max-height: 100%;
    filter: blur(${props=>props.blur}px) 
            brightness(${props=>props.brightness}%) 
            contrast(${props=>props.contrast}%)
            grayscale(${props=>props.grayscale}%)
            hue-rotate(${props=>props.hue}deg)
            invert(${props=>props.invert}%)
            opacity(${props=>props.opacity}%)
            saturate(${props=>props.saturate}%)
            sepia(${props=>props.sepia}%);
`;
```

效果如下:

![9gGwC9.gif](https://s1.ax1x.com/2018/03/06/9gGwC9.gif)

## 下载图片

我最初的想法是使用 html2canvas 实现屏幕截图，然后下载下来的，后来发觉不行，因为它不支持 filter 属性还。

所以只能简单的写一个 canvas 截图保存的方法了。

```js
// 获取像素比
getDPR =() =>{
    if(window.devicePixelRatio && window.devicePixelRatio > 1){
        return window.devicePixelRatio;
    }
    return 1;
}

// 加载图像
loadImage = (url) => {
    return new Promise((resolve, reject) => {
        var image = new Image();
        image.crossOrigin = 'Anonymous'; // 跨域
        image.onload = () => {
            image.onload = null;
            resolve(image);
        }
        image.onerror = (err) => {
            reject(err);
        }
        image.src = url; // PS:这个必须放在设置crossOrigin后边。
    })
}

// 自定义截图保存，因为html2canvas不支持filter属性
savePngByCanvas = (currNode, type='png') => {
    this.loadImage(currNode.src)
    .then(img => {
        let _canvas = document.createElement('canvas'),
            w = img.width,
            h = img.height,
            dpr = this.getDPR();
            
        _canvas.width = w * dpr;
        _canvas.height = h * dpr;
        _canvas.style.width = `${w}px`;
        _canvas.style.height = `${h}px`;
        // draw image
        const context = _canvas.getContext('2d');
        context.scale(dpr, dpr);
        // 获取 filter
        context.filter = window.getComputedStyle(currNode).filter;
        context.drawImage(img, 0, 0, _canvas.width, _canvas.height);
        this.saveImage(_canvas.toDataURL(`image/${type}`));
    })
    .catch(err=>{
        console.error('here is wrong', err);
    })
}
// 下载图片
saveImage = (strData) => {
    let save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
    save_link.href = strData;
    save_link.download =  'download.png';
    let event = new MouseEvent('click')
    save_link.dispatchEvent(event);
}

```

效果如下：

![9gGfCd.gif](https://s1.ax1x.com/2018/03/06/9gGfCd.gif)

[项目地址][3]

[1]: https://github.com/react-dropzone/react-dropzone
[2]: https://cloudinary.com/
[3]: https://github.com/cbbfcd/css3-filter





