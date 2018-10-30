//app.js
const ald = require('./utils/ald-stat.js');
const wxapi = require("./utils/wxapi.js");
const api = require("./utils/api.js");

var webim = require('./utils/webim.js');
var login = require("./utils/loginpath.js");
var webimhandler = require('./utils/webim_handler.js');

var selSess, loginInfo, selSessHeadUrl;
var selType = webim.SESSION_TYPE.C2C;
var selToID;

App({
  dialogLogin:function(){
    console.log('登录聊天室')
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
      'identifier': userid,
      'identifierNick': wx.getStorageSync("userInfo").nickName,
      'accountType': Config.accountType,
      'userSig': wx.getStorageSync("UserSig"),
    }
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

    function onMsgNotify(newMsgList) {
      var sess, newMsg, selSess;
      //获取所有聊天会话
      var sessMap = webim.MsgStore.sessMap();
      for (var j in newMsgList) { //遍历新消息
        newMsg = newMsgList[j];
        if (newMsg.getSession().id() == selToID) {
          selSess = newMsg.getSession();
          //在聊天窗体中新增一条消息
          console.log('增加的新消息--------' + newMsg);
          // that.getHeader(newMsg);
          that.addMsg(newMsg);
        }
      }

      webim.setAutoRead(selSess, true, true);
      for (var i in sessMap) {
        sess = sessMap[i];
        if (selToID != sess.id()) { //更新其他聊天对象的未读消息数
          updateSessDiv(sess.type(), sess.id(), sess.unread())
        }
      }
    }
    var listeners = {
      "onConnNotify": onConnNotify,
      "onMsgNotify": onMsgNotify
    };
    var options = {
      'isAccessFormalEnv': true,
      'isLogOn': false
    };
    webim.login(loginInfo, listeners, options, function (resp) {

      loginInfo.identifierNick = resp.identifierNick; //设置当前用户昵称
      loginInfo.headurl = resp.headurl;
      wx.setStorageSync('loginInfo', loginInfo)
      getApp().globalData.dialogInfo_nameImg = loginInfo
    }, function (err) {
      console.log("登录失败---", err, err.ErrorInfo)
    })
  },
  onLaunch: function () {
    // 登录
    this.globalData.userInfo=wx.getStorageSync('userInfo');
    // wxapi.getUser();

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
    thSessionId: wx.getStorageSync('token') ,
    dialogInfo_nameImg:1111
  }
})