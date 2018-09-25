// pages/help/help.js
const api = require("../../utils/api");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1
  },
  toPath: function(e){
    var data=e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/helpinfo/helpinfo?id=${data.id}`,
    })
  },
  toTop: function(){

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    this.init();
  },
  init: function (data) {
    var data = {
      thSessionId: wx.getStorageSync("token"),
      userid: wx.getStorageSync("userid"),
      page_num: this.data.page
    }
    var that = this;
    api.myhelp(data, function (result) {
      console.log(result)
      that.setData({
        list: that.data.page === 1 ? result.helpinfo : that.data.list.concat(result.helpinfo)
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
    // console.log("2222")
    // var that = this;
    // this.setData({
    //   page: ++this.data.page
    // })
    // this.init();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})