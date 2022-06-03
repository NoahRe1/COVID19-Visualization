// pages/province/province.js
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
      city:[],
      rowHeight:96,
      columnWidth:175,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      var that = this
      this.setData({
        name: options.name,
        spell:options.spell
      })
      wx.request({
        url: 'http://192.168.3.2:5000/'+this.data.spell,//https://lab.isaaclin.cn/nCoV/api/overall
        header:{
          "Content-type": "application/json"
        },
        success (res) {
          console.log("获得市级数据")
          console.log(res.data)
          that.setData({
            city: res.data.city
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
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})