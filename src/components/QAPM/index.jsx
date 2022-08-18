import React, { useState, useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import ShotBtn from '../ShotBtn'
import './index.css';

export default function QAPM() {
    const [muiGridItemTitles] = useState(['崩溃率', 'ANR率', '流畅度', '冷启动耗时', 'Webview页面完全加载耗时', 'JS错误率', '请求错误率', '成功请求耗时'])
    const shotOptions = [
        {
            id: 'content',
            title: '长截图'
        },
        {
            id: 'MuiGrid',
            title: '总览表',
        },
        {
            id: 'trend',
            title: '趋势分析',
        },
        {
            id: 'crashes',
            title: '崩溃次数TOP5的页面',
        },
        {
            id: 'region-analyze',
            title: '地区分析',
        }
    ]

    const trendChartRef = useRef(null);
    const crash1Ref = useRef(null);
    const crash2Ref = useRef(null);
    const regionAnalyzeRef = useRef(null);

    useEffect(() => {
        // 总览 -- 图表
        const muiGridItems = document.getElementsByClassName('MuiGrid-item-chart');
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

        // 崩溃分析1 -- 图表
        const crash1Chart = echarts.init(crash1Ref.current);
        const crash1ChartOption = {
            title: {
                text: 'Referer of a Website',
                subtext: 'Fake Data',
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left'
            },
            series: [
                {
                    name: 'Access From',
                    type: 'pie',
                    radius: '50%',
                    data: [
                        { value: 1048, name: 'Search Engine' },
                        { value: 735, name: 'Direct' },
                        { value: 580, name: 'Email' },
                        { value: 484, name: 'Union Ads' },
                        { value: 300, name: 'Video Ads' }
                    ],
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        crash1Chart.setOption(crash1ChartOption);

        // 崩溃分析2 -- 图表
        const crash2Chart = echarts.init(crash2Ref.current);
        const crash2ChartOption = {
            tooltip: {
                trigger: 'item'
            },
            legend: {
                top: '5%',
                left: 'center'
            },
            series: [
                {
                    name: 'Access From',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: '40',
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: [
                        { value: 1048, name: 'Search Engine' },
                        { value: 735, name: 'Direct' },
                        { value: 580, name: 'Email' },
                        { value: 484, name: 'Union Ads' },
                        { value: 300, name: 'Video Ads' }
                    ]
                }
            ]
        };
        crash2Chart.setOption(crash2ChartOption);

        // 地图分析 -- 图片
        const regionAnalyzeChart = echarts.init(regionAnalyzeRef.current);
        const regionAnalyzeChartOption = {
            xAxis: {},
            yAxis: {},
            series: [
                {
                    symbolSize: 20,
                    data: [
                        [10.0, 8.04],
                        [8.07, 6.95],
                        [13.0, 7.58],
                        [9.05, 8.81],
                        [11.0, 8.33],
                        [14.0, 7.66],
                        [13.4, 6.81],
                        [10.0, 6.33],
                        [14.0, 8.96],
                        [12.5, 6.82],
                        [9.15, 7.2],
                        [11.5, 7.2],
                        [3.03, 4.23],
                        [12.2, 7.83],
                        [2.02, 4.47],
                        [1.05, 3.33],
                        [4.05, 4.96],
                        [6.03, 7.24],
                        [12.0, 6.26],
                        [12.0, 8.84],
                        [7.08, 5.82],
                        [5.02, 5.68]
                    ],
                    type: 'scatter'
                }
            ],
            grid: [
                {
                    top: 20,
                    bottom: 20,
                }
            ]
        };
        regionAnalyzeChart.setOption(regionAnalyzeChartOption);
    }, []);

    return (
        <>
            <ShotBtn shotOptions={shotOptions} />

            <div id="content">
                <h4 className="content-title">
                    性能看板
                </h4>
                <div id="MuiGrid">
                    {
                        muiGridItemTitles.map((muiGridItemTitle) => {
                            return (
                                <div className="MuiGrid-item" key={muiGridItemTitle}>
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
                <div id="trend">
                    <h4 className="trend-title">
                        趋势分析
                    </h4>
                    <div ref={trendChartRef} className="trend-chart"></div>
                </div>
                <div id="crashes">
                    <h4 className="crashes-title">
                        崩溃次数TOP5的页面
                    </h4>
                    <div className="crashed-content">
                        <div ref={crash1Ref} className="crash1"></div>
                        <div ref={crash2Ref} className="crash2"></div>
                    </div>
                </div>
                <div id="region-analyze">
                    <h4 className="region-analyze-title">
                        地区分析
                    </h4>
                    <div ref={regionAnalyzeRef} className="region-analyze-chart"></div>
                </div>
            </div>
        </>
    );
}
