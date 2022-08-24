package com.google.zxing.util;

import com.google.zxing.Result;

import java.util.HashMap;


public class Constant {
    public static final String INTENT_EXTRA_KEY_QR_SCAN = "qr_scan_result";

    public static int DecodeNum = 0;


    //存放扫进二维码的缓存
    public static HashMap<String, Result> history = new HashMap<>();

    // request参数
    public static final int REQ_QR_CODE = 11002; // // 打开扫描界面请求码
    public static final int REQ_PERM_CAMERA = 11003; // 打开摄像头
    public static final int REQ_PERM_EXTERNAL_STORAGE = 11004; // 读写文件


}
