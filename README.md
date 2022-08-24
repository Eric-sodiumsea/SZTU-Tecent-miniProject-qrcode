# screenshot-shareqrcode

这是一个 React 组件，它能对页面进行长截图或分块截图，并将图片通过二维码的形式分享出去，客户端扫码后即可得到所截取的图片。



github：https://github.com/Eric-sodiumsea/SZTU-Tecent-miniProject-qrcode/tree/screenshot-shareqrcode

qq邮箱：2719495583@qq.com



## 适用场景

当网页处于 无网 / 无服务器 的情况下，可以利用该组件配合客户端将网页信息分享出去。



## 使用方法

```jsx
import {ShotBtn} from 'screenshot-shareqrcode';

export default function xxx() {
	const shotOptions = [
        {
            id: 'xxx',
            title: 'aaa'
        },
        {
            id: 'yyy',
            title: 'bbb',
        },
        {
            id: 'zzz',
            title: 'ccc',
        }
    ];
    const ratio = 0.8;
    const title = "截";
    
    return (
    	<>
    		<ShotBtn shotOptions={shotOptions} ratio={ratio} title={title} />
    		...
    	</>
    )
}
```



## 传入参数

|    prop     |   type   | default value |                           comment                            |
| :---------: | :------: | :-----------: | :----------------------------------------------------------: |
| shotOptions | [object] |   undefined   | 传入希望截图的 DOM 节点的 id，和显示在页面截图按钮处的 title |
|    ratio    |  number  |      0.8      |                          图片清晰度                          |
|    title    |  string  |     "截"      |                     页面截图按钮的 title                     |



## 功能

将按钮固定在页面的右上角，点击后可对 document.body 进行长截图，悬浮时将出现传入的 shotOptions 内各个 id 对应的 title，点击 title 即可对其对应的 id 模块进行截图。

截图后，将在页面出现一个弹窗，左部为图片预览的区域、中部为轮播展示二维码的区域、右部为对二维码进行操作的区域。

其中操作二维码的功能有：跳转至指定二维码、停止轮播二维码和继续轮播二维码



## 所需配置

```js
// 在 webpack.config.js 中新增代码：
......
externals: {
	fs: require('fs'),
},
resolve: {
	fallback: {
		"path": require.resolve("path-browserify")
	},
	......
}
......

// 1、首先在命令行将 config 暴露出来
npm run eject

// 2、打开 config 中的 webpack.config.js

// 3、在 resolve 对象中添加 fallback 对象属性
resolve.fallback: { "path": require.resolve("path-browserify") }

// 4、安装 path-browserify
npm i path-browserify

// 5、在刚刚操作的 resolve 对象前加入 externals 对象
externals: {
	fs: require('fs'),
}

// 6、将 npm 包中的 pngtiny-custom.wasm 复制到静态文件夹（public）中
 |-- node_modules
    |-- screenshot-shareqrcode
        |-- lib
            |-- pngtiny-custom.wasm

 |-- public
    |-- pngtiny-custom.wasm
```



## 如何得到截图

使用相应的客户端对二维码进行扫码，即可得到截取的图片。

扫码内容为：xxx-yyy......

xxx-yyy 为扫码内容的前缀，例如：100-001 代表一共有 100 张二维码，此张二维码为第 1 张，后面的 ...... 为 gzip 压缩后的字符串，客户端只需按照前缀给的序号，将这些扫出来的字符串合并起来，再通过 gzip 解压，即可得到完整的 base64，再将其以图片的形式展现出来即可。