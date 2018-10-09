// pages/createteam/createteam.js
const api = require("../../utils/api");
const vail = require("../../utils/vail");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    num: 0,
    message: '',
    minmoney: '',
    maxmoney: '',
    activeId: 0,
    show: true
  },
  changeshow: function(e){
    this.setData({
      show: false
    })
  },
  changehide: function(e){
    if(e.detail.value){
      this.setData({
        show: false
      })
    }else{
      this.setData({
        show: true
      })
    }
  },
  changeNum: function(e){
    if(e.detail.value.length<=200){
      this.setData({
        num: e.detail.value.length,
        message: e.detail.value
      })
    }
  },
  changeday: function(e){
    this.setData({
      activeId: e.currentTarget.dataset.index
    })
  },
  toPath: function(){
    this.init()
  },
  changemin: function(e){
    this.setData({
      minmoney: e.detail.value
    })
  },
  changemax: function (e) {
    this.setData({
      maxmoney: e.detail.value
    })
  },
  init: function(){
    var that=this;
    // var min = this.data.minmoney,max=this.data.maxmoney;
    // if (this.data.minmoney > this.data.maxmoney){
    //   this.setData({
    //     minmoney: max,
    //     maxmoney: min
    //   })
    // }
    var data = {
      thSessionId: wx.getStorageSync("token"),
      userid: wx.getStorageSync("userid"),
      comid: this.data.comid,
      comname: this.data.comname,
      message: this.data.message,
      minmoney: this.data.minmoney,
      maxmoney: this.data.maxmoney,
      aging: this.data.activeId+1,
      nickname: wx.getStorageSync('userInfo').nickName
    };
    if (vail.empty(this.data.message, "您的组队意图") && vail.empty(this.data.minmoney, "您的助力佣金") && vail.empty(this.data.maxmoney, "您的助力佣金") && vail.empty(this.data.activeId+1, "有效期")) {
      api.createrecruit(data, function (result) {
        console.log(result);
        if (result.code == 0) {
          wx.redirectTo({
            url: `/pages/release/release?minmoney=${that.data.minmoney}&maxmoney=${that.data.maxmoney}&recid=${result.recid}&rectcreate=${wx.getStorageSync("userid")}`,
          })
        }
      }) 
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    this.setData({
      comid: options.comid,
      comname: options.comname
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