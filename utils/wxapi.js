const Util = require('./util')
const wxapi = {
  //弹出对话框
  dialog: function (t,c,can,con,succ,error){
    wx.showModal({
      title: t ? t : '',
      content: c ? c : '',
      cancelText: can ? can : '取消',
      confirmText : con ? con : '确定',
      success: function(res) {
        if (res.confirm && succ) {
          succ.call(null, true)
        } else if (res.cancel && error) {
          error.call(null, false)
        }
      }
    })
  },
  //获取地理定位
  location: function(fn) {
    wx.getLocation({
      type: 'wgs84',
      success: res => {
        if (fn) fn(res)
        console.log(res)
        wx.setStorageSync('location', {
          lat: res.latitude,
          lng: res.longitude
        })
      },
      fail: err => {
        if (fn) fn(false)
      }
    })
  },
  /**
   * 授权用户信息
   * 1. 允许授权 - 获取用户信息
   * 2. 拒绝授权 - 提示用户去授权
   */
  authorize: function() {
    wx.authorize({
      scope: 'scope.userInfo',
      success: (res) => {
        this.getUserInfo()
      },
      fail: (err) => {
        console.log(err)
        // this.authorizeModal()
      }
    })
  },
  getUser: function() {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          console.log("已经授权")
          this.getUserInfo()
        } else {
          // 授权
          this.authorize()
        }
      },
      fail: res => {
        console.log(res)
      }
    })
  },
  getUserInfo: function() {
    wx.getUserInfo({
      success: res => {
        // 检查用户权限和上次登录身份
        this.updata(res)
        console.log(res);
      }
    })
  },
  updata: function(data, fn) {
    data = JSON.parse(data.rawData);
    wx.setStorageSync('userInfo', data);
    getApp().globalData.userInfo=data;
    // this.login();
  },
  login: function () {
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
            if (result.code == 0) {
              console.log("首次，已经登陆")
              // wx.reLaunch({
              //   url: '/pages/dayname/dayname',
              // })
              wx.setStorageSync("token", result.data.thSessionId)
              wx.setStorageSync('userid', result.data.userid)
            } else if (result.code == 1) {
              console.log("已经登陆多次")
              // wx.reLaunch({
              //   url: '/pages/index/index',
              // })
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
          }
        })
      }
    })
  },
}

module.exports = wxapi