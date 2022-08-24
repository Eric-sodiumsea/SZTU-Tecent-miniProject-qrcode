package com.dommy.qrcodelib.activity;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

import android.content.DialogInterface;
import android.content.Intent;

import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;


import com.dommy.qrcodelib.R;



public class RobotActivity extends AppCompatActivity {
    private EditText edit_name;
    private EditText edit_intro;
    private EditText edit_url;
    private Button but;//确认
    private Intent intent;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_robot);
        //初始化组件
        initView();

        /**
         * 点击编辑按钮传过来的值
         * 用于显示当前编辑项的数据信息
         * */
        intent = getIntent();
        String robot_name = intent.getStringExtra("robot_name");
        String robot_intro = intent.getStringExtra("robot_intro");
        String robot_url = intent.getStringExtra("robot_url");

        edit_name.setText(robot_name);
        edit_intro.setText(robot_intro);
        edit_url.setText(robot_url);

        but.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                //获取到两个输入框的值
                String name = edit_name.getText().toString();
                String intro = edit_intro.getText().toString();
                String url = edit_url.getText().toString();
                if (!name.equals("") && !intro.equals("") && !url.equals("")) {
                    /**
                     * 数据库操作需要用到的数据
                     * 详情请查看 UtilDao 类下的 addData() 方法
                     * */
                    String[] key = {"name", "intro", "url"};
                    String[] values = {name, intro, url};
                    intent = new Intent();
                    //点击添加按钮则返回 key 和 values 数组
                    intent.putExtra("key", key);
                    intent.putExtra("values", values);

                    //点击编辑按钮则返回 name ，intro 和 url 字符串
                    intent.putExtra("name", name);
                    intent.putExtra("intro", intro);
                    intent.putExtra("url", url);

                    setResult(RESULT_OK, intent);
                    finish();
                } else if (!name.equals("") && !url.equals("") && intro.equals("")) {
                    /**
                     * 数据库操作需要用到的数据
                     * 详情请查看 UtilDao 类下的 addData() 方法
                     * */
                    String[] key = {"name", "url"};
                    String[] values = {name, url};
                    intent = new Intent();
                    //点击添加按钮则返回 key 和 values 数组
                    intent.putExtra("key", key);
                    intent.putExtra("values", values);

                    //点击编辑按钮则返回 name ，intro 和 url 字符串
                    intent.putExtra("name", name);
                    intent.putExtra("intro", intro);
                    intent.putExtra("url", url);

                    setResult(RESULT_OK, intent);
                    finish();
                } else {
                    AlertDialog.Builder builder = new AlertDialog.Builder(RobotActivity.this);
                    DialogInterface.OnClickListener dialogOnClick = new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialogInterface, int i) {
                            switch (i) {
                                case DialogInterface.BUTTON_POSITIVE:
                                    break;
                                default:
                                    break;
                            }
                        }
                    };
                    builder.setTitle("错误");
                    builder.setMessage("必填项未填");
                    builder.setPositiveButton("确定", dialogOnClick);
                    builder.create().show();
//                    finish();
                }
            }
        });
    }

    /**
     * 初始化控件
     */
    private void initView() {
        edit_name = findViewById(R.id.add_edit_name);
        edit_intro = findViewById(R.id.add_edit_intro);
        edit_url = findViewById(R.id.add_edit_url);

        but = findViewById(R.id.add_sure);
    }
}