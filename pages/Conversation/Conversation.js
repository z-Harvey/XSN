// pages/dialogInfo/dialogInfo.js
var webim = require('../../utils/webim.js');
var login = require("../../utils/loginpath.js");
var webimhandler = require('../../utils/webim_handler.js');
var api = require("../../utils/api.js");

var selSess, loginInfo, selSessHeadUrl;
var selType = webim.SESSION_TYPE.C2C;
var selToID;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    userinfo: null,
    content: '',
    currentMsgsArray: [],
    confirm: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    // wx.hideShareMenu()
    let data={
      thSessionId: wx.getStorageSync('thSessionId'),
      userid: wx.getStorageSync('userid')
    }
    console.log(data)
    api.converList(data,function (res) {
      console.log(res)
    })
    this.login();
  },
  login: function () {
    var that = this, selSess;
    var userid = wx.getStorageSync("userid");
    var Config = {
      sdkappid: 1400135303,
      accountType: 37140,
      accountMode: 0 //帐号模式，0-表示独立模式，1-表示托管模式
    };

    //用户信息对象
    loginInfo = {
      'sdkAppID': Config.sdkappid,
      'appIDAt3rd': Config.sdkappid,
      'identifier': wx.getStorageSync("userid"),
      'identifierNick': wx.getStorageSync("userInfo").nickName,
      'accountType': Config.accountType,
      'userSig': wx.getStorageSync("UserSig"),
    }
    var listeners = {
      "onConnNotify": onConnNotify,
    };
    var onConnNotify = function (resp) {
      var info;
      switch (resp.ErrorCode) { //链接状态码
        case webim.CONNECTION_STATUS.ON:
          webim.Log.warn('建立连接成功: ' + resp.ErrorInfo);
          break;
        case webim.CONNECTION_STATUS.OFF:
          info = '连接已断开，无法收到新消息，请检查下您的网络是否正常: ' + resp.ErrorInfo;
          alert(info);
          webim.Log.warn(info);
          break;
        case webim.CONNECTION_STATUS.RECONNECT:
          info = '连接状态恢复正常: ' + resp.ErrorInfo;
          alert(info);
          webim.Log.warn(info);
          break;
        default:
          webim.Log.error('未知连接状态: =' + resp.ErrorInfo); //错误信息
          break;
      }
    };
    var options = {
      'isAccessFormalEnv': true,
      'isLogOn': false
    };
    webim.login(loginInfo, listeners, options, function (resp) {
      loginInfo.identifierNick = resp.identifierNick; //设置当前用户昵称
      loginInfo.headurl = resp.headurl;
      wx.setStorageSync('loginInfo', loginInfo)

      webim.getRecentContactList({//获取会话列表的方法
        'Count': 10 //最近的会话数 ,最大为 100
      }, function (resp) {
        console.log(resp)
      }, function (err) {
        console.log(err)
      })

    }, function (err) {
      console.log("登录失败---", err, err.ErrorInfo)
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