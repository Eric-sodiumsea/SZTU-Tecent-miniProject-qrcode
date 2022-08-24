package com.dommy.qrcodelib.util;

import android.content.Context;
import android.content.Intent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.CheckBox;
import android.widget.ImageView;
import android.widget.TextView;


import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.dommy.qrcodelib.R;
import com.dommy.qrcodelib.activity.FullActivity;
import com.dommy.qrcodelib.activity.HistoryActivity;
import com.dommy.qrcodelib.activity.MainActivity;
import com.dommy.qrcodelib.entity.HisImage;
import com.dommy.qrcodelib.entity.wRobot;
import com.dommy.qrcodelib.view.ZoomImageView;
import com.google.zxing.util.BitmapUtil;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class HistoryAdapter extends ArrayAdapter<HisImage> {
    int resource;

    //构造方法传递三个参数,分别为:上下文,列表子布局和列表所需数据
    public HistoryAdapter(Context context, int resource, List<HisImage> list) {
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
        HisImage hisImage = getItem(position);
        ViewHolder holder;
        //若是第一次加载页面则调用此方法初始化
        if (convertView == null) {
            convertView = LayoutInflater.from(getContext()).inflate(resource, parent, false);

            holder = new ViewHolder();
            holder.his_time = convertView.findViewById(R.id.his_time);
            holder.his_image = convertView.findViewById(R.id.his_image);
            holder.his_cbx = convertView.findViewById(R.id.his_selected);

            convertView.setTag(holder);
            holder.his_cbx.setTag(index);
        } else {
            holder = (ViewHolder) convertView.getTag();
        }

        //将数据传递给控件并显示
        holder.his_time.setText(String2Time(hisImage.getTime()));
        holder.his_image.setImageBitmap(BitmapUtil.base64ToBitmap(hisImage.getBase64()));
        holder.his_image.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(holder.his_image.getContext(), FullActivity.class);
                DataHelper.base64 = hisImage.getBase64();
                DataHelper.getInstance().saveData("bitmap", BitmapUtil.base64ToBitmap(hisImage.getBase64()));
                holder.his_image.getContext().startActivity(intent);
            }
        });

        //单选按钮
        holder.his_cbx.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (holder.his_cbx.isChecked()) {
                    map.put(position, true);
                    getItem(position).setCheckStatus(true);
                } else {
                    map.remove(position);
                    getItem(position).setCheckStatus(false);
                }
            }
        });

        if (map != null && map.containsKey(position)) {
            holder.his_cbx.setChecked(true);
        } else {
            holder.his_cbx.setChecked(false);
        }

        return convertView;
    }

    private Map<Integer, Boolean> map = new HashMap<>();

    public void setMap(Map<Integer, Boolean> map) {
        this.map = map;
    }

    //缓存类,用于存放已存在的对象
    class ViewHolder {
        TextView his_time;
        ImageView his_image;
        CheckBox his_cbx;
    }

    public String String2Time(String timeStamp) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        return sdf.format(new Date(Long.parseLong(String.valueOf(timeStamp))));
    }
}