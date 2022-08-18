import React, { useState, useRef } from 'react'
import html2canvas from 'html2canvas';
// import { saveAs } from 'file-saver';
import QRCode from 'qrcode.react';
import compress from './tiny';
import './index.css';

export default function ShotBtn(props) {
    const [showShotOptions, setShowOptions] = useState('none')
    const [imgBase64, setImgBase64] = useState('');
    const [textArray, setTextArray] = useState([]);
    const [num, setNum] = useState(0);
    const [cur, setCur] = useState(0);
    const [carouselBegin, setCarouselBegin] = useState(true);

    const { shotOptions } = props;

    const carousel = useRef(null);
    const gotoRef = useRef(null);
    const popupBoxRef = useRef(null);
    const shotOptionsRef = useRef(null);

    async function getCompress(base64) {
        return await compress(base64);
    }

    // 截图
    function shotscreen(shotOptionId) {
        console.log(shotOptionId)
        console.log(document)
        const element = document.getElementById(`${shotOptionId}`);
        popupBoxRef.current.style.display = 'block';
        html2canvas(element, {
            width: element.scrollWidth,
            height: element.scrollHeight,
            // windowWidth: element.scrollWidth,
            windowHeight: element.scrollHeight,
            // scrollY: 0,
            // scrollX: 0,
            scale: 0.7,
            useCORS: true,
            allowTaint: true,
        }).then(canvas => {
            (async () => {
                setImgBase64(canvas.toDataURL())
                let compressStr = await getCompress(canvas.toDataURL());
                console.log("----\n", compressStr.length);

                const length = 700;
                let temp_num = parseInt(compressStr.length / length)
                if (compressStr.length % length !== 0) {
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
                    if ((i + 1) * length > compressStr.length) {
                        temp_text += compressStr.slice(i * length);
                    }
                    else {
                        temp_text += compressStr.slice(i * length, (i + 1) * length);
                    }
                    // console.log(temp_text);
                    tempTextArray.push(temp_text);
                }
                setTextArray(tempTextArray);
                document.getElementsByClassName('qrcode-box')[0].style.display = 'block'
                const id = setInterval(() => {
                    setCur(cur => {
                        return cur + 1 === temp_num ? 0 : cur + 1;
                    });
                }, 100)
                carousel.current = id;
            })();
        });
    }

    // 操作二维码的功能
    function closePopupBox() {
        popupBoxRef.current.style.display = 'none';
        setImgBase64('');
        setCur(0);
        setNum(0);
        carouselStop();
    }

    function goto() {
        if (gotoRef.current.value !== '') {
            clearInterval(carousel.current);
            setCarouselBegin(false);
            if (gotoRef.current.value <= 0 || gotoRef.current.value > num) {
                alert('不存在这张二维码，请重新选择');
            }
            else {
                setCur(gotoRef.current.value - 1);
            }
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
            <div
                className="shot-box"
                onMouseOver={() => { setShowOptions('block') }}
                onMouseLeave={() => { setShowOptions('none') }}
            >截</div>
            <div
                className="shot-options-box"
                onMouseOver={() => { setShowOptions('block') }}
                onMouseLeave={() => { setShowOptions('none') }}
                ref={shotOptionsRef}
                style={{ display: showShotOptions }}
            >
                <ul>
                    {
                        shotOptions.map((shotOption) => {
                            return <li key={shotOption.id} onClick={() => { shotscreen(shotOption.id) }} className="shot-option">{shotOption.title}</li>
                        })
                    }
                </ul>
            </div>

            <div ref={popupBoxRef} className="popup-box">
                <div onClick={closePopupBox} className="popup-box-close"></div>
                <div className="popup-box-left">
                    <div className="img-box">
                        <img id="img-preview" src={imgBase64} alt="" />
                    </div>
                </div>
                <div className="popup-box-right">
                    <div className="qrcode-box">
                        < QRCode
                            id="qrCode"
                            value={textArray[cur]}
                            size={600} // 二维码的大小
                            fgColor="#000000" // 二维码的颜色
                            style={{ margin: 'auto' }}
                        />
                    </div>
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
