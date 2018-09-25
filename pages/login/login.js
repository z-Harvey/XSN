// pages/login/login.js
const api = require("../../utils/api");
const wxapi = require("../../utils/wxapi");

var app=getApp();
const Util = require('../../utils/util')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    
  },
  shouquan: function(){
    wxapi.getUser();
  },
  login: function(){
    wx.login({
      success: (res) => {
        console.log(res)
        Util.request({
          modules: '/login',
          method: 'get',
          data: {
            code: res.code
          },
          success: (result) => {
            console.log(result);
            if(result.code==0){
              console.log("首次，已经登陆")
              wx.reLaunch({
                url: '/pages/dayname/dayname',
              })
              wx.setStorageSync("token", result.data.thSessionId)
              wx.setStorageSync('userid', result.data.userid)    
            }else if(result.code==1){
              console.log("已经登陆多次")
              wx.reLaunch({
                url: '/pages/index/index',
              })
              wx.setStorageSync("token", result.data.thSessionId)
              wx.setStorageSync('userid', result.data.userid)
              wx.setStorageSync("UserSig", result.data.UserSig)
              
            } else if (result.code == 2) {
              console.log("未注册")
              wx.setStorageSync("token", result.data.thSessionId)
              wx.setStorageSync('userid', '')
              wx.reLaunch({
                url: '/pages/index/index',
              })
            }
            wx.setStorageSync('logincode', result.code) 
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
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