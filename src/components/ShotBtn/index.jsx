import React, { useState } from 'react'
import './index.css'

export default function ShotBtn() {
    const [height, setHeight] = useState('30px');
    const [content, setContent] = useState('截');

    setHeight('30px');
    setContent('截');

    return (
        <button className="shotAllBtn" style={{ height: height }}>{content}</button>
    )
}
