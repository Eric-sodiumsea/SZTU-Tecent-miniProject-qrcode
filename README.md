## 背景

QAPM 团队每年会交付若干个私有化项目，因私有化环境的网络环境封闭，对于部署及后期运维的一些工作较难展开，一线区技虽然会拍照部分信息，但信息时长的“缺胳膊少腿”，沟通成本大大提升。我们希望研发这款工具可将需要的信息从网络封闭的地方拿出来，减少与区技的沟通成本，拿到更有效的信息。

### Android开发基于的框架

在实现扫码与解码的过程中，参考了github上开源的zxing框架，地址为[https://github.com/zxing/zxing](url)；
在搜集关于zxing框架关于源码的解读中，发现zxing框架内实际上用到扫码与解码的核心类仅有部分，所以将其抽离出来作为该项目开发的基础

```
├─activity
│      CaptureActivity.java
│
├─camera
│      AutoFocusCallback.java
│      CameraConfigurationManager.java
│      CameraManager.java
│      FlashlightManager.java
│      PlanarYUVLuminanceSource.java
│      PreviewCallback.java
│
├─decoding
│      CaptureActivityHandler.java
│      DecodeFormatManager.java
│      DecodeHandler.java
│      DecodeThread.java
│      FinishListener.java
│      InactivityTimer.java
│      Intents.java
│      RGBLuminanceSource.java
│
├─util
│      BitmapUtil.java
│      Constant.java
│
└─view
        ViewfinderResultPointCallback.java
        ViewfinderView.java
```

## 扫码

### 权限配置

AndroidManifest.xml中添加权限申请代码：

```xml
<uses-permission android:name="android.permission.INTERNET" /> <!-- 网络权限 -->
<uses-permission android:name="android.permission.VIBRATE" /> <!-- 震动权限 -->
<uses-permission android:name="android.permission.CAMERA" /> <!-- 摄像头权限 -->
<uses-feature android:name="android.hardware.camera.autofocus" /> <!-- 自动聚焦权限 -->
```

### 申请动态权限

```java
// 申请相机权限
if (ActivityCompat.checkSelfPermission(this, Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
    // 申请权限
    if (ActivityCompat.shouldShowRequestPermissionRationale(this, Manifest.permission
            .CAMERA)) {
        Toast.makeText(this, "请至权限中心打开本应用的相机访问权限", Toast.LENGTH_SHORT).show();
    }
    ActivityCompat.requestPermissions(MainActivity.this, new String[]{Manifest.permission.CAMERA}, Constant.REQ_PERM_CAMERA);
    return;
}
// 申请文件读写权限（部分朋友遇到相册选图需要读写权限的情况，这里一并写一下）
if (ActivityCompat.checkSelfPermission(this, Manifest.permission.READ_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
    // 申请权限
    if (ActivityCompat.shouldShowRequestPermissionRationale(this, Manifest.permission
            .WRITE_EXTERNAL_STORAGE)) {
        Toast.makeText(this, "请至权限中心打开本应用的文件读写权限", Toast.LENGTH_SHORT).show();
    }
    ActivityCompat.requestPermissions(MainActivity.this, new String[]{Manifest.permission.READ_EXTERNAL_STORAGE}, Constant.REQ_PERM_EXTERNAL_STORAGE);
    return;
}
```

### 大致扫码流程图

参考链接 [https://blog.csdn.net/Dream_Glow/article/details/120892780](url)
![图片](/api/project/10760341/files/28831213/imagePreview)

在这里我们直接通过CaptureActivity中initCamera()，向CameraManager中openDriver()传入参数启动相机的同时，new一个CaptureActivityHandler对象，开启DecodeThread解码线程，后续过程如上图所示，通过CaptureActivityHandler以及DecodeThread中的new出的DecodeThreadHandler来进行解码后，二维码存储信息的回调传输以及处理

## 解码以及结果处理（核心）

### DecodeThread

在子线程中实例化了一个DecodeHandler与当前线程绑定。

```java
  public void run() {
    // 为线程创建消息循环
    Looper.prepare();
    // 创建一个DecodeHandler
    handler = new DecodeHandler(activity, hints);
    handlerInitLatch.countDown();
    // 进入消息循环
    Looper.loop();
  }
```

### DecodeHandler

通过与前端协议对接将二维码的有效信息提取出来，并根据二维码中的索引信息，存入在HashMap中，以便最后base64转为图片展示时，能够拼接成一个完整无缺且正确的base64字符串

```java
private void decode(byte[] data, int width, int height) {
        long start = System.currentTimeMillis();

        Result[] rawResults = null; //扫多组

        //
        Result[] ansResults = null;

        // 这里需要将获取的data翻转一下，因为相机默认拿的的横屏的数据
        byte[] rotatedData = new byte[data.length];
        for (int y = 0; y < height; y++) {
            for (int x = 0; x < width; x++) {
                rotatedData[x * height + height - y - 1] = data[x + y * width];
            }
        }

        // 宽高也要调整
        int tmp = width; // Here we are swapping, that's the difference to #11
        width = height;
        height = tmp;


        PlanarYUVLuminanceSource source = CameraManager.get().buildLuminanceSource(rotatedData, width, height);
        BinaryBitmap bitmap = new BinaryBitmap(new HybridBinarizer(source));
        try {
            rawResults = qrCodeMultiReader.decodeMultiple(bitmap,hints);

            // 扫描到二维码
            if(rawResults!=null && rawResults.length > 0){
                String split = rawResults[0].getText().substring(0,3);
                int DecodeNums = Integer.parseInt(split);
                Constant.DecodeNum = DecodeNums;
            }
            // 遍历识别到的二维码
            for(int i = 0; i < rawResults.length; i++){
                // 获取二维码索引
                String Num = rawResults[i].getText().substring(4, 7);

                if (! Constant.history.containsKey(Num)){
                    String text = rawResults[i].getText();
                    Constant.history.put(Num,rawResults[i]);
                }
            }
        } catch (ReaderException re) {
            // continue
        } finally {
            qrCodeMultiReader.reset();
        }

        Handler handler = activity.getHandler();

        int sum = Constant.history.size(); //+Constant.tableMap.size()
        if (Constant.history != null && sum > 0 && sum == Constant.DecodeNum) {
            long end = System.currentTimeMillis();

            //将所识别到的所有二维码根据索引按顺序存放到ansResults中
            ansResults = new Result[Constant.history.size()];
            int pos;
            for (Map.Entry<String, Result> entry: Constant.history.entrySet()) {
                pos = Integer.parseInt(entry.getKey()) - 1;
                ansResults[pos] = entry.getValue();
            }

            List<Result> results = new ArrayList<>(Arrays.asList(ansResults));
            Constant.history.clear();

            Log.d("Debug", "results.size()=" + results.size());

            Message message = Message.obtain(activity.getHandler(), R.id.decode_succeeded, results);
            Bundle bundle = new Bundle();
            bundle.putParcelable(DecodeThread.BARCODE_BITMAP, source.renderCroppedGreyscaleBitmap());

            message.setData(bundle);
            Log.d(TAG, "Sending decode succeeded message...");
            message.sendToTarget();
        } else {
            Message message = Message.obtain(activity.getHandler(), R.id.decode_failed);
            message.sendToTarget();
        }
    }
```


## App详细步骤展示

### 整体使用流程

![image](https://user-images.githubusercontent.com/76035116/186379607-00f039a2-7f14-464d-8470-f4341d338de2.png)

###  App主界面：

![image](https://user-images.githubusercontent.com/76035116/186379695-45c1e5a8-5097-44e4-8831-11455ac55888.png)

### App扫描界面：

![image](https://user-images.githubusercontent.com/76035116/186379736-c84781c8-001f-4ed5-935b-dbcfef026598.png)

取消按钮：点击返回。
进度条：提示扫描进度。
刷新：点击清空进度，从头开始扫描。
闪光灯：点击打开闪光灯。
对话框按钮：点击提示第几张没扫描到。

![image](https://user-images.githubusercontent.com/76035116/186379751-45b6fae4-21ab-4b41-a4d3-57029fc9ea55.png)

### App图片生成界面：

![image](https://user-images.githubusercontent.com/76035116/186379818-8c60843e-2fe6-41f5-b75d-3bf77bde3ee5.png)

点击图片进入大图模式，可以通过手指缩放。长按进入分享界面。

### App分享界面：

![image](https://user-images.githubusercontent.com/76035116/186379849-ad4dbd12-529e-4182-ab6e-797e33d7fd85.png)  

点击分享企微后：
选择机器人。
点击机器人可以编辑。
点击添加可以添加新的机器人。

### 选择界面：

![image](https://user-images.githubusercontent.com/76035116/186379886-92705345-30d6-4fac-a5b1-d1ecdf3c6220.png)

选择需要发送的机器人，点击发送完成分享。

### 点击添加：

链接在企业微信群中创建机器人后，复制其webHook地址，黏贴在“链接”处即可。

![image](https://user-images.githubusercontent.com/76035116/186379911-87b01bfc-c576-4f0c-bfd2-447aec135e19.png)

提示：若未填必选项，点击确定时会弹出dialog提示未选必选项，无法提交保存。

### 保存到本地：

![image](https://user-images.githubusercontent.com/76035116/186379947-9e53de20-39cf-4c4b-a3b1-2f13379869d8.png)

可重命名，输入需改名字即可。
不需重命名则直接确定即可跳转。

### 查看历史记录：

![image](https://user-images.githubusercontent.com/76035116/186379971-4504247b-8974-4903-b3d3-969ff88d310a.png)

点击菜单栏

![image](https://user-images.githubusercontent.com/76035116/186379993-395a30e3-7593-4298-a4a8-77687c8e117b.png)

查看历史扫码记录。

![image](https://user-images.githubusercontent.com/76035116/186380035-4c0db4b7-421d-4bf8-b8f2-374401261dc0.png)

可以删除记录。
