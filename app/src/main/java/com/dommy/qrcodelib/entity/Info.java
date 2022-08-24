package com.dommy.qrcodelib.entity;


public class Info<T> {
    private String msgtype;
    private T image;

    public String getMsgtype() {
        return msgtype;
    }

    public T getImage() {
        return image;
    }

    public void setImage(T data) {
        this.image = data;
    }

    public void setMsgtype(String msgtype) {
        this.msgtype = msgtype;
    }

    public static <T> Info<T> save(T data,String type) {
        Info<T> result = new Info<>();
        result.setImage(data);
        result.setMsgtype(type);
        return result;
    }
}
