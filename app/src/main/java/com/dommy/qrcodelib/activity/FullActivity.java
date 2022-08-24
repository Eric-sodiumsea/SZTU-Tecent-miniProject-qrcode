package com.dommy.qrcodelib.activity;

import android.content.res.Resources;
import android.graphics.Bitmap;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.os.StrictMode;

import androidx.appcompat.app.AppCompatActivity;

import com.dommy.qrcodelib.R;
import com.dommy.qrcodelib.view.ZoomImageView;
import com.dommy.qrcodelib.util.DataHelper;

public class FullActivity extends AppCompatActivity {
    private Bitmap bitmap;
    private ZoomImageView imageView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_full);

        //背景设置为黑色
        Resources res = getResources();
        Drawable drawable = res.getDrawable(R.drawable.bkcolor);
        this.getWindow().setBackgroundDrawable(drawable);

        if (android.os.Build.VERSION.SDK_INT > 9) {
            StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder().permitAll().build();
            StrictMode.setThreadPolicy(policy);
        }

        initView();
    }

    private void initView() {
        imageView = (ZoomImageView) findViewById(R.id.img_scale);
        DataHelper dataHelper = DataHelper.getInstance();
        bitmap = (Bitmap) dataHelper.getData("bitmap");
        imageView.setImageBitmap(bitmap);
    }


}