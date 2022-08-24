package com.dommy.qrcodelib.util;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.CheckBox;
import android.widget.TextView;


import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.dommy.qrcodelib.R;
import com.dommy.qrcodelib.entity.wRobot;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class RobotAdapter extends ArrayAdapter<wRobot> {
    int resource;

    //构造方法传递三个参数,分别为:上下文,列表子布局和列表所需数据
    public RobotAdapter(Context context, int resource, List<wRobot> list) {
        //继承父类构造
        super(context, resource, list);
        //后面会用到
        this.resource = resource;
    }

    //加载适配器时会调用此方法
    @NonNull
    @Override
    public View getView(int position, @Nullable View convertView, @NonNull ViewGroup parent) {
        //获得当前显示项的wRobot对象
        final int index = position;
        wRobot robot = getItem(position);
        ViewHolder holder;
        //若是第一次加载页面则调用此方法初始化
        if (convertView == null) {
            convertView = LayoutInflater.from(getContext()).inflate(resource, parent, false);

            holder = new ViewHolder();
            holder.robot_name = convertView.findViewById(R.id.robot_name);
            holder.robot_url = convertView.findViewById(R.id.robot_url);
            holder.robot_cbx = convertView.findViewById(R.id.robot_selected);
            convertView.setTag(holder);
            holder.robot_cbx.setTag(index);
        } else {
            holder = (ViewHolder) convertView.getTag();
        }

        //将数据传递给控件并显示
        holder.robot_name.setText(robot.getName());
        holder.robot_url.setText(robot.getIntro());

        //单选按钮
        holder.robot_cbx.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (holder.robot_cbx.isChecked()) {
                    map.put(position, true);
                    getItem(position).setCheckStatus(true);
                } else {
                    map.remove(position);
                    getItem(position).setCheckStatus(false);
                }
            }
        });
        if (map != null && map.containsKey(position)) {
            holder.robot_cbx.setChecked(true);
        } else {
            holder.robot_cbx.setChecked(false);
        }


        return convertView;
    }


    private Map<Integer, Boolean> map = new HashMap<>();

    //缓存类,用于存放已存在的对象
    class ViewHolder {
        TextView robot_name;
        TextView robot_url;
        CheckBox robot_cbx;
    }
}