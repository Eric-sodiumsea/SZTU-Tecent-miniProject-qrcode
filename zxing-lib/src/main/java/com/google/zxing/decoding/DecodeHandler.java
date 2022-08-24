/*
 * Copyright (C) 2010 ZXing authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.google.zxing.decoding;

import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.os.Message;
import android.util.Log;

import com.google.zxing.BinaryBitmap;
import com.google.zxing.DecodeHintType;
import com.google.zxing.MultiFormatReader;
import com.google.zxing.R;
import com.google.zxing.ReaderException;
import com.google.zxing.Result;
import com.google.zxing.activity.CaptureActivity;
import com.google.zxing.camera.CameraManager;
import com.google.zxing.camera.PlanarYUVLuminanceSource;
import com.google.zxing.common.HybridBinarizer;
import com.google.zxing.multi.qrcode.QRCodeMultiReader;
import com.google.zxing.util.Constant;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Hashtable;
import java.util.List;
import java.util.Map;


final class DecodeHandler extends Handler {

    private static final String TAG = DecodeHandler.class.getSimpleName();

    private final CaptureActivity activity;
    private final MultiFormatReader multiFormatReader;

    //自定义多个二维码
    private QRCodeMultiReader qrCodeMultiReader;
    Map<DecodeHintType, Object> hints = new HashMap<>();

    DecodeHandler(CaptureActivity activity, Hashtable<DecodeHintType, Object> hints) {
        multiFormatReader = new MultiFormatReader();
        multiFormatReader.setHints(hints);
        this.activity = activity;

        //自定义多个二维码
        qrCodeMultiReader = new QRCodeMultiReader();
//        this.hints = hints;
    }


    @Override
    public void handleMessage(Message message) {
        int i = message.what;
        if (i == R.id.decode) {
            //Log.d(TAG, "Got decode message");
            decode((byte[]) message.obj, message.arg1, message.arg2);
        } else if (i == R.id.quit) {
            Looper.myLooper().quit();
        }
    }

    /**
     * Decode the data within the viewfinder rectangle, and time how long it took. For efficiency,
     * reuse the same reader objects from one decode to the next.
     *
     * @param data   The YUV preview frame.
     * @param width  The width of the preview frame.
     * @param height The height of the preview frame.
     */

    private void decode(byte[] data, int width, int height) {
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
        String match = "\\d\\d\\d-\\d\\d\\d";
        try {
            rawResults = qrCodeMultiReader.decodeMultiple(bitmap, hints);
            // 扫描到二维码
            if (rawResults != null && rawResults.length > 0) {
                String flag = rawResults[0].getText().substring(0, 7);
                if (flag.matches(match)) {
                    String split = rawResults[0].getText().substring(0, 3);
                    int DecodeNums = Integer.parseInt(split);
                    if(Constant.DecodeNum == 0){
                        Constant.DecodeNum = DecodeNums;
                    }
                    else{
                        // 遍历识别到的二维码
                        for (int i = 0; i < rawResults.length; i++) {
                            // 获取二维码索引
                            String Num = rawResults[i].getText().substring(4, 7);

                            if (!Constant.history.containsKey(Num)) {
                                Constant.history.put(Num, rawResults[i]);
                            }
                        }
                    }
                }
            }
        } catch (ReaderException re) {
            // continue
        } finally {
            qrCodeMultiReader.reset();
        }

        int sum = Constant.history.size(); //+Constant.tableMap.size()
        if (Constant.history != null && sum > 0 && sum == Constant.DecodeNum) {
            //将所识别到的所有二维码根据索引按顺序存放到ansResults中
            ansResults = new Result[Constant.history.size()];
            int pos;
            for (Map.Entry<String, Result> entry : Constant.history.entrySet()) {
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
}
