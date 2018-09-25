var webim = require('./webim.js');
var selSess, loginInfo, selSessHeadUrl;
var selType = webim.SESSION_TYPE.C2C;
var selToID;
var Config = {
  sdkappid: 1400133429,
  accountType: 36684,
  accountMode: 0 
};
const login = {
  login: function (userid, selToID, currentMsgsArray,callback,success) {
    var _this=this;
    selToID = selToID;
    //用户信息对象
    loginInfo = {
      'sdkAppID': Config.sdkappid,
      'appIDAt3rd': Config.sdkappid,
      'identifier': wx.getStorageSync("userid"),
      'identifierNick': wx.getStorageSync("userInfo").nickName, 
      'accountType': Config.accountType,
      'userSig': wx.getStorageSync("userSig")
    }

    //事件回调对象 监听事件
    var listeners = {
      "onConnNotify": onConnNotify //监听连接状态回调变化事件,必填
        ,
      "onMsgNotify": onMsgNotify //监听新消息(私聊，普通群(非直播聊天室)消息，全员推送消息)事件，必填
    };
    //监听连接状态回调变化事件
    var onConnNotify = function(resp) {
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
    //newMsgList 为新消息数组，结构为[Msg]
    function onMsgNotify(newMsgList) {
      console.log("检测一下是否有新的消息",newMsgList)
      
      var sess, newMsg, selSess;
      //获取所有聊天会话
      var sessMap = webim.MsgStore.sessMap();

      for (var j in newMsgList) { //遍历新消息
        newMsg = newMsgList[j];
        if (newMsg.getSession().id() == selToID) { //为当前聊天对象的消息
          selSess = newMsg.getSession();
          //在聊天窗体中新增一条消息
          _this.addMsg(newMsg,currentMsgsArray,callback);
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
      var msgContent = convertTextMsgToHtml(content);
      var list = {
        id: sess.id(),
        unread: sess.unread(),
        msgContent: msgContent,
        time: _this.time(sess.time())
      }
      var arr=[];
      if (wx.getStorageSync("msg")){
        arr = wx.getStorageSync("msg")
      }else{
        arr.push(list)
      }
      for(var i=0;i<arr.length;i++){
        if(arr[i].id==list.id){
          console.log(arr[i].id,list.id)
          arr.splice(i,1)
          console.log(arr,arr.splice(i,1))
          arr.unshift(list)
          break;
        }else{
          arr = arr ? arr : [];
          arr.unshift(list)
          break;
        }
      }
      wx.setStorageSync("msg",arr);
    }
    var options = {
      'isAccessFormalEnv': true,
      'isLogOn': false
    };
    webim.login(loginInfo, listeners, options, function(resp) {
      console.log("登录成功",resp);
      loginInfo.identifierNick = resp.identifierNick; //设置当前用户昵称
      loginInfo.headurl = resp.headurl;
      wx.setStorageSync('loginInfo', loginInfo)
      if(callback){
        callback();
      }
    }, function(err) {
      console.log("登录失败---", err, err.ErrorInfo)
    })
  },
  time: function(msgTime){
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
  updateSessDiv: function(type1,id){
    // var sessMap = webim.MsgStore.sessMap();
    // console.log(id);
    // sessMap[id].unread();
  },
  addMsg: function (newMsg, currentMsgsArray, callback) {
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
            convertMsg(msg,currentMsgsArray, callback); //解析方法
            break;
        }
        break;
    }
  },

  getChat: function (options,currentMsgsArray, callback) {
    var _this = this;    
    var selSess = null;
    webim.getC2CHistoryMsgs(
      options,
      function(resp) {
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
          if (msg.getSession().id() == options.Peer_Account) { //为当前聊天对象的消息
            selSess = msg.getSession();
            //在聊天窗体中新增一条消息
            _this.addMsg(msg, currentMsgsArray, callback)
          }
        }
        //消息已读上报，并将当前会话的消息设置成自动已读
        webim.setAutoRead(selSess, true, true);
      },
      function(err) {
        console.log("----------" + err.ErrorInfo + err.ErrorCode);
      }
    )
  },
  //获取消息内容---ok
  SendMsg: function (msg, userid,currentMsgsArray,callback) {
    var _this=this;
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

    webim.sendMsg(msg, function(resp) {
      if (selType == webim.SESSION_TYPE.C2C) { //私聊时，在聊天窗口手动添加一条发的消息，群聊时，长轮询接口会返回自己发的消息
        _this.addMsg(msg, currentMsgsArray, callback);
      }
      // webim.Log.info("发消息成功");
      // callback && callback();
    }, function(err) {
      webim.Log.error("发消息失败:" + err.ErrorInfo);
      console.error("发消息失败:" + err.ErrorInfo);
    });
  },
}
const getHeader=function(){
  var tag_list = new Array();
  tag_list.push("Tag_Profile_IM_Nick");
  tag_list.push("Tag_Profile_IM_Image");
  var options = {};
  var account = new Array();
  var userId = selSess.getFromAccount();
  account.push(userId);
  options.To_Account = account;
  options.TagList = tag_list;
  //现目前只记起这种书写方式 --！然后
  console.log(options+"获取头像----------");

  webim.getProfilePortrait(
    options,
    function (res) {
      //这里面的数据就是用户的资料了，当然是获得的你所写了的资料
      var UserProfileItem = res.UserProfileItem;
      //嗯，是个数组
      var C2cNick, C2cImage;
      for (var i = 0; i < UserProfileItem.length; i++) {
        var data = UserProfileItem[i].ProfileItem;
        C2cNick = data[0].Value;
        C2cImage = data[1].Value;
      }
    })
}
const convertMsg = function (msg, currentMsgsArray,callback) {
  var elems, elem, type, content, isSelfSend;
  var loginInfo = wx.getStorageSync("loginInfo"); //自己的资料
  console.log(loginInfo);

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
          currentMsg.avatarUrl = loginInfo.headurl;
        } else {
          // currentMsg.avatarUrl = friendInfo.src;
        }
        //然后将每一条聊天消息push进数组
        currentMsgsArray.push(currentMsg);
        if(callback){
          callback(currentMsgsArray);
        }
        break;
    }
  }
}

const convertTextMsgToHtml= function(content) {
  return content.getText();
}

module.exports = login