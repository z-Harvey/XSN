// pages/my/my.js
const api = require('../../utils/api.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    userinfo: null,
  },
  showDialog() {
    this.selectComponent("#dialog").gits()
  },
  toPath: function (e) {
    var url;
    var data = e.currentTarget.dataset;
    if(data.type!=8){
      if(!wx.getStorageSync('userid')){
        this.showDialog();
        return
      }
    }
    //用于解决后期 分享时 出现 undefined 的情况
    wx.setStorageSync('my_user_name',this.data.list.nickname)
    if (data.type == 1) {
      url = `/pages/myreward/myreward?rec_status=${this.data.rec}`;
    } else if (data.type == 2) {
      url = `/pages/mygroup/mygroup?team_status=${this.data.team}`
    } else if (data.type == 3) {
      url = `/pages/myguest/myguest?guest_status=${this.data.guest}`
    } else if (data.type == 4) {
      url = `/pages/myactivity/myactivity?activity_status=${this.data.activity}`
    } else if (data.type == 5) {
      url = `/pages/welfare/welfare`
    } else if (data.type == 6) {
      url = `/pages/editcard/editcard`
    } else if (data.type == 7) {
      if ((data.order == 0 && data.num == 1) || (data.order == 1 && data.num == 1) ){
      url = `/pages/identy/identy?state=${data.num}`
      } else if (data.order == 1 || data.num == 4 || data.num == 2 || (data.order == 0 && data.num == 0)){
      url = `/pages/firstidenty/firstidenty?state=${data.num}`
      }
    } else if (data.type == 8) {
      url = "/pages/help/help"
    } else if (data.type == 0) {
      url = "/pages/peoplecard/peoplecard"
    }
    wx.navigateTo({
      url: url,
    })
  },
  getPhoneNumber: function (e) {
    if (e.detail.errMsg == 'getPhoneNumber:ok') {
    var that = this;
    var data = {
      thSessionId: that.data.loginInfo.token,
      iv: e.detail.iv,
      encryptedData: e.detail.encryptedData
    }
    api.bindTel(data, function (data) {
      let that=this;
      if (data.code == 0) {
        wx.setStorageSync('phone', data.data.phoneno);
        let obj={
          thSessionId: that.data.loginInfo.token,
          phoneno: data.data.phoneno
        }
        api.bindTelCallUserImg(obj,function(res){
          res.data['Sign_in'] = true;
          that.setData({
            list: res.data
          })
          wx.setStorageSync('userid', res.data.userid);
          wx.setStorageSync('UserSig', res.data.UserSig);
        })
        //跳转到名片编辑页面
        // wx.navigateTo({
        //   url: '/pages/card/card',
        // })
      } else {
        wx.showModal({
          title: "系统提示",
          content: data.msg,
        })
      } 
    });
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    let obj = new Object();
    obj['avatarurl'] = '/img/my/noneSign.png';
    obj['nickname'] = '未登录';
    obj['Sign_in'] = false;
    this.setData({
      list: obj,
      userInfo: wx.getStorageSync("userInfo"),
      loginInfo: wx.getStorageSync("loginInfo")
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let _this=this;
    if (wx.getStorageSync("userid")) {
      let loginInfo=wx.getStorageSync('loginInfo')
      let data={
        thSessionId: loginInfo.token,
        userid: loginInfo.userid
      }
      _this.init(data)
      // let userInfo = wx.getStorageSync('userInfo')
      // userInfo['Sign_in'] = true;
      // _this.setData({
      //   list: userInfo,
      //   rec: userInfo.rec_status,
      //   team: userInfo.team_status,
      //   guest: userInfo.comid_status,
      //   activity: userInfo.actid_status,
      //   rec_status: _this.changestate(userInfo.rec_status, 'rec', 'myrec'),
      //   team_status: _this.changestate(userInfo.team_status, 'team', 'myteam'),
      //   guest_status: _this.changestate(userInfo.comid_status, 'guest', 'myguest'),
      //   activity_status: _this.changestate(userInfo.actid_status, 'activity', 'myactivity'),
      // })
    }else{
      let obj = new Object();
      obj['avatarurl'] = '/img/my/noneSign.png';
      obj['nickname'] = '未登录';
      obj['Sign_in'] = false;
      this.setData({
        list: obj
      })
    }
  },
  changestate: function(data,cat,mycat){
    var data1=cat+'_status';
    if(data==wx.getStorageSync(data1)){
      return false
    }else{
      return true
    }
  },
  init: function(data){
    var that=this;
    api.getmyinfo(data,function(res){
      res.data['Sign_in']=true
      that.setData({
        list: res.data,
        rec: res.data.rec_status,
        team: res.data.team_status,
        guest: res.data.comid_status,
        activity: res.data.actid_status,
        rec_status: that.changestate(res.data.rec_status,'rec','myrec'),
        team_status: that.changestate(res.data.team_status, 'team', 'myteam'),
        guest_status: that.changestate(res.data.comid_status, 'guest', 'myguest'),
        activity_status: that.changestate(res.data.actid_status, 'activity', 'myactivity'),
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
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
  
  },
  sign_in:function(e){

  }  
})