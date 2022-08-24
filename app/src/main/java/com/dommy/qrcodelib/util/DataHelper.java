package com.dommy.qrcodelib.util;

import java.lang.ref.WeakReference;
import java.util.HashMap;
import java.util.Map;

//用于传输图片信息
public class DataHelper {
    private static final DataHelper helper = new DataHelper();

    public static DataHelper getInstance() {
        return helper;
    }

    Map<String, WeakReference<Object>> data = new HashMap<String, WeakReference<Object>>();

    public void saveData(String id, Object object) {
        data.put(id, new WeakReference<Object>(object));
    }

    public Object getData(String id) {
        WeakReference<Object> objectWeakReference = data.get(id);
        return objectWeakReference.get();
    }

    public void clear() {
        data.clear();
    }

    public static String base64;
}
