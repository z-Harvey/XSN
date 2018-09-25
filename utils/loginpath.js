var webim = require('./webim.js');
var selSess, loginInfo, selSessHeadUrl;
var selType = webim.SESSION_TYPE.C2C;
var selToID;
const login = {
  login: function (that, nickName, userid, selToID, currentMsgsArray, callback, call) {
    selToID = selToID;
    var Config = {
      sdkappid: 1400133429,
      accountType: 36684,
      accountMode: 0 //帐号模式，0-表示独立模式，1-表示托管模式
    };

    //用户信息对象
    loginInfo = {
      'sdkAppID': Config.sdkappid,
      'appIDAt3rd': Config.sdkappid,
      'identifier': userid,
      'identifierNick': nickName, //用户昵称
      'accountType': Config.accountType,
      'userSig': 'eJw9j9tqg0AQQH8l*NrS7hVqoQ8hERqjkOYG3RfZuKsZkui6rjG29N*DFvM458CcmV9vG21epDGgEukSapX3PvG858nAa8j7MQ52s8XXDJXiYk8m3jdRkB0lyPBNdDg-XKdn8bnKzt8HEcJ6s3Xz6SKP6y5KW-*V2vkyeAqq5vYT1ut8F6yWQpiWV0ch*V6Rqm0-xhwoXTjIQNu*SvnIZZqWTeES1xndGzSKq7Y1lEXPCMIcE8Qep6tTMrzVS8wQwpQy4o9a3wxYncjM-ccI9wlCj8UOLkMJc8oZx8zn3t8dm8hYgw__',
    }

    //事件回调对象 监听事件
    var listeners = {
      "onConnNotify": onConnNotify //监听连接状态回调变化事件,必填
      ,
      "onMsgNotify": onMsgNotify //监听新消息(私聊，普通群(非直播聊天室)消息，全员推送消息)事件，必填
    };
    //监听连接状态回调变化事件
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

    //监听新消息事件 注：其中参数 newMsgList 为 webim.Msg 数组，即 [webim.Msg]。
    //newMsgList 为新消息数组，结构为[Msg]
    function onMsgNotify(newMsgList) {
      var sess, newMsg, selSess;
      //获取所有聊天会话
      var sessMap = webim.MsgStore.sessMap();
      for (var j in newMsgList) { //遍历新消息
        newMsg = newMsgList[j];
        if (newMsg.getSession().id() == selToID) { //为当前聊天对象的消息
          selSess = newMsg.getSession();
          //在聊天窗体中新增一条消息
          console.log('增加的新消息--------' + newMsg);
          // addMsg(newMsg,that);
          addMsg(newMsg, that, currentMsgsArray, callback);
        }
      }
      //消息已读上报，以及设置会话自动已读标记
      webim.setAutoRead(selSess, true, true);
      for (var i in sessMap) {
        sess = sessMap[i];
        if (selToID != sess.id()) { //更新其他聊天对象的未读消息数
          updateSessDiv(sess.type(), sess.id(), sess.unread());
        }
      }
    }
    var options = {
      'isAccessFormalEnv': true,
      'isLogOn': false
    };
    webim.login(loginInfo, listeners, options, function (resp) {
      console.log("登录成功");
      console.log(resp, '-------------------')
      loginInfo.identifierNick = resp.identifierNick; //设置当前用户昵称
      call();
    }, function (err) {
      console.log("登录失败---", err, err.ErrorInfo)
    })
  },
  

  getChat: function (options, that) {
    var options = options;
    console.log(options);

    var selSess = null;
    webim.getC2CHistoryMsgs(
      options,
      function (resp) {
        console.log(resp, "获取聊天----------------");
        var complete = resp.Complete;
        if (resp.MsgList.length == 0) {
          return
        }
        //拉取消息后，要将下一次拉取信息所需要的东西给存在缓存中
        wx.setStorageSync('lastMsgTime', resp.LastMsgTime);
        wx.setStorageSync('msgKey', resp.MsgKey);
        var msgList = resp.MsgList;

        for (var j in msgList) { //遍历新消息
          var msg = msgList[j];
          if (msg.getSession().id() == "35") { //为当前聊天对象的消息
            selSess = msg.getSession();
            //在聊天窗体中新增一条消息
            addMsg(msg, that, currentMsgsArray, callback)
          }
        }
        //消息已读上报，并将当前会话的消息设置成自动已读
        webim.setAutoRead(selSess, true, true);
      },
      function (err) {
        console.log("--------------------" + err.ErrorInfo + err.ErrorCode);
      }
    )
  },
  SendMsg: function (msg, userid, that, currentMsgsArray, callback) {
    //获取消息内容
    var selSess = new webim.Session(webim.SESSION_TYPE.C2C, userid);
    var msgtosend = msg;
    var msgLen = webim.Tool.getStrBytes(msg);

    if (msgtosend.length < 1) {
      console.error("发送的消息不能为空!");
      return;
    }

    var maxLen, errInfo;
    if (selType == webim.SESSION_TYPE.GROUP) {
      maxLen = webim.MSG_MAX_LENGTH.GROUP;
      errInfo = "消息长度超出限制(最多" + Math.round(maxLen / 3) + "汉字)";
    } else {
      maxLen = webim.MSG_MAX_LENGTH.C2C;
      errInfo = "消息长度超出限制(最多" + Math.round(maxLen / 3) + "汉字)";
    }
    if (msgLen > maxLen) {
      console.error(errInfo);
      return;
    }

    if (!selSess) {
      selSess = new webim.Session(selType, selToID, selToID, selSessHeadUrl, Math.round(new Date().getTime() / 1000));
    }
    var isSend = true; //是否为自己发送
    var seq = -1; //消息序列，-1表示sdk自动生成，用于去重
    var random = Math.round(Math.random() * 4294967296); //消息随机数，用于去重
    var msgTime = Math.round(new Date().getTime() / 1000); //消息时间戳
    var subType; //消息子类型

    if (subType == webim.SESSION_TYPE.C2C) {
      subType = webim.C2C_MSG_SUB_TYPE.COMMON;
    }
    var msg = new webim.Msg(selSess, isSend, seq, random, msgTime, loginInfo.identifier, subType, loginInfo.identifierNick);
    var text_obj, face_obj, tmsg, emotionIndex, emotion, restMsgIndex;

    var expr = /\[[^[\]]{1,3}\]/mg;
    var emotions = msgtosend.match(expr);

    if (!emotions || emotions.length < 1) {
      text_obj = new webim.Msg.Elem.Text(msgtosend);
      msg.addText(text_obj);
    }

    webim.sendMsg(msg, function (resp) {
      if (selType == webim.SESSION_TYPE.C2C) { //私聊时，在聊天窗口手动添加一条发的消息，群聊时，长轮询接口会返回自己发的消息
        addMsg(msg, that, currentMsgsArray, callback);
      }
      // webim.Log.info("发消息成功");
      // callback && callback();
    }, function (err) {
      webim.Log.error("发消息失败:" + err.ErrorInfo);
      console.error("发消息失败:" + err.ErrorInfo);
    });
  },
}

const convertMsg = function (msg, that, currentMsgsArray, callback) {
  var elems, elem, type, content, isSelfSend;
  var loginInfo = loginInfo; //自己的资料
  var friendInfo = loginInfo; //对方的资料，这里要特别注意一下，消息里面是不会返回双方的头像和昵称的，只能通过指定的方法得到。
  elems = msg.getElems();
  isSelfSend = msg.getIsSend(); //消息是否为自己发的 true是自己发送，
  var sess = msg.sess;
  var currentMsg = {}; //设置消息数组，存消息
  var currentMsgsArray = currentMsgsArray;
  var allChatList = [];
  for (var i in elems) {
    elem = elems[i];
    type = elem.getType();
    content = elem.getContent();
    switch (type) {
      case webim.MSG_ELEMENT_TYPE.TEXT:
        var msgContent = convertTextMsgToHtml(content);
        var msgTime = msg.getTime(); //得到当前消息发送的时间
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
        currentMsg.msgContent = msgContent; //当前消息的内容
        currentMsg.msgTime = thisdate;
        currentMsg.isSelfSend = isSelfSend;
        //根据是否自己发送的消息，设置双方的头像
        if (isSelfSend) {
          // currentMsg.avatarUrl = loginInfo.headurl;
        } else {
          // currentMsg.avatarUrl = friendInfo.src;
        }
        //然后将每一条聊天消息push进数组
        currentMsgsArray.push(currentMsg);
        if (callback) {
          callback(currentMsgsArray);
        }
        // that.setData({
        //   currentMsgsArray: currentMsgsArray,
        // })
        break;
    }
  }
}

const convertTextMsgToHtml = function (content) {
  return content.getText();
}

const addMsg = function (newMsg, that, currentMsgsArray, callback) {
  var msg = newMsg;

  var fromAccount, fromAccountNick, sessType, subType;
  fromAccount = msg.getFromAccount();
  if (!fromAccount) {
    fromAccount = '';
  }
  fromAccountNick = msg.getFromAccountNick();
  if (!fromAccountNick) {
    fromAccountNick = fromAccount;
  }
  //解析消息
  //获取会话类型
  //webim.SESSION_TYPE.GROUP-群聊，
  //webim.SESSION_TYPE.C2C-私聊，
  sessType = webim.SESSION_TYPE.C2C;
  subType = msg.getSubType();
  subType = 0;

  switch (sessType) {
    case webim.SESSION_TYPE.C2C: //私聊消息
      switch (subType) {
        case webim.C2C_MSG_SUB_TYPE.COMMON:
          convertMsg(msg, that, currentMsgsArray, callback); //解析方法
          break;
      }
      break;
  }
}

module.exports = login