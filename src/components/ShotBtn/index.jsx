/**
 * @author Eric_sodiumsea
 * @date 2022-08-18
 */

import React, { useState, useRef } from 'react'
import html2canvas from 'html2canvas';
import QRCode from 'qrcode.react';
import tiny from "@mxsir/image-tiny";
import { gzip } from 'pako';
import './index.css';

// base64 -> File
/**
 * @author Levin
 * @param {Base64编码字符串} dataurl 
 * @param {文件对象命名} filename 
 * @returns 文件对象
 */
function dataURLtoFile(dataurl, filename) {
    // 获取到base64编码
    const arr = dataurl.split(',')
    // 将base64编码转为字符串
    // console.log(arr[1]);
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n) // 创建初始化为0的，包含length个元素的无符号整型数组
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], filename, {
        type: 'image/png',
    })
}

/**
 * 
 * @param {Base64编码字符串} base64 
 * @returns 
 */
async function tinyCompress(base64) {
    // 将base64转换为文件对象
    let old_file = dataURLtoFile(base64, "test_000" + ".png");
    // console.log(old_file);
    // tiny插件压缩 
    return await tiny(old_file, 1);
}

/**
 * @author Levin
 * @param {待压缩的字符串} str 
 * @returns 压缩后的字符串
 */
function gzipStr(str) {
    return bin2Str(gzip(str));
}

/**
 * @author Levin
 * @param {字节数组} array 
 * @returns 字符串
 */
function bin2Str(array) {
    return String.fromCharCode.apply(String, array);
}

async function compress(base64) {
    let compress_pic_base64 = await compressPic(base64);
    compress_pic_base64 = compress_pic_base64.split(',')[1];
    // console.log('compress_pic_base64: ', compress_pic_base64);
    // console.log('compress_pic_base64.length: ', compress_pic_base64.length);
    let res = gzipStr(compress_pic_base64);
    return res;
}

async function compressPic(base64) {
    let file = await tinyCompress(base64);
    let reader = new FileReader();
    reader.readAsDataURL(file);
    return new Promise(rs => {
        reader.onload = () => {
            // console.log('=======文件读取成功=======');
            rs(reader.result);
        }
    })
}



export default function ShotBtn(props) {
    const [showShotOptions, setShowShotOptions] = useState('none');
    const [showQrcode, setShowQrcode] = useState('none');
    const [imgBase64, setImgBase64] = useState('');
    const [textArray, setTextArray] = useState([]);
    const [num, setNum] = useState(0);
    const [cur, setCur] = useState(0);
    const [carouselBegin, setCarouselBegin] = useState(true);

    const { shotOptions, ratio, title } = props;

    const carouselRef = useRef(null);
    const gotoRef = useRef(null);
    const popupBoxRef = useRef(null);
    const shotOptionsRef = useRef(null);

    async function getCompress(base64) {
        return await compress(base64);
    }

    /**
     * 截图、压缩、分割base64
     * @param {截图模块的Id} shotOptionId 
     */
    function shotscreen(shotOptionId) {
        let element;
        if (shotOptionId === undefined) {
            element = document.body;
        }
        else {
            element = document.getElementById(`${shotOptionId}`);
        }

        /**
         * 截图
         * @param {截图模块的DOM元素} element 
         */
        html2canvas(element, {
            width: element.scrollWidth,
            height: element.scrollHeight,
            windowHeight: element.scrollHeight,
            scale: ratio ? ratio : 0.8,
            useCORS: true,
            allowTaint: true,
        }).then(canvas => {
            // 跳出弹窗
            popupBoxRef.current.style.display = 'block';

            /**
             * 执行异步函数
             */
            (async () => {
                // 将截图图片的 base64 保存下来，用于预览图片
                setImgBase64(canvas.toDataURL())
                // console.log('canvas.toDataURL().length:', canvas.toDataURL().length);
                /**
                 * getCompress
                 * @param {base64} canvas.toDataURL()
                 * @return {压缩图片并通过gzip压缩后的字符串} compressStr
                 */
                let compressStr = await getCompress(canvas.toDataURL());
                // console.log('compressStr: ', compressStr.length)

                // 分割字符串，存入数组中，后续逐个放到二维码中
                const length = 700;
                let temp_num = parseInt(compressStr.length / length)
                if (compressStr.length % length !== 0) {
                    temp_num++;
                }
                setNum(temp_num);
                // console.log('总共展示图片：' + temp_num + ' 张');

                let tempTextArray = [];

                for (let i = 0; i < temp_num; i++) {
                    let temp_text = "";
                    if (temp_num < 10) {
                        temp_text += "00" + temp_num + "-";
                    }
                    else if (temp_num < 100) {
                        temp_text += "0" + temp_num + "-";
                    }
                    else {
                        temp_text += temp_num + "-";
                    }
                    if (i + 1 < 10) {
                        temp_text += "00" + (i + 1);
                    }
                    else if (i + 1 < 100) {
                        temp_text += "0" + (i + 1);
                    }
                    else {
                        temp_text += (i + 1);
                    }
                    if ((i + 1) * length > compressStr.length) {
                        temp_text += compressStr.slice(i * length);
                    }
                    else {
                        temp_text += compressStr.slice(i * length, (i + 1) * length);
                    }
                    tempTextArray.push(temp_text);
                }
                setTextArray(tempTextArray);

                // 显示展示二维码区域
                setShowQrcode('block')

                // 开始轮播展示二维码
                const id = setInterval(() => {
                    setCur(cur => {
                        return cur + 1 === temp_num ? 0 : cur + 1;
                    });
                }, 100)
                carouselRef.current = id;
            })();
        });
    }

    // 关闭弹窗
    function closePopupBox() {
        popupBoxRef.current.style.display = 'none';
        setShowQrcode('none');
        setImgBase64('');
        setCur(0);
        setNum(0);
        carouselStop();
    }

    // 跳转二维码
    function goto() {
        if (gotoRef.current.value !== '') {
            clearInterval(carouselRef.current);
            setCarouselBegin(false);
            if (gotoRef.current.value <= 0 || gotoRef.current.value > num) {
                alert('不存在这张二维码，请重新选择');
            }
            else {
                setCur(gotoRef.current.value - 1);
            }
        }
    }

    // 继续轮播二维码
    function carouselContinue() {
        if (carouselBegin === false) {
            setCarouselBegin(true);
            carouselRef.current = setInterval(() => {
                setCur(cur => {
                    return cur + 1 === num ? 0 : cur + 1;
                });
            }, 100);
        }
    }

    // 停止轮播二维码
    function carouselStop() {
        clearInterval(carouselRef.current);
        setCarouselBegin(false);
    }

    return (
        <>
            {/* 网页固钉 -- 截图选项 */}
            <div
                className="shot-box"
                onClick={() => { shotscreen() }}
                onMouseOver={() => { setShowShotOptions('block') }}
                onMouseLeave={() => { setShowShotOptions('none') }}
            >{title ? title : '截'}</div>
            {
                shotOptions === undefined ? <></> :
                    <div
                        className="shot-options-box"
                        onMouseOver={() => { setShowShotOptions('block') }}
                        onMouseLeave={() => { setShowShotOptions('none') }}
                        ref={shotOptionsRef}
                        style={{ display: showShotOptions }}
                    >
                        <ul className="shot-option-box">
                            {
                                shotOptions.map((shotOption) => {
                                    return <li key={shotOption.id} onClick={() => { shotscreen(shotOption.id) }} className="shot-option">{shotOption.title}</li>
                                })
                            }
                        </ul>
                    </div>
            }

            {/* 展示二维码的弹窗 */}
            <div ref={popupBoxRef} id="popup-box">
                <div onClick={closePopupBox} className="popup-box-close"></div>

                {/* 图片预览区域 */}
                <div className="popup-box-left">
                    <div className="img-box">
                        <img id="img-preview" src={imgBase64} alt="" />
                    </div>
                </div>

                {/* 有关二维码的区域 */}
                <div className="popup-box-right">

                    {/* 二维码展示区域 */}
                    <div id="qrcode-box">
                        < QRCode
                            id="qrCode"
                            value={textArray[cur]}
                            size={600} // 二维码的大小
                            fgColor="#000000" // 二维码的颜色
                            style={{ margin: 'auto', display: showQrcode }}
                        />
                    </div>

                    {/* 二维码信息区域 */}
                    <div className="qrcode-msg-box">
                        <div className="qrcode-progress">
                            {
                                num === 0 ? "请稍候..." : `${cur + 1} / ${num}`
                            }
                        </div>
                        <input ref={gotoRef} onKeyDown={(e) => { if (e.key === 'Enter') goto() }} className="goto-input" placeholder="输入跳转至第几张二维码" type="text" />
                        <button onClick={goto} className="goto-btn"><span>点击跳转二维码</span></button>
                        <button onClick={carouselStop} className="carousel-btn">停止轮播展示二维码</button>
                        <button onClick={carouselContinue} className="carousel-btn">继续轮播展示二维码</button>
                    </div>
                </div>
            </div>
        </>
    )
}
