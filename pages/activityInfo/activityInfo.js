// pages/activityInfo/activityInfo.js
const api = require("../../utils/api");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    flag: false,
    logincode: wx.getStorageSync("userid")
  },
  toIndex: function () {
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  getPhoneNumber: function (e) {
    if (e.detail.errMsg == 'getPhoneNumber:ok') {
    var data = {
      thSessionId: wx.getStorageSync("token"),
      iv: e.detail.iv,
      encryptedData: e.detail.encryptedData
    }
    api.bindTel(data, function (data) {   
      wx.setStorageSync('phone', data.data.phoneno);
      wx.navigateTo({
        url: '/pages/card/card',
      })
    });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    var that=this;
    this.init(options.id,that)
  },
  init: function(id,that){
    var data={
      comid: id,
      thSessionId: wx.getStorageSync('token'),
    }
    api.getnamecom(data,function(result){
      console.log(result);
      that.setData({
        comid: result[0].comid,
        comname: result[0].comname
      })
    })
  },
  toPath: function(){
    var comid=this.data.comid;
    var comname=this.data.comname;
    wx.redirectTo({
      url: `/pages/markguest/markguest?id=${comid}&comname=${comname}`,
    })
  },
  onShow: function(){
    this.setData({
      logincode: wx.getStorageSync("userid")
    })
  }
})