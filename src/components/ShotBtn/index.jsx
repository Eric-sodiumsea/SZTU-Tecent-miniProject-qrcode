import React, { useEffect, useState, useRef } from 'react'
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import QRCode from 'qrcode.react';
import './index.css';
// import compress from './tiny';

export default function ShotBtn(props) {
    const [height, setHeight] = useState('30px');
    const [content, setContent] = useState('截');

    // 截图
    const [element, setElement] = useState();
    const [dataURL, setDataURL] = useState('');

    useEffect(() => {
        // console.log(qrCodeRef.current.style.display = 'none')
        setElement(document.querySelectorAll(`.${props.region}`)[0]);
    }, [])

    function shotscreen() {
        setVisible('block');
        html2canvas(element, {
            width: element.scrollWidth,
            height: element.scrollHeight,
            // windowWidth: element.scrollWidth,
            // windowHeight: element.scrollHeight,
            scrollY: 0,
            scrollX: 0,
            scale: 0.7,
            useCORS: true,
            allowTaint: true,
        }).then(canvas => {
            // 在 .then() 中，默认传入 canvas，通过 canvas.toDataURL() 即可得到该 canvas 截图的 base64
            // console.log(canvas.toDataURL())
            setDataURL(canvas.toDataURL());

            // 可以输出 canvas 截图的 base64 及其长度看看
            // console.log(dataURL);
            // console.log(dataURL.length);

            // 利用 canvas.toBlob 即可将 canvas 转为 blob
            canvas.toBlob(function (blob) {
                console.log('屏幕快照完成，可以保存图片了！');
                // 利用 FileSaver.js 中的 saveAs 方法即可将 blob 保存至本地
                saveAs(blob, "test.png");
            });

            // 最后，将滚动元素滚动回屏幕快照前记录的纵向偏移量
            // element.scrollTop = scrollTop;
            // 将滚动元素滚动回屏幕快照前记录的横向偏移量
            // element.scrollLeft = scrollLeft
        });
    }

    // 二维码
    const [textArray, setTextArray] = useState([]);
    const [num, setNum] = useState(0);
    const [cur, setCur] = useState(0);
    const [carouselBegin, setCarouselBegin] = useState(true);
    const [visible, setVisible] = useState('none')

    const carousel = useRef(null);
    const gotoRef = useRef(null);
    const popupBoxRef = useRef(null);

    useEffect(() => {
        if (dataURL !== '') {
            console.log('!!!!!!!!!!!');

            const length = 700;
            let temp_num = parseInt(dataURL.length / length)
            if (dataURL.length % length !== 0) {
                temp_num++;
            }
            setNum(temp_num);
            console.log('总共展示图片：' + temp_num + ' 张');

            let tempTextArray = [];

            for (let i = 0; i < temp_num; i++) {
                let temp_text = "";
                if (temp_num < 10) {
                    temp_text += "00" + temp_num + "-";
                }
                else if (num < 100) {
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
                if ((i + 1) * length > dataURL.length) {
                    temp_text += dataURL.slice(i * length);
                }
                else {
                    temp_text += dataURL.slice(i * length, (i + 1) * length);
                }
                // console.log(temp_text);
                tempTextArray.push(temp_text);
            }
            setTextArray(tempTextArray);
            const id = setInterval(() => {
                setCur(cur => {
                    return cur + 1 === temp_num ? 0 : cur + 1;
                });
            }, 100)
            carousel.current = id;
        }
    }, [dataURL]);

    function goto() {
        if (gotoRef.current.value !== '') {
            clearInterval(carousel.current);
            setCarouselBegin(false);
            setCur(gotoRef.current.value - 1);
        }
    }

    function carouselContinue() {
        if (carouselBegin === false) {
            setCarouselBegin(true);
            carousel.current = setInterval(() => {
                setCur(cur => {
                    return cur + 1 === num ? 0 : cur + 1;
                });
            }, 100);
        }
    }

    function carouselStop() {
        clearInterval(carousel.current);
        setCarouselBegin(false);
    }

    return (
        <>
            <button onClick={shotscreen} className="shotAllBtn" style={{ height: height }}>{content}</button>

            <div ref={popupBoxRef} class="popup-box">
                <div class="popup-box-close"></div>
                <div class="popup-box-left">
                    <div class="img-box">
                        <img id="img-preview" src={dataURL} alt="" />
                    </div>
                </div>
                <div class="popup-box-right">
                    <div class="qrcode-box">
                        < QRCode
                            id="qrCode"
                            value={textArray[cur]}
                            size={600} // 二维码的大小
                            fgColor="#000000" // 二维码的颜色
                            style={{ margin: 'auto' }}
                        />
                    </div>
                    <div class="qrcode-msg-box">
                        <div>
                            <span>{cur}</span> / <span>{num}</span>
                        </div>
                        <input ref={gotoRef} onKeyDown={(e) => { if (e.key === 'Enter') goto() }} type="text" />

                        <button onClick={goto}>点击跳转二维码</button>

                        <div onClick={carouselStop}>
                            <button class="custom-btn btn-stop">停止轮播展示二维码</button>
                        </div>

                        <div onClick={carouselContinue}>
                            <button class="custom-btn btn-continue">继续轮播展示二维码</button>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <div style={{ display: visible }}>
                    <div>{cur + 1} --- {num}</div>

                    <input ref={gotoRef} onKeyDown={(e) => { if (e.key === 'Enter') goto() }} type="text" />
                    <button onClick={goto}>点击跳转二维码</button>
                    <button onClick={carouselStop}>停止轮播展示二维码</button>
                    <button onClick={carouselContinue}>继续轮播展示二维码</button>
                </div>
            </div >
        </>
    )
}

