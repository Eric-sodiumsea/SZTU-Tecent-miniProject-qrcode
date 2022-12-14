# Tecent-mini-屏幕快照及二维码分享

利用我打包的 npm 组件：screenshot-shareqrcode ，利用 html2canvas 对页面进行长截图或分块截图，并利用 qrcode.react 将图片通过二维码的形式分享出去，最终客户端扫码后即可得到所截取的图片。



## 适用场景

当网页处于 无网 / 无服务器 的情况下，可以利用该组件配合客户端将网页信息分享出去。



## 使用方法

example:

    QAPM
        - index.jsx
        - index.css
    ShotBtn
        - index.jsx
        - index.css

npm i screenshot-shareqrcode

使用教程 -- https://www.npmjs.com/package/screenshot-shareqrcode

在所需截图的组件中引入：import { ShotBtn } from 'screenshot-shareqrcode'
将希望截图的模块的 id 及其昵称放在数组对象中传入 \<ShotBtn /\> 即可



## 项目逻辑

首先，用户点击截图按钮，将利用 html2canvas 对指定 DOM 节点进行截图，然后利用 @mxsir/image-tiny 对图片进行压缩，返回 base64，再利用 gzip 对 base64 进行压缩，得到一个字符串。

接下来，对这个字符串进行分割、分别放入二维码中（二维码利用 qrcode.react 生成），在每段字符串前加入 xxx-yyy 标识，例如 100-001 表示共有 100 张二维码，当前二维码为第 1 张

最后，客户端扫码，并将得到的字符串通过 gzip 解压完，并拼接起来，即可得到图片的 base64，然后将 base64 转回图片展示给用户。



## 实现原理

1、用户点击截图按钮后，执行 html2canvas 进行截图，并通过 canvas.toDataURL() 得到其 base64

2、利用 @mxsir/image-tiny 传入 base64 对图片进行压缩，并在 tiny.js 中利用 gzip 对压缩后的图片的 base64 进行压缩，最后得到 compressStr

3、将 compressStr 放入轮播二维码中



## web 页面描述

1、在页面右上角插入一个截图按钮，用户点击后，将在页面中出现一个弹窗。

2、弹窗的左部是页面截图的预览；中部是轮播展示二维码区域，用户在客户端扫码后即可得到截图；右部是对二维码进行操作的区域。



## web 页面逻辑

1、用户点击截图按钮后，出现弹窗，等待截图、并将图片压缩完，得到最终的 compressStr 后，开启轮播展示二维码的定时器

2、点击关闭弹窗后，为下一次截图进行重置操作：关闭弹窗；清除图片预览内容；清除跳转二维码的输入框的内容；将当前二维码和二维码数量都设为 0 ；关闭轮播展示二维码的定时器；
