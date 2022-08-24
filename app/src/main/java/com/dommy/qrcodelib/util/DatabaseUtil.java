package com.dommy.qrcodelib.util;

import android.content.Context;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

public class DatabaseUtil extends SQLiteOpenHelper {

    private static final String DATABASE_NAME = "my.db";  //数据库名
    private static final int DATABASE_VERSION = 1;  //数据库版本号

    public DatabaseUtil(Context context) {
        super(context, DATABASE_NAME, null, DATABASE_VERSION);
    }

    /**
     * 创建数据库
     */
    @Override
    public void onCreate(SQLiteDatabase sqLiteDatabase) {
        createTable(sqLiteDatabase);
    }

    /**
     * 建立数据表
     */
    private void createTable(SQLiteDatabase db) {
        db.execSQL("create table wRobot_Url(" +
                "id integer primary key autoincrement," +
                "name text," +
                "intro text," +
                "url text)");
        db.execSQL("create table image_history(" +
                "id integer primary key autoincrement," +
                "time text," +
                "base64 text)");
    }

    /**
     * 升级数据库
     */
    @Override
    public void onUpgrade(SQLiteDatabase sqLiteDatabase, int i, int i1) {

    }
}