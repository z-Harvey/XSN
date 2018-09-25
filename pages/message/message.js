// pages/message/message.js
var webim = require('../../utils/webim.js');
// var webim = require('./webim.js');
var login=require("../../utils/login.js");
var api=require("../../utils/api.js");

var selSess, loginInfo, selSessHeadUrl;
var selType = webim.SESSION_TYPE.C2C;
var selToID;

Page({
  /**
   * 页面的初始数据
   */
  data: {
  
  },
  toPath: function (e) {
    var url;
    var data = e.currentTarget.dataset;
    if (data.type == 'default') {
      url = "/pages/defaultdialog/defaultdialog?id=0"
    } else if (data.type == 'dialog') {
      //将未读消息设置成0
      webim.setAutoRead(data.id, true, true);
      url = `/pages/dialogInfo/dialogInfo?id=${data.id}&src=${data.src}`
    } else if (data.type == 3) {
      url = "/pages/cardFile/cardFile"
    }
    wx.navigateTo({
      url: url,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    this.login();
    this.setData({
      list: wx.getStorageSync("msg")
    })
    var data={
      userid: wx.getStorageSync('userid'),
      thSessionId: wx.getStorageSync('token')
    }
    // this.init(data);
  },
  init: function(data){
    var that=this;
    api.getfriendimg(data,function(res){
      console.log(res)
      // that.setData({
      //   list: res.data
      // })
    })
    this.setData({
      list: wx.getStorageSync("")
    })
  },
  login: function (puserid) {
    var that = this, selSess;
    var userid = wx.getStorageSync("userid");
    var Config = {
      sdkappid: 1400133429,
      accountType: 36684,
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
      "onMsgNotify": onMsgNotify
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

    function onMsgNotify(newMsgList) {
      console.log('监听消息')
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

        }
      }
      var elems = newMsgList[0].getElems();
      var content = elems[0].getContent();
      var msgContent = that.convertTextMsgToHtml(content);

      var list = {
        id: sess.id(),
        unread: sess.unread(),
        msgContent: msgContent,
        time: that.time(sess.time())
      }
      //获取好友头像
      var data = {
        userid: list.id,
        thSessionId: wx.getStorageSync('token')
      }
      api.getfriendimg(data, function (res) {
        console.log(res);
        list.src = res.data.avatarurl;
        list.provestatus = res.data.provestatus;

        var arr=[];
        console.log(list);
        if (wx.getStorageSync("msg")) {
          arr = wx.getStorageSync("msg")
        } else {
          arr.push(list);
        }
        console.log(arr.length);
        for (var i = 0; i < arr.length; i++) {
          if (arr[i].id == list.id) {
            arr.splice(i, 1)
            arr.unshift(list)
            break;
          } else {
            console.log("不相等")
            arr.unshift(list)
            break;
          }
        }
        that.setData({
          list: arr
        })
        wx.setStorageSync('msg', arr)
        console.log(arr,that.data.list);
        // that.data.list=arr;
      })

    }
    var options = {
      'isAccessFormalEnv': true,
      'isLogOn': false
    };
    webim.login(loginInfo, listeners, options, function (resp) {
      loginInfo.identifierNick = resp.identifierNick; //设置当前用户昵称
      loginInfo.headurl = resp.headurl;
      wx.setStorageSync('loginInfo', loginInfo)
      console.log("登陆陈宫")
      // that.getChatInfo();

    }, function (err) {
      console.log("登录失败---", err, err.ErrorInfo)
    })
  },
  convertTextMsgToHtml: function (content) {
    return content.getText();
  },
  time: function (msgTime) {
    //得到当天凌晨的时间戳
    var timeStamp = new Date(new Date().setHours(0, 0, 0, 0)) / 1000;
    var thisdate;
    var d = new Date(msgTime * 1000); //根据时间戳生成的时间对象
    var min = d.getMinutes();
    var hour = d.getHours();
    //得到时和分，分小于10时，只返回一位数
    if (min < 10) {
      min = "0" + min;
    }
    //得到月份和天  月份一般是从0开始，所以展示出来要+1
    var month = d.getMonth();
    var day = d.getDate();
    //得到时间   当天时间应该只显示时分  当天以前显示日期+时间
    if (timeStamp > msgTime) {
      thisdate = ((month + 1) + '-' + day + ' ' + hour + ":" + min);
    } else {
      thisdate = (hour + ":" + min);
    }
    return thisdate;
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