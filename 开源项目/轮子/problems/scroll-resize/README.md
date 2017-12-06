# 利用scroll监听元素大小的变化

实际项目需求是需要订阅一个 div 其宽度的变化，然后触发事件计算其当前宽度。

resize 事件不能监听元素的大小变化，有一些拓展的 resize 事件是建立长轮询去实现的，效率肯定不尽人意了。

这里提供一个解决方案，利用监听 scroll 事件，间接的监听元素的大小变化。

# 实现代码

<a href="index.html">利用轮子实现，场景1</a></br>
<a href="index2.html">利用轮子实现，场景2</a></br>


# 现成的轮子

<a href="http://marcj.github.io/css-element-queries/">marcj</a>

# 参考
<a href="https://blog.crimx.com/2017/07/15/element-onresize/">利用scroll监听元素大小的变化</a>