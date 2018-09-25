// pages/group/group.js
const api = require("../../utils/api");
const vail = require("../../utils/vail");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: 0,
    message: '',
    show: true
  },
  changeshow: function (e) {
    this.setData({
      show: false
    })
  },
  changehide: function (e) {
    if (e.detail.value) {
      this.setData({
        show: false
      })
    } else {
      this.setData({
        show: true
      })
    }
  },
  changeNum: function(e) {
    if (e.detail.value.length <= 200) {
      this.setData({
        num: e.detail.value.length,
        message: e.detail.value
      })
    }
  },
  toPath: function() {
    var that=this;
    if (vail.empty(this.data.message, "您的组队意图")) {
      var data = {
        thSessionId: wx.getStorageSync("token"),
        userid: wx.getStorageSync("userid"),
        comid: this.data.id,
        comname: this.data.comname,
        puserid: this.data.puserid,
        message: this.data.message
      };
      console.log(data)
      api.getfriends(data,function(result){
        console.log(result)
        if(result.code==0){
          wx.navigateTo({
            url: `/pages/groupsucc/groupsucc?id=${that.data.id}&comname=${that.data.comname}&nickname=${that.data.nickname}`,
          })
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.hideShareMenu()
    console.log(options);
    this.setData({
      comname: options.comname,
      id: options.id,
      puserid: options.puserid,
      nickname: options.nickname
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})