# COVID19-Visualization

## 简介

基于微信小程序，实现新冠疫情防控的表格、地图、折线图等可视化展示。

## 环境

- 开发环境
  
  - 微信开发者工具1.05
  
  - PyCharm Community Edition 2020

- 编程语言
  
  - Python
  
  - JavaScript

- 使用平台
  
  - 微信小程序

## 文件目录

```
COVID19-Visualization
|
├─README.md
│
├─back-end
│      Crawler.py
│      DataRequest.py
│      Processing.py
│
├─docs
│      概要设计.pdf
│      详细设计.pdf
│      需求分析.pdf
│
├─front-end
│  │  app.js
│  │  app.json
│  │  app.wxss
│  │  project.config.json
│  │  project.private.config.json
│  │  sitemap.json
│  │
│  ├─components
│  │  ├─ECharts
│  │  │  │  ec-canvas.js
│  │  │  │  ec-canvas.json
│  │  │  │  ec-canvas.wxml
│  │  │  │  ec-canvas.wxss
│  │  │  │  echarts.js
│  │  │  │  wx-canvas.js
│  │  │  │
│  │  │  └─mapData
│  │  │          map-china.js
│  │  │
│  │  └─table
│  │          table.js
│  │          table.json
│  │          table.wxml
│  │          table.wxss
│  │
│  ├─icon
│  │      chart_0.png
│  │      chart_1.png
│  │      map_0.png
│  │      map_1.png
│  │
│  └─pages
│      ├─chart
│      │      chart.js
│      │      chart.json
│      │      chart.wxml
│      │      chart.wxss
│      │
│      ├─map
│      │      map.js
│      │      map.json
│      │      map.wxml
│      │      map.wxss
│      │
│      └─province
│              province.js
│              province.json
│              province.wxml
│              province.wxss
│
└─images
        程序架构.png
```
