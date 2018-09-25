//app.js
const ald = require('./utils/ald-stat.js');
const wxapi = require("./utils/wxapi.js");
const api = require("./utils/api.js");

App({
  onLaunch: function () {
    // 登录
    this.globalData.userInfo=wx.getStorageSync('userInfo');
    wxapi.getUser();
    // wxapi.login();
    
    // wx.getUserInfo({
    //   success: res => {
    //     // 检查用户权限和上次登录身份
    //     console.log(res,"----------------------");
    //   }
    // })
  },
  globalData: {
    userInfo: null,
    userid: wx.getStorageSync('userid'),
    thSessionId: wx.getStorageSync('token') 
  }
})