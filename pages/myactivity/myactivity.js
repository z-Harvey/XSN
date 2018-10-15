// pages/myactivity/myactivity.js
const api = require("../../utils/api");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    toView: 'eeede'
  },
  jumpTo: function (e) {
    console.log(e)
    // 获取标签元素上自定义的 data-opt 属性的值
    let target = e.currentTarget.dataset.opt;
    this.setData({
      toView: target
    })
  },
  toPath: function(e){
    let data = e.currentTarget.dataset;
    if (data.type === "navHome"){
      wx.switchTab({
        url: "../index/index"
      })
      return true;
    }
    wx.navigateTo({
      url: `/pages/activity/activity?id=${e.currentTarget.dataset.actid}`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    wx.setStorageSync('activity_status', options.activity_status)
    var commondata = {
      thSessionId: wx.getStorageSync("token"),
      userid: wx.getStorageSync("userid")
    }
    this.init(commondata);
  },
  init: function (data) {
    var that = this;
    api.myactivity(data, function (result) {
      if(result.length===0){
        that.setData({
          listNone:true
        })
        return true;
      }
      that.setData({
        list: result
      })
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