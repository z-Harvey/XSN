// pages/mygicon/mygicon.js
const api = require("../../utils/api");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    page: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    this.init()
  },
  init: function(){
    var that=this;
    var data = {
      thSessionId: wx.getStorageSync("token"),
      userid: wx.getStorageSync("userid"),
      page_num: this.data.page
    }
    api.myicon(data,function(result){
      console.log(result)
      that.setData({
        list: that.data.page === 1 ? result : that.data.list.concat(result),
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
    var that = this;
    this.setData({
      page: ++this.data.page
    })
    this.init();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})