package com.google.zxing.activity;

import android.app.ProgressDialog;
import android.content.Intent;
import android.content.res.AssetFileDescriptor;
import android.graphics.Bitmap;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.media.MediaPlayer.OnCompletionListener;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.os.Vibrator;
import android.view.SurfaceHolder;
import android.view.SurfaceHolder.Callback;
import android.view.SurfaceView;
import android.view.View;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.R;
import com.google.zxing.Result;
import com.google.zxing.camera.CameraManager;
import com.google.zxing.decoding.CaptureActivityHandler;
import com.google.zxing.decoding.InactivityTimer;
import com.google.zxing.util.Constant;
import com.google.zxing.view.ViewfinderView;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Vector;

/**
 * Initial the camera
 *
 * @author Ryan.Tang
 */
public class CaptureActivity extends AppCompatActivity implements Callback {
    private CaptureActivityHandler handler;
    private ViewfinderView viewfinderView;
    private Button back;//返回
    private ImageButton btnFlash;//闪光灯
    private Button refresh;//扫码刷新
    private Button tip;//提示
    private TextView progressTxt; //进度条文字
    private ProgressBar progress;//进度条本条

    private AlertDialog.Builder alertdialogbuilder;
    private AlertDialog alertDialog;

    private boolean isFlashOn = false;
    private boolean hasSurface;
    private Vector<BarcodeFormat> decodeFormats;
    private String characterSet;
    private InactivityTimer inactivityTimer;
    private MediaPlayer mediaPlayer;
    private boolean playBeep;
    private static final float BEEP_VOLUME = 0.10f;
    private boolean vibrate;


    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_scanner);
        CameraManager.init(getApplication());

        //扫码预览界面，绘制扫码区域
        viewfinderView = (ViewfinderView) findViewById(R.id.viewfinder_content);

        //回退
        back = (Button) findViewById(R.id.btn_back);
        back.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Constant.history.clear();
                finish();
            }
        });

        //闪光灯
        btnFlash = (ImageButton) findViewById(R.id.btn_flash);
        btnFlash.setOnClickListener(flashListener);

        //如果进程被中途截断，需要重新刷新后再扫另一组，从头开
        refresh = (Button) findViewById(R.id.btn_refresh);
        refresh.setOnClickListener(refreshCache);

        //获取已扫码信息，如还剩第几张没扫
        tip = (Button) findViewById(R.id.btn_tip);
        tip.setOnClickListener(tipOnclick);

        //用以展示已经扫描到的二维码数和进度
        progressTxt = (TextView) findViewById(R.id.progress_txt);
        progress = (ProgressBar) findViewById(R.id.progress);
        updateProgress();

        hasSurface = false;

        //InactiveTimer是负责：如果长时间没有操作，此APP会自动退出 ，默认时间是5分钟。
        inactivityTimer = new InactivityTimer(this);
    }


    /**
     * 刷新
     */
    private View.OnClickListener refreshCache = new View.OnClickListener() {
        @Override
        public void onClick(View view) {
            Constant.DecodeNum = 0;
            Constant.history.clear();
            mProgressStatus = 0;
        }
    };

    /**
     * 提示
     */
    private View.OnClickListener tipOnclick = new View.OnClickListener() {
        @Override
        public void onClick(View v) {
            alertdialogbuilder = new AlertDialog.Builder(CaptureActivity.this);
            alertdialogbuilder.setPositiveButton("确定", null);
            String s = new String("您还有以下二维码没扫到:\n");
            for (int i = 1; i <= Constant.DecodeNum; i++) {
                String format = String.format("%03d", i);
                if (!Constant.history.containsKey(format)) {
                    s += format + " ";
                }
            }
            alertdialogbuilder.setMessage(s);
            alertDialog = alertdialogbuilder.create();
            alertDialog.show();

        }
    };

    /**
     * 进度条实时进展
     */

    private int mProgressStatus = Constant.history.size();
    private Handler mHandler;

    private void updateProgress() {
        mHandler = new Handler() {
            @Override
            public void handleMessage(Message msg) {
                if (msg.what == 0x111) {
                    //更新进度条
                    progress.setProgress(mProgressStatus);
                    progressTxt.setText(mProgressStatus + "/" + Constant.DecodeNum);
                } else {
                    //显示更新完成，进度条不再显示。
                    Toast.makeText(getApplicationContext(), "操作已完成", Toast.LENGTH_SHORT).show();
                    progress.setVisibility(View.GONE);
                }
            }
        };

        //创建一个线程，模拟耗时操作，并发出消息
        new Thread(new Runnable() {
            @Override
            public void run() {
                while (true) {
                    mProgressStatus = doWork();
                    Message m = new Message();
                    if (mProgressStatus <= Constant.DecodeNum) {
                        m.what = 0x111;//操作未完成
                        mHandler.sendMessage(m);
                    } else {
                        m.what = 0x110;//操作已完成
                        mHandler.sendMessage(m);
                        break;
                    }
                }
            }

            private int doWork() {
                progress.setMax(Constant.DecodeNum);
                mProgressStatus = Constant.history.size();
                try {
                    Thread.sleep(500);
                } catch (InterruptedException e) {

                }
                return mProgressStatus;
            }
        }).start();
    }


    /**
     * 闪光灯开关按钮
     */
    private View.OnClickListener flashListener = new View.OnClickListener() {
        @Override
        public void onClick(View view) {
            try {
                boolean isSuccess = CameraManager.get().setFlashLight(!isFlashOn);
                if (!isSuccess) {
                    Toast.makeText(CaptureActivity.this, R.string.note_no_flashlight, Toast.LENGTH_SHORT).show();
                    return;
                }
                if (isFlashOn) {
                    // 关闭闪光灯
                    btnFlash.setImageResource(R.drawable.flash_off);
                    isFlashOn = false;
                } else {
                    // 开启闪光灯
                    btnFlash.setImageResource(R.drawable.flash_on);
                    isFlashOn = true;
                }
            } catch (Exception e) {

            }
        }
    };

    @Override
    protected void onActivityResult(final int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
    }


    @Override
    protected void onResume() {
        super.onResume();
        SurfaceView surfaceView = (SurfaceView) findViewById(R.id.scanner_view);
        SurfaceHolder surfaceHolder = surfaceView.getHolder();
        if (hasSurface) {
            initCamera(surfaceHolder);
        } else {
            surfaceHolder.addCallback(this);
            surfaceHolder.setType(SurfaceHolder.SURFACE_TYPE_PUSH_BUFFERS);
        }
        decodeFormats = null;
        //自定义
        characterSet = null;

        playBeep = true;
        AudioManager audioService = (AudioManager) getSystemService(AUDIO_SERVICE);
        if (audioService.getRingerMode() != AudioManager.RINGER_MODE_NORMAL) {
            playBeep = false;
        }
        initBeepSound();
        vibrate = true;
    }

    @Override
    protected void onPause() {
        super.onPause();
        if (handler != null) {
            handler.quitSynchronously();
            handler = null;
        }
        CameraManager.get().closeDriver();
    }

    @Override
    protected void onDestroy() {
        inactivityTimer.shutdown();
        super.onDestroy();
    }

    /**
     * Handler scan result
     *
     * @param resultList
     * @param barcode
     */
    public void handleDecode(List<Result> resultList, Bitmap barcode) {
        // inactivityTimer监控扫描活跃状态，这里要启动监控
        inactivityTimer.onActivity();
        playBeepSoundAndVibrate();
        ArrayList<String> lis = new ArrayList<>();
        int textlen;
        for (int i = 0; i < resultList.size(); i++) {
            textlen = resultList.get(i).getText().length();
            lis.add(resultList.get(i).getText().substring(7, textlen));
        }
        Intent resultIntent = new Intent();
        Bundle bundle = getIntent().getExtras();
        if (bundle == null) {
            bundle = new Bundle();
        }
        bundle.putStringArrayList(Constant.INTENT_EXTRA_KEY_QR_SCAN, lis);
        resultIntent.putExtras(bundle);
        this.setResult(RESULT_OK, resultIntent);
        CaptureActivity.this.finish();
    }

    private void initCamera(SurfaceHolder surfaceHolder) {
        try {
            CameraManager.get().openDriver(surfaceHolder);
        } catch (IOException ioe) {
            return;
        } catch (RuntimeException e) {
            return;
        }
        if (handler == null) {
            handler = new CaptureActivityHandler(this, decodeFormats,
                    characterSet);
        }
    }

    @Override
    public void surfaceChanged(SurfaceHolder holder, int format, int width,
                               int height) {

    }

    @Override
    public void surfaceCreated(SurfaceHolder holder) {
        if (!hasSurface) {
            hasSurface = true;
            initCamera(holder);
        }

    }

    @Override
    public void surfaceDestroyed(SurfaceHolder holder) {
        hasSurface = false;

    }

    public ViewfinderView getViewfinderView() {
        return viewfinderView;
    }

    public Handler getHandler() {
        return handler;
    }

    public void drawViewfinder() {
        viewfinderView.drawViewfinder();

    }

    private void initBeepSound() {
        if (playBeep && mediaPlayer == null) {
            // The volume on STREAM_SYSTEM is not adjustable, and users found it
            // too loud,
            // so we now play on the music stream.
            setVolumeControlStream(AudioManager.STREAM_MUSIC);
            mediaPlayer = new MediaPlayer();
            mediaPlayer.setAudioStreamType(AudioManager.STREAM_MUSIC);
            mediaPlayer.setOnCompletionListener(beepListener);

            AssetFileDescriptor file = getResources().openRawResourceFd(
                    R.raw.beep);
            try {
                mediaPlayer.setDataSource(file.getFileDescriptor(),
                        file.getStartOffset(), file.getLength());
                file.close();
                mediaPlayer.setVolume(BEEP_VOLUME, BEEP_VOLUME);
                mediaPlayer.prepare();
            } catch (IOException e) {
                mediaPlayer = null;
            }
        }
    }

    private static final long VIBRATE_DURATION = 200L;

    private void playBeepSoundAndVibrate() {
        if (playBeep && mediaPlayer != null) {
            mediaPlayer.start();
        }
        if (vibrate) {
            Vibrator vibrator = (Vibrator) getSystemService(VIBRATOR_SERVICE);
            vibrator.vibrate(VIBRATE_DURATION);
        }
    }

    /**
     * When the beep has finished playing, rewind to queue up another one.
     */
    private final OnCompletionListener beepListener = new OnCompletionListener() {
        @Override
        public void onCompletion(MediaPlayer mediaPlayer) {
            mediaPlayer.seekTo(0);
        }
    };


}