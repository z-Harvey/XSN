// pages/share/share.js
const wxapi = require("../../utils/wxapi.js");
const api = require("../../utils/api");
const Util = require("../../utils/util");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfo: null
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    // options.id=3;
    // options.userid=3;

    var that=this;
    if(wx.getStorageSync("userid")){
      wx.reLaunch({
        url: '/pages/index/index',
      })
    }else if (wx.getStorageSync("token")) {
      this.init(that, options.userid)
    } else {
      wxapi.getUser();
      wx.login({
        success: (res) => {
          Util.request({
            modules: '/login',
            method: 'get',
            data: {
              code: res.code
            },
            success: (result) => {
              console.log(result);
              if (result.code == 0) {
                wx.setStorageSync("token", result.data.thSessionId)
                wx.setStorageSync('userid', result.data.userid)
              } else if (result.code == 1) {
                wx.setStorageSync("token", result.data.thSessionId)
                wx.setStorageSync('userid', result.data.userid)
                wx.setStorageSync("UserSig", result.data.UserSig)

              } else if (result.code == 2) {
                console.log("未注册")
                wx.setStorageSync("token", result.data.thSessionId)
                wx.setStorageSync('userid', '')
                // wx.reLaunch({
                //   url: '/pages/index/index',
                // })
              }
              wx.setStorageSync('logincode', result.code)
              that.init(that, options.userid);
            }
          })
        }
      })
    }
    this.setData({
      shareuserid: options.userid
    })
  },
  init: function(that,id){
    var data = {
      userid: id,
      thSessionId: wx.getStorageSync('token')
    }
    api.getfriendimg(data, function (res) {
      console.log(res);
      that.setData({
        header: res.data.avatarurl,
        nickname: res.data.nickname
      })
    })  
  },
  getPhoneNumber: function (e) {
    if (e.detail.errMsg == 'getPhoneNumber:ok') {
    var that = this;
    var data = {
      thSessionId: wx.getStorageSync("token"),
      iv: e.detail.iv,
      encryptedData: e.detail.encryptedData
    }
    api.bindTel(data, function (data) {
      that.setData({
        phone: data.data.phoneno
      })
      wx.setStorageSync('phone', data.data.phoneno);
    });
    }
  },
  save: function(){
    var data = {
      userid: this.data.shareuserid,
      phone: this.data.phone,
      jy_status: 1,
      thSessionId: wx.getStorageSync("token"),
    }
    console.log(data);
    if(wx.getStorageSync("userid")){
      console.log("userid------------")
    }else{
      api.getregistercode(data, function (result) {
        console.log(result)
        // if(result){
          wx.navigateTo({
            url: '/pages/card/card',
          })
        // }
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