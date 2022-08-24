package com.dommy.qrcodelib.util;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;


import com.dommy.qrcodelib.entity.HisImage;
import com.dommy.qrcodelib.entity.wRobot;

import java.util.ArrayList;
import java.util.List;

public class UtilDao {
    private DatabaseUtil du;
    private SQLiteDatabase db;

    public UtilDao(Context context) {
        du = new DatabaseUtil(context);
        db = du.getWritableDatabase();
    }

    /**
     * 添加机器人数据
     */
    public void addData(String tableName, String[] key, String[] values) {
        ContentValues contentValues = new ContentValues();
        for (int i = 0; i < key.length; i++) {
            contentValues.put(key[i], values[i]);
        }
        db.insert(tableName, null, contentValues);
        contentValues.clear();
    }

    /**
     * 删除机器人数据
     */
    public int delRobotData(String where, String[] values) {
        int del_data;
        del_data = db.delete("wRobot_Url", where, values);
        return del_data;
    }

    /**
     * 修改机器人数据
     */
    public void updateRobotData(String[] values) {
        db.execSQL("update wRobot_Url set name=?,intro=?,url=? where name=? ", values);
    }

    /**
     * 查询机器人数据
     */
    public List<wRobot> inquireRobotData() {
        List<wRobot> list = new ArrayList<>();
        Cursor cursor = db.rawQuery("select name,intro,url" +
                " from wRobot_Url", null);
        while (cursor.moveToNext()) {
            String name = cursor.getString(0);
            String intro = cursor.getString(1);
            String url = cursor.getString(2);

            wRobot robot = new wRobot();
            robot.setName(name);
            robot.setIntro(intro);
            robot.setUrl(url);

            list.add(robot);
        }

        return list;
    }

    /**
     * 查询历史数据
     */
    public List<HisImage> inquireHistoryData() {
        List<HisImage> list = new ArrayList<>();
        Cursor cursor = db.rawQuery("select time,base64" +
                " from image_history order by time desc", null);
        while (cursor.moveToNext()) {
            String time = cursor.getString(0);
            String base64 = cursor.getString(1);

            HisImage hisImage = new HisImage();
            hisImage.setTime(time);
            hisImage.setBase64(base64);

            list.add(hisImage);
        }

        return list;
    }

    /**
     * 添加历史数据
     */
    public void addHistoryData(String time, String base64) {
        ContentValues contentValues = new ContentValues();
        contentValues.put("time", time);
        contentValues.put("base64", base64);
        db.insert("image_history", null, contentValues);
        contentValues.clear();
    }

    /**
     * 删除历史数据
     */
    public int delHistoryData(String where, String[] values) {
        int del_data;
        del_data = db.delete("image_history", where, values);
        return del_data;
    }

    /**
     * 关闭数据库连接
     */
    public void getClose() {
        if (db != null) {
            db.close();
        }
    }
}