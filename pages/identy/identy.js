// pages/identy/identy.js
var demoNoSdk = require('../../utils/demo-no-sdk.js');
const api = require("../../utils/api");
const vail = require("../../utils/vail");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: true,
    showbtn: false,
    showtxt: wx.getStorageSync("updatestate")
  },
  close: function(){
    this.setData({
      show: false
    })
  },
  toPath: function(){
    wx.reLaunch({
      url: '/pages/my/my',
    })
  },
  upload: function(){
    var _this=this;
    demoNoSdk('用户id', function (res, bucket, path) {
      var proveurl = { bucket: bucket, key: path };
      _this.setData({
        proveurl: res,
        bucket: bucket,
        showbtn: true
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    console.log(this.data.showtxt, wx.getStorageSync("updatestate"))
    var data={
      thSessionId: wx.getStorageSync('token'),
      userid: wx.getStorageSync('userid'),
    }
    this.init(data);
  },
  init: function(data){
    var _this = this;
    api.myworkinfo(data,function(result){
      console.log(result);
      if (wx.getStorageSync("updatestate")==1){
        _this.setData({
          comname: result[0] ? result[0].work : wx.getStorageSync("rzcomname"),
          proveurl: '',
          name: result[0].work.split("/")[0],
          list: result,
          work: result[0].work ? result[0].work : wx.getStorageSync("rzcomname"),
        })
      }else{
        _this.setData({
          comname: result[0].work,
          proveurl: result[0].proveurl,
          name: result[0].work.split("/")[0],
          list: result
        })
      }
    })
  },
  myworkprove: function () {
    var that=this;
    if (vail.empty(this.data.proveurl, "您的认证图片", "上传")) {
      var data = {
        thSessionId: wx.getStorageSync('token'),
        userid: wx.getStorageSync('userid'),
        proveurl: this.data.bucket || this.data.proveurl,
        comname: this.data.name
      }
      console.log(data)
      api.myworkprove(data, function (res) {
        console.log(res);
        if (res.code == 0) {
          wx.reLaunch({
            url: '/pages/my/my',
          })
          wx.setStorageSync("rzcomname", that.data.work)
          wx.setStorageSync("rzsrc", that.data.bucket)
          // wx.setStorageSync("rzdate", that.data.date)   
        }
      })
    }
  },
  changecomname: function (e) {
    this.setData({
      comname: e.detail.value,
      name: e.detail.value.split("/")[0]
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
    this.setData({
      showtxt: wx.getStorageSync("updatestate")
    })
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