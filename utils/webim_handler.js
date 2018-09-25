const webim={
  onSendMsg: function (msg, callback){
    console.log(msg);
    Send = true; //是否为自己发送
    var seq = -1; //消息序列，-1表示 SDK 自动生成，用于去重
    var random = Math.round(Math.random() * 4294967296); //消息随机数，用于去重
    var msgTime = Math.round(new Date().getTime() / 1000); //消息时间戳
    var subType; //消息子类型
    if (subType == webim.SESSION_TYPE.C2C) {
      subType = webim.C2C_MSG_SUB_TYPE.COMMON;
    }
    var msg = new webim.Msg(selSess, isSend, seq, random, msgTime, loginInfo.identifier, subType, loginInfo.identifierNick);
    var text_obj, face_obj, tmsg, emotionIndex, emotion, restMsgIndex;
    //解析文本和表情
    var expr = /\[[^[\]]{1,3}\]/mg;
    var emotions = text_content.match(expr);

    if (!emotions) {
      text_obj = new webim.Msg.Elem.Text(text_content);
      msg.addText(text_obj);
    }

    webim.sendMsg(msg, function (resp) {
      if (selType == webim.SESSION_TYPE.C2C) {
        that.addMsg(msg);//这个方法上面有
        console.log("发送成功")
        if(callback){
          callback()
        }
      }
    }, function (err) {
      console.log(err.ErrorInfo);
    })
  }
  
  
}

module.exports=webim;