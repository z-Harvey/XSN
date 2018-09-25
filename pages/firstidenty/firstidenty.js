// pages/identy/identy.js
var demoNoSdk = require('../../utils/demo-no-sdk.js');
const api = require("../../utils/api");
const vail = require("../../utils/vail");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: true
  },

  close: function () {
    this.setData({
      show: false
    })
  },
  toPath: function () {
    wx.reLaunch({
      url: '/pages/my/my',
    })
  },
  upload: function(){
    wx.hideShareMenu()
    var _this=this;
    demoNoSdk('', function (res, bucket, path) {
      console.log(bucket,path,res);
      _this.setData({
        state: false,
        proveurl: res,
        src: res,
        bucket: bucket,
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.state){
      this.setData({
        state: options.state
      })
    }
    var data = {
      thSessionId: wx.getStorageSync('token'),
      userid: wx.getStorageSync('userid')
    }
    this.init(data);
  },
  init: function (data) {
    var _this=this;
    api.myworkinfo(data, function (result) {
      console.log(result,'这里要获取名片的相关信息',result[0]);
      if(_this.data.state==0){
        _this.setData({
          comname: result[0] ? result[0].work : wx.getStorageSync("rzcomname"),
          proveurl: result[0] ? result[0].proveurl : wx.getStorageSync("rzsrc"),
          list: result,
          src: result[0] ? result[0].proveurl : wx.getStorageSync("rzsrc"),
          work: result[0] ? result[0].work : wx.getStorageSync("rzcomname"),
          date: result.length > 1 ? result[result.length - 1].date : ''
        })
      } else if (_this.data.state == 2){
        _this.setData({
          comname: result[0] ? result[0].work : wx.getStorageSync("rzcomname"),
          proveurl: result[0] ? result[0].proveurl : wx.getStorageSync("rzsrc"),
          list: result,
          src: wx.getStorageSync("rzsrc"),
          work: result[0] ? result[0].work : wx.getStorageSync("rzcomname"),
          date: result.length>1?result[result.length - 1].date:''
        })
      }
    })
  },
  myworkprove: function(){
    var that=this;
    if (vail.empty(this.data.proveurl, "您的认证图片","上传") ){
    var data = {
      thSessionId: wx.getStorageSync('token'),
      userid: wx.getStorageSync('userid'),
      proveurl: this.data.bucket,
      comname: this.data.comname.split("/")[0]
    }
    api.myworkprove(data,function(res){
      if(res.code==0){
        wx.reLaunch({
          url: '/pages/my/my',
        })
        wx.setStorageSync("rzcomname", that.data.work)
        wx.setStorageSync("rzsrc", that.data.bucket)
        wx.setStorageSync("rzdate", that.data.date)        
      }
    })
  }  
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