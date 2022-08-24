package com.dommy.qrcodelib.activity;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import com.dommy.qrcodelib.R;
import com.dommy.qrcodelib.entity.HisImage;
import com.dommy.qrcodelib.entity.ImageInfo;
import com.dommy.qrcodelib.entity.Info;
import com.dommy.qrcodelib.entity.wRobot;
import com.dommy.qrcodelib.util.DataHelper;
import com.dommy.qrcodelib.util.HistoryAdapter;
import com.dommy.qrcodelib.util.MyApplication;
import com.dommy.qrcodelib.util.RobotAdapter;
import com.dommy.qrcodelib.util.UtilDao;
import com.dommy.qrcodelib.view.ZoomImageView;
import com.google.gson.Gson;
import com.google.zxing.activity.CaptureActivity;
import com.google.zxing.camera.CameraManager;

import java.io.IOException;
import java.security.MessageDigest;
import java.util.ArrayList;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;

import okhttp3.FormBody;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class HistoryActivity extends AppCompatActivity {
    private TextView textNum;
    private ListView listView;
    private Button del_button; //删除
    private List<HisImage> list, newList;
    private UtilDao dao;
    private HistoryAdapter adapter;
    private int listNum = 0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_history);
        //初始化控件
        initView();
        //实例dao
        DbUtil();
        //显示ListView
        showListView();
        //显示listView的条目数量
        linkmanNum();
    }

    /**
     * 初始化控件
     */
    private void initView() {
        textNum = (TextView) findViewById(R.id.history_num);
        listView = (ListView) findViewById(R.id.list_view_his);
        del_button = (Button) findViewById(R.id.del_btn);
        newList = new ArrayList<>();
        list = new ArrayList<>();

        del_button.setOnClickListener(delListener);
    }

    /**
     * 批量删除
     */
    private View.OnClickListener delListener = new View.OnClickListener() {
        @Override
        public void onClick(View view) {
            String Num = textNum.getText().toString();
            for (int i = 0; i < Integer.parseInt(Num.substring(1, Num.length() - 1)); i++) {
                if (adapter.getItem(i).isCheckStatus()) {
                    dao.delHistoryData("time=?", new String[]{adapter.getItem(i).getTime()});
                }
            }
            refresh();
        }
    };


    /**
     * 显示ListView
     */
    public void showListView() {
        //查询数据
        /**
         * 添加数据到链表中
         * **/
        list = dao.inquireHistoryData();

        /**
         * 创建并绑定适配器
         * */
        adapter = new HistoryAdapter(this, R.layout.item_his, list);
        listView.setAdapter(adapter);

    }


    /**
     * 普通对话框
     */
    public void dialogDel() {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        DialogInterface.OnClickListener dialogOnClick = new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialogInterface, int i) {
                HisImage hisImage = list.get(listNum);
                switch (i) {
                    case DialogInterface.BUTTON_POSITIVE:
                        dao.delHistoryData("time=?", new String[]{hisImage.getTime()});
                        refresh();
                        break;
                    case DialogInterface.BUTTON_NEGATIVE:
                        break;
                    default:
                        break;
                }
            }
        };
        builder.setTitle("删除该记录");
        builder.setMessage("确定要删除吗？");
        builder.setPositiveButton("确定", dialogOnClick);
        builder.setNegativeButton("取消", dialogOnClick);
        builder.create().show();
    }


    //刷新
    public void refresh() {
        //最后查询数据刷新列表
        getNotifyData();
    }

    //页面顶部显示ListView条目数
    public void linkmanNum() {
        textNum.setText("(" + list.size() + ")");
    }


    public void DbUtil() {
        dao = ((MyApplication) this.getApplication()).getDao();
    }

    /**
     * 当页面回到此活动时，调用此方法，刷新ListView
     */
    @Override
    protected void onResume() {
        super.onResume();
        getNotifyData();
    }

    /**
     * 这个是用来动态刷新 *
     */
    public void getNotifyData() {
        //使用新的容器获得最新查询出来的数据
        newList = dao.inquireHistoryData();
        //清除原容器里的所有数据
        list.clear();
        //将新容器里的数据添加到原来容器里
        list.addAll(newList);
        //更新页面顶部括号里显示数据
        linkmanNum();
        //刷新checkbox状态
        adapter.setMap(new HashMap<>());
        //刷新适配器
        adapter.notifyDataSetChanged();
    }
}