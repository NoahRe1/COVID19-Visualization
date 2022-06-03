// pages/chart/chart.js
import * as echarts from '../../components/ECharts/echarts.js'

Page({

    /**
     * 页面的初始数据
     */
    data: {
      dataAttribute:[
        {
            title:"日期",
            key:"date"
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
            title:"境外输入",
            key:"overseas"
        },
        {
            title:"现存无症状",
            key:"asymptomatic"
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
      trend:[],
      rowHeight:96,
      columnWidth:175,
    },

    initChart: function (canvas, width, height, dpr) {
      let chart = echarts.init(canvas, 'light', {
        width: width,
        height: height,
        devicePixelRatio: dpr
      });
      canvas.setChart(chart);
      
      var that = this
      var t = setInterval(function(){
        if(that.data.trend){
          clearInterval(t)
          var Data = that.data.trend
          var date = []
          var currentConfirmed = []
          for(let i=Data.length-1;i>=0;i--){
            date.push(Data[i].date)
            currentConfirmed.push(Data[i].currentConfirmed)
          }
  
      var option = {
        name: "11111",
        xAxis: {
          type: 'category',
          data: date
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: currentConfirmed,
          type: 'line',
          smooth:true,
          symbol: 'circle',
          symbolSize: 3,
        }],
        grid: {
          show: true,
          x: 80,
          y: 40,
          x2: 15,
          y2: 20,
          height: "60%",
        }
      };
      chart.setOption(option);
      return chart;
      }
      }, 100)
      },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      var that = this
      that.setData({
        name: options.name
      }) 
      wx.request({
        url: 'http://192.168.3.2:5000/trend',
        header:{
          "Content-type": "application/json"
        },
        success (res) {
          console.log("获得三十日数据")
          console.log(res.data)
          that.setData({
            trend: res.data.trend
          })
        }
      })
      that.setData({
        ecChart: {
          onInit: that.initChart
        }
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