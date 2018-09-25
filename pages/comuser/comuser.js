// pages/comuser/comuser.js
const api = require("../../utils/api");
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  toPath: function (e) {
    var data = e.currentTarget.dataset;
    if(data.type==='is'){
      wx.navigateTo({
        url: '/pages/search/search',
      })
      return
    }
    var url = `/pages/marklock/marklock?id=${data.id}`
    wx.navigateTo({
      url: url,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    if (options.puserid) {
      this.setData({
        userid: wx.getStorageSync("userid"),
        puserid: options.puserid
      })
    }
    this.init();
  },
  init: function () {
    var _this = this;
    var data = {
      thSessionId: wx.getStorageSync('token'),
      userid: wx.getStorageSync("userid"),
      puserid: this.data.puserid
    }
    api.getcomuser(data, function (result) {
     if(result.length===0){
       _this.setData({
         show:true
       })
     }else{
       _this.setData({
         show:false
       })
     }
     _this.setData({
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