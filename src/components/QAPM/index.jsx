import React, { useState, useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import ShotBtn from '../ShotBtn'
import './index.css';

export default function QAPM() {
    const [muiGridItemTitles] = useState(['崩溃率', 'ANR率', '流畅度', '冷启动耗时', 'Webview页面完全加载耗时', 'JS错误率', '请求错误率', '成功请求耗时'])
    const [regions, setRegions] = useState([{}])

    const trendChartRef = useRef(null);

    useEffect(() => {
        // 总览 -- 图表
        const muiGridItems = document.getElementsByClassName('MuiGrid-item-chart')
        console.log(muiGridItems)
        const muiGridItemOption = {
            xAxis: {
                type: 'category',
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    data: [120, 200, 150, 80, 70, 110, 130],
                    type: 'bar'
                }
            ],
            grid: [
                {
                    top: 30,
                    bottom: 40,
                }
            ]
        };
        Array.from(muiGridItems).map((muiGridItem) => {
            const muiGridItemChart = echarts.init(muiGridItem);
            muiGridItemChart.setOption(muiGridItemOption);
        })

        // 趋势分析 -- 图表
        const trendChart = echarts.init(trendChartRef.current);
        const data = [["2000-06-05", 116], ["2000-06-06", 129], ["2000-06-07", 135], ["2000-06-08", 86], ["2000-06-09", 73], ["2000-06-10", 85], ["2000-06-11", 73], ["2000-06-12", 68], ["2000-06-13", 92], ["2000-06-14", 130], ["2000-06-15", 245], ["2000-06-16", 139], ["2000-06-17", 115], ["2000-06-18", 111], ["2000-06-19", 309], ["2000-06-20", 206], ["2000-06-21", 137], ["2000-06-22", 128], ["2000-06-23", 85], ["2000-06-24", 94], ["2000-06-25", 71], ["2000-06-26", 106], ["2000-06-27", 84], ["2000-06-28", 93], ["2000-06-29", 85], ["2000-06-30", 73], ["2000-07-01", 83], ["2000-07-02", 125], ["2000-07-03", 107], ["2000-07-04", 82], ["2000-07-05", 44], ["2000-07-06", 72], ["2000-07-07", 106], ["2000-07-08", 107], ["2000-07-09", 66], ["2000-07-10", 91], ["2000-07-11", 92], ["2000-07-12", 113], ["2000-07-13", 107], ["2000-07-14", 131], ["2000-07-15", 111], ["2000-07-16", 64], ["2000-07-17", 69], ["2000-07-18", 88], ["2000-07-19", 77], ["2000-07-20", 83], ["2000-07-21", 111], ["2000-07-22", 57], ["2000-07-23", 55], ["2000-07-24", 60]];
        const dateList = data.map(function (item) {
            return item[0];
        });
        const valueList = data.map(function (item) {
            return item[1];
        });
        const trendChartOption = {
            visualMap: [
                {
                    show: false,
                    type: 'continuous',
                    seriesIndex: 0,
                    min: 0,
                    max: 400
                }
            ],
            title: [
                {
                    left: 'center',
                    text: 'Gradient along the y axis'
                }
            ],
            tooltip: {
                trigger: 'axis'
            },
            xAxis: [
                {
                    data: dateList
                }
            ],
            yAxis: [
                {}
            ],
            series: [
                {
                    type: 'line',
                    showSymbol: false,
                    data: valueList
                }
            ]
        };
        trendChart.setOption(trendChartOption);

    }, []);

    return (
        <>
            <div className="content">
                <h4 className="content-title">
                    性能看板
                </h4>
                <div className="MuiGrid">
                    {
                        muiGridItemTitles.map((muiGridItemTitle) => {
                            return (
                                <div className="MuiGrid-item">
                                    <div className="MuiGrid-item-title">
                                        <h4>{muiGridItemTitle}</h4>
                                    </div>
                                    <div className="MuiGrid-item-content">
                                        <div className="MuiGrid-item-chart"></div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                <div className="trend">
                    <h4 className="trend-title">
                        趋势分析
                    </h4>
                    <div ref={trendChartRef} className="trend-chart"></div>
                </div>
                <div className="crashes">
                    <h4 className="crashes-title">
                        崩溃次数TOP5的页面
                    </h4>
                </div>
                <div className="region">
                    <h4 className="region-title">
                        地区分析
                    </h4>
                </div>
            </div>
            <ShotBtn />
        </>
    );
}
