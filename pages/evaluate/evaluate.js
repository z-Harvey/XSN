// pages/evaluate/evaluate.js
var api = require('../../utils/api.js');
var app=getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    num:0,
    userinfo: null,
    toView:'eeede'
  },
  jumpTo: function (e) {
    console.log(e)
    // 获取标签元素上自定义的 data-opt 属性的值
    let target = e.currentTarget.dataset.opt;
    this.setData({
      toView: target
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    this.setData({
      userinfo: wx.getStorageSync("userInfo") || app.globalData.userInfo,
    })
    if(options.id){
      this.setData({
        userid: options.id
      })
    }else{
      this.setData({
        userid: wx.getStorageSync("userid")
      })
    }
    this.init();
  },
  init: function () {
    var that = this;
    var data = {
      thSessionId: wx.getStorageSync("token"),
      userid: this.data.userid
    }
    api.evaluationinfo(data, function (result) {
      console.log(result,'拉取自己的评价信息')
      
      that.setData({
        mylist: result.tagslist ? result.tagslist:[],
        list: result.evelution_list,
        eve_num: result.eve_num,
        num: result.user_info.score,
        user_info: result.user_info
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