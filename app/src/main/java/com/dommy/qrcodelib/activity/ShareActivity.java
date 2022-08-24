package com.dommy.qrcodelib.activity;

import android.content.DialogInterface;
import android.content.Intent;

import android.os.Bundle;
import android.view.View;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;


import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

import com.dommy.qrcodelib.R;
import com.dommy.qrcodelib.entity.ImageInfo;
import com.dommy.qrcodelib.entity.Info;
import com.dommy.qrcodelib.entity.wRobot;
import com.dommy.qrcodelib.util.DataHelper;
import com.dommy.qrcodelib.util.RobotAdapter;
import com.dommy.qrcodelib.util.MyApplication;
import com.dommy.qrcodelib.util.UtilDao;
import com.google.gson.Gson;

import java.io.IOException;
import java.security.MessageDigest;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

import okhttp3.FormBody;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class ShareActivity extends AppCompatActivity implements View.OnClickListener {

    private TextView textNum;
    private Button add_button; //添加
    private Button send_button; //发送
    private ListView listView;
    private List<wRobot> list, newList;
    private ArrayList<String> url_list; //请求列表
    private UtilDao dao;
    private RobotAdapter adapter;
    private int listNum = 0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_share);
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
        add_button = (Button) findViewById(R.id.add_btn);
        listView = (ListView) findViewById(R.id.list_view_robot);
        textNum = (TextView) findViewById(R.id.main_num);
        send_button = (Button) findViewById(R.id.send_btn);
        newList = new ArrayList<>();
        list = new ArrayList<>();
    }

    /**
     * 显示ListView
     */
    public void showListView() {
        //查询数据
        /**
         * 添加数据到链表中
         * **/
        list = dao.inquireRobotData();

        /**
         * 创建并绑定适配器
         * */
        adapter = new RobotAdapter(this, R.layout.item_robot, list);
        listView.setAdapter(adapter);

        /**
         * ListView事件监听
         * */
        listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> adapterView, View view, int i, long l) {
                dialogList();
                listNum = i;
            }
        });

        add_button.setOnClickListener(this);
        send_button.setOnClickListener(this);
    }

    /**
     * 普通对话框
     */
    public void dialogNormal() {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        DialogInterface.OnClickListener dialogOnClick = new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialogInterface, int i) {
                wRobot robotDel = list.get(listNum);
                switch (i) {
                    case DialogInterface.BUTTON_POSITIVE:
                        dao.delRobotData("name=?", new String[]{robotDel.getName()});
                        refresh();
                        break;
                    case DialogInterface.BUTTON_NEGATIVE:
                        break;
                    default:
                        break;
                }
            }
        };
        builder.setTitle("删除该机器人");
        builder.setMessage("确定要删除吗？");
        builder.setPositiveButton("确定", dialogOnClick);
        builder.setNegativeButton("取消", dialogOnClick);
        builder.create().show();
    }

    /**
     * 选项列表
     */
    public void dialogList() {
        final String[] items = {"编辑", "删除"};
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setItems(items, new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialogInterface, int i) {
                dialogInterface.dismiss();
                //拿到当前选中项的 User 对象
                wRobot robotNum = list.get(listNum);
                Intent intent;
                switch (i) {
                    case 0:
                        intent = new Intent(ShareActivity.this, RobotActivity.class);
                        //传入当前选中项的姓名和电话以在编辑页面中显示在输入框中
                        intent.putExtra("robot_name", robotNum.getName());
                        intent.putExtra("robot_intro", robotNum.getIntro());
                        intent.putExtra("robot_url", robotNum.getUrl());
                        startActivityForResult(intent, 2);
                        break;
                    //弹出对话框提示是否删除
                    case 1:
                        dialogNormal();
                        break;
                    default:
                        break;
                }
            }
        });
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

    //点击添加按钮
    @Override
    public void onClick(View view) {
        switch (view.getId()) {
            case R.id.add_btn:
                //跳转到 Robot Activity 传入请求码 1
                Intent intent = new Intent(ShareActivity.this, RobotActivity.class);
                startActivityForResult(intent, 1);
                break;
            case R.id.send_btn:
//                new Thread(new Runnable() {
//                    @Override
//                    public void run() {
//                        postHttp();
//                    }
//                }).start();
                postHttp();
                finish();
                break;
            default:
                break;
        }
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
        newList = dao.inquireRobotData();
        //清除原容器里的所有数据
        list.clear();
        //将新容器里的数据添加到原来容器里
        list.addAll(newList);
        //更新页面顶部括号里显示数据
        linkmanNum();
        //刷新适配器
        adapter.notifyDataSetChanged();
    }

    /**
     * 上一个页面传回来的值
     */
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        switch (requestCode) {
            //请求码为1，表示点击了添加按钮
            case 1:
                //执行添加方法
                if (resultCode == RESULT_OK) {
                    String[] key = data.getStringArrayExtra("key");
                    String[] values = data.getStringArrayExtra("values");
                    dao.addData("wRobot_Url", key, values);
                }
                break;
            //请求码为2，表示点击了编辑按钮
            case 2:
                //执行修改方法
                if (resultCode == RESULT_OK) {
                    wRobot robot = list.get(listNum);
                    String name = data.getStringExtra("name");
                    String intro = data.getStringExtra("intro");
                    String url = data.getStringExtra("url");
                    String[] values = {name, intro, url, robot.getName()};
                    dao.updateRobotData(values);
                }
                break;
            default:
                break;
        }
    }

    /**
     * 分享机器人
     */
    private void postHttp() {
        ImageInfo imageInfo = new ImageInfo();
//        Log.d("test=========",(String) DataHelper.getInstance().getData("base64"));
//        String base64 = (String) DataHelper.getInstance().getData("base64");
        String base64 = DataHelper.base64;
        imageInfo.setBase64(base64);
        imageInfo.setMd5(base642getMD5(base64));

        Info<ImageInfo> info = Info.save(imageInfo, "image");
        Gson gson = new Gson();
        String json = gson.toJson(info);

        OkHttpClient okHttpClient = new OkHttpClient();
        RequestBody requestBody = FormBody.create(MediaType.parse("application/json; charset=utf-8")
                , json);

        // 2 创建请求方式
        url_list = new ArrayList<>();
        String Num = textNum.getText().toString();
        for (int i = 0; i < Integer.parseInt(Num.substring(1, Num.length() - 1)); i++) {
            if (adapter.getItem(i).isCheckStatus()) {
                url_list.add(adapter.getItem(i).getUrl());
            }
        }

        for (int i = 0; i < url_list.size(); i++) {
            Request request = new Request.Builder()
                    .url(url_list.get(i))
                    .post(requestBody)
                    .build();
            Response response = null;
            // 3 执行请求操作
            try {
                response = okHttpClient.newCall(request).execute();
                //判断请求是否成功
                if (response.isSuccessful()) {
                    Toast.makeText(getApplicationContext(), "发送请求成功", Toast.LENGTH_SHORT).show();
                } else {
                    Toast.makeText(getApplicationContext(), "发送超时", Toast.LENGTH_SHORT).show();
                }
            } catch (IOException e) {
                Toast.makeText(getApplicationContext(), "请检查网络", Toast.LENGTH_SHORT).show();
            }
        }

    }

    private static String base642getMD5(String base64) {
        byte[] bytes;
        try {
            MessageDigest MD5 = MessageDigest.getInstance("MD5");
            bytes = Base64.getDecoder().decode(base64);
            byte[] digest = MD5.digest(bytes);
            StringBuilder sb = new StringBuilder();
            for (byte b : digest) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (Exception e) {

        }
        return null;
    }
}