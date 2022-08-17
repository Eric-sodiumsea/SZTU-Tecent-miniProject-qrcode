import React, { useEffect, useState } from 'react'
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import './index.css'

export default function ShotBtn(props) {
    const [height, setHeight] = useState('30px');
    const [content, setContent] = useState('截');
    const [element, setElement] = useState();

    useEffect(() => {
        setElement(document.querySelectorAll(`.${props.region}`)[0]);
    }, [])

    function shotscreen() {
        console.log('???');
        html2canvas(element, {
            width: element.scrollWidth,
            height: element.scrollHeight,
            // windowWidth: element.scrollWidth,
            // windowHeight: element.scrollHeight,
            scrollY: 0,
            scrollX: 0,
            // scale: 0.8,
            // scale: 1,
            useCORS: true,
            allowTaint: true,
        }).then(canvas => {
            // 在 .then() 中，默认传入 canvas，通过 canvas.toDataURL() 即可得到该 canvas 截图的 base64
            // dataURL = canvas.toDataURL();
            console.log(canvas.toDataURL())

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

    return (
        <button onClick={shotscreen} className="shotAllBtn" style={{ height: height }}>{content}</button>
    )
}
