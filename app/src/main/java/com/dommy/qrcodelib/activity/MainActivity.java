package com.dommy.qrcodelib.activity;

import android.Manifest;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.Color;
import android.os.Bundle;
import android.text.SpannableString;
import android.text.style.ForegroundColorSpan;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;

import com.dommy.qrcodelib.util.GzipUtils;
import com.dommy.qrcodelib.R;
import com.dommy.qrcodelib.util.DataHelper;
import com.dommy.qrcodelib.util.MyApplication;
import com.dommy.qrcodelib.util.UtilDao;
import com.google.zxing.activity.CaptureActivity;
import com.google.zxing.util.BitmapUtil;
import com.google.zxing.util.Constant;
import com.qmuiteam.qmui.alpha.QMUIAlphaTextView;
import com.qmuiteam.qmui.widget.QMUIRadiusImageView;
import com.qmuiteam.qmui.widget.roundwidget.QMUIRoundButton;

import java.io.IOException;
import java.util.ArrayList;

public class MainActivity extends AppCompatActivity implements View.OnClickListener {
    private QMUIRoundButton btnQrCode; // 扫码
    private QMUIRadiusImageView ImgResult;

    private Bitmap bp = null;
    private StringBuilder base64;
    private String decompress;

    private UtilDao dao;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        initView();
        DbUtil();
    }

    private void initView() {
        btnQrCode = (QMUIRoundButton) findViewById(R.id.btn_qrcode);
        btnQrCode.setOnClickListener(this);

        ImgResult = (QMUIRadiusImageView) findViewById(R.id.img_result);
    }

    // 开始扫码
    private void startQrCode() {
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
        // 二维码扫码
        Intent intent = new Intent(MainActivity.this, CaptureActivity.class);
        startActivityForResult(intent, Constant.REQ_QR_CODE);
    }

    @Override
    public void onClick(View view) {
        switch (view.getId()) {
            case R.id.btn_qrcode:
                //清理缓存
                Constant.history.clear();
                Constant.DecodeNum = 0;

                startQrCode();
                break;
            default:
                break;
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.main_menu, menu);
        MenuItem item = menu.findItem(R.id.history);
        SpannableString spannableString = new SpannableString(item.getTitle());
        spannableString.setSpan(new ForegroundColorSpan(Color.DKGRAY), 0, spannableString.length(), 0);
        item.setTitle(spannableString);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        if (item.getItemId() == R.id.history) {// 判断是否选择了参数设置菜单组
            Intent intent = new Intent(getApplicationContext(), HistoryActivity.class);

            startActivity(intent);
        }
        return true;
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        // TODO 扫描结果回调
        if (requestCode == Constant.REQ_QR_CODE && resultCode == RESULT_OK) {
            Bundle bundle = data.getExtras();

            //将扫描出的信息显示出来
            ArrayList<String> result = bundle.getStringArrayList(Constant.INTENT_EXTRA_KEY_QR_SCAN);

            if (result.size() > 0 && result != null) {
                // 获取压缩字符串
                base64 = new StringBuilder();

                for (int i = 0; i < result.size(); i++) {
                    base64.append(result.get(i));
                }


                try {
                    decompress = GzipUtils.unCompress(base64.toString());
                } catch (IOException e) {
                    Toast.makeText(getApplicationContext(), "解析失败", Toast.LENGTH_SHORT).show();
                    return;
                }

                bp = BitmapUtil.base64ToBitmap(decompress);
//                DataHelper.getInstance().saveData("base64", decompress);

                ImgResult.setImageBitmap(bp);


                dao.addHistoryData(String.valueOf(System.currentTimeMillis()), decompress);
            }

            ImgResult.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    DataHelper dataHelper = DataHelper.getInstance();
                    dataHelper.saveData("bitmap", bp);
                    DataHelper.base64 = decompress;
                    Intent intent = new Intent(MainActivity.this, FullActivity.class);
                    startActivity(intent);
                }
            });
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        switch (requestCode) {
            case Constant.REQ_PERM_CAMERA:
                // 摄像头权限申请
                if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                    // 获得授权
                    startQrCode();
                } else {
                    // 被禁止授权
                    Toast.makeText(MainActivity.this, "请至权限中心打开本应用的相机访问权限", Toast.LENGTH_LONG).show();
                }
                break;
            case Constant.REQ_PERM_EXTERNAL_STORAGE:
                // 文件读写权限申请
                if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                    // 获得授权
                    startQrCode();
                } else {
                    // 被禁止授权
                    Toast.makeText(MainActivity.this, "请至权限中心打开本应用的文件读写权限", Toast.LENGTH_LONG).show();
                }
                break;
            default:
                break;
        }
    }

    public void DbUtil() {
        dao = ((MyApplication) this.getApplication()).getDao();
    }
}
