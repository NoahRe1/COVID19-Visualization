// pages/map/map.js
import * as echarts from '../../components/ECharts/echarts.js'
import geoJson from '../../components/ECharts/mapData/map-china'

Page({
    /**
     * 页面的初始数据
     */
    data: {
       dataAttribute:[
            {
                title:"地区",
                key:"name"
            },
            {
                title:"现存确诊",
                key:"currentConfirmed"
            },
            {
                title:"累计确诊",
                key:"confirmed"
            },
            {
                title:"累计死亡",
                key:"dead"
            },
            {
                title:"累计治愈",
                key:"cured"
            }
        ], 
        overall:[],
        province:[],
        mapData:[],
        rowHeight:96,
        columnWidth:175,
    },

    provincePage:function(e) {
      let province=e.detail
      let provincespell={
        "台湾":"taiwan", 
        "香港":"xianggang", 
        "上海市":"shanghai", 
        "浙江省":"zhejiang", 
        "北京市":"beijing",
        "四川省":"sichuan", 
        "河南省":"henan", 
        "吉林省":"jilin", 
        "山东省":"shandong", 
        "福建省":"fujian",
        "天津市":"tianjin", 
        "青海省":"qinghai", 
        "海南省":"hainan", 
        "广西壮族自治区":"guangxi", 
        "云南省":"yunnan",
        "辽宁省":"liaoning", 
        "江苏省":"jiangsu", 
        "湖南省":"hunan", 
        "重庆市":"chongqing", 
        "河北省":"hebei",
        "江西省":"jiangxi", 
        "内蒙古自治区":"neimenggu", 
        "贵州省":"guizhou", 
        "陕西省":"shaanxi", 
        "湖北省":"hubei",
        "黑龙江省":"heilongjiang", 
        "安徽省":"anhui", 
        "新疆维吾尔自治区":"xinjiang",
        "甘肃省":"gansu",
        "广东省":"guangdong",
        "山西省":"shanxi", 
        "宁夏回族自治区":"ningxia", 
        "澳门":"aomen", 
        "西藏自治区":"xizang"}
      wx.navigateTo({
        url: '../province/province?name='+province+'&spell='+provincespell[province],
      })
    },

    initChartMap: function (canvas, width, height, dpr) {
      let myMap = echarts.init(canvas, 'light', {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
      });
      canvas.setChart(myMap);
      echarts.registerMap('china', geoJson);  // 绘制中国地图
      var that = this
      var t = setInterval(function(){
        if(that.data.province){
          clearInterval(t)
          var Data = that.data.province
     
          const option = {
            tooltip: {
              trigger: 'item',
              formatter: function (e) {
                var name = e.name ? e.name : '获取中';
                var value = e.value ? e.value : '暂无数据'
                return `${name}:\n人数:${value} `
              }
            },
            visualMap: {
              show: true,
              type: "piecewise",
             left: 10,
          bottom: "0",
          align: "left",
          itemWidth: 10,
          itemHeight: 10,
          textStyle: {
            fontSize: 10
          },
          pieces: [
            { min:10000,label:'10000人以上',color:'#ED514E'},
            { min: 1000, max:9999, label: '1000-9999人', color: '#FF8F66' },
            { min: 100, max: 999, label: '100-999人', color: '#FFB769' },
            { min: 10, max: 99, label: '10-99人', color: '#FFE6BD' },
            { min: 1, max: 9, label: '1-9人', color: '#FFA' },
            { min:-10000,max: 0, label: '无', color: '#FFFFFF'}
          ]
        },
        geo: [
          {
            // 地理坐标系组件
            map: "china",
            roam: "scale", // 可以缩放和平移
            aspectScale: 0.8, // 比例
            layoutCenter: ["50%", "40%"], // position位置
            layoutSize: 300, // 地图大小，保证了不超过 370x370 的区域
            label: {
              // 图形上的文本标签
              normal: {
                show: false,
                textStyle: {
                  color: "rgba(0, 0, 0, 0.9)",
                  fontSize: '7'
                }
              },
              emphasis: { // 高亮时样式
                color: "#000"
              }
            },
            itemStyle: {
              // 图形上的地图区域
              normal: {
                borderColor: "rgba(0,0,0,0.2)",
                areaColor: "#fff"
              },
              emphasis: { // 高亮时样式
                show: false
              }
            },
            regions: [
              {
                name: "南海诸岛",
                value: 0,
                itemStyle: {
                  normal: {
                    opacity: 0,
                    label: {
                      show: false
                    }
                  }
                }
              }
            ]
          }
        ],
        series: [
          {
            type: 'map',
            mapType: 'china',
            geoIndex: 0,
            roam: true, // 鼠标是否可以缩放
            label: {
              show: true,
              normal: {
                show: true,
                fontSize: 8
              },
              emphasis: {
                show: true
              }
            },
            data: that.data.mapData
          }]
        };
        
        myMap.setOption(option);
        myMap.on('click', (a) => {
          console.log(a)
        })
        return myMap
      }
    }, 100)
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that=this;
        wx.request({
          url: 'http://192.168.3.2:5000/overall',
          success(res){
              console.log("获得概况、省级数据")
              console.log(res.data)
              that.setData({
                overall:res.data.overall,
                province:res.data.province,
                date:res.data.date
              })
              let mapData=[]
              let provincename={
                "台湾":"台湾",
                "香港":"香港",
                "上海市":"上海",
                "广东省":"广东",
                "浙江省":"浙江",
                "北京市":"北京",
                "四川省":"四川",
                "河南省":"河南",
                "吉林省":"吉林",
                "山东省":"山东",
                "福建省":"福建",
                "天津市":"天津",
                "青海省":"青海",
                "海南省":"海南",
                "广西壮族自治区":"广西",
                "云南省":"云南",
                "辽宁省":"辽宁",
                "江苏省":"江苏",
                "湖南省":"湖南",
                "重庆市":"重庆",
                "河北省":"河北",
                "江西省":"江西",
                "内蒙古自治区":"内蒙古",
                "贵州省":"贵州",
                "陕西省":"陕西",
                "湖北省":"湖北",
                "黑龙江省":"黑龙江",
                "安徽省":"安徽",
                "新疆维吾尔自治区":"新疆",
                "甘肃省":"甘肃",
                "山西省":"山西",
                "宁夏回族自治区":"宁夏",
                "澳门":"澳门",
                "西藏自治区":"西藏"
              }
              for(let i=0;i<res.data.province.length;i++){
                mapData.push({
                  "name":provincename[res.data.province[i].name],
                  "value":res.data.province[i].currentConfirmed
                })
              }
              that.setData({mapData:mapData})
          }
        })
        that.setData({
          ecMap: {
            onInit: that.initChartMap
          },
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})