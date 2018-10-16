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
    var _this=this;
    let data={
      auth_type:'work'
    }
    demoNoSdk(data, function (res, bucket, path) {
      console.log(bucket,path,res);
      _this.setData({
        state: false,
        proveurl: res,
        src: res,
        bucket: bucket,
        showTit: false
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()  
    console.log('-----------------------')
    console.log(options.state)  
    console.log('-----------------------')    
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
      // if(_this.data.state==0){
      //   console.log('asdfasdfasfsdf')
      //   _this.setData({
      //     comname: result[0] ? result[0].work : wx.getStorageSync("rzcomname"),
      //     proveurl: result[0] ? result[0].proveurl : wx.getStorageSync("rzsrc"),
      //     list: result,
      //     src: result[0] ? result[0].proveurl : wx.getStorageSync("rzsrc"),
      //     work: result[0] ? result[0].work : wx.getStorageSync("rzcomname"),
      //     date: result.length > 1 ? result[result.length - 1].date : ''
      //   })
      // } else if (_this.data.state == 2){
        console.log(result)
        var no = result.nowworkdetail;
        var wor = result.workinfo_list;
        var comname, proveurl, list, src, work, date, workTitle
        comname = no.work;
        // proveurl = result.nowworkdetail.proveurl;
        list = wor;
        src = no.proveurl || wor[0].proveurl;
        if (no.provestatus == 2){
          _this.setData({
            btnShow: false,
            showTit:false
          })
        }else{
          workTitle = wor[0].work       
          _this.setData({
            btnShow:true,
            showTit:true
          })
        }

        _this.setData({
          comname: comname,
          proveurl: proveurl,
          list: list,
          src: src,
          work: work,
          date: date,
          workTitle: workTitle
        })
      // }
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