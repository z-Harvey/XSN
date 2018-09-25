// pages/rewardinfo/rewardinfo.js
var wxapi = require('../../utils/wxapi.js');
var api = require('../../utils/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: 0,
    userinfo: null,
    mytype: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.myid==wx.getStorageSync("userid")){
      this.setData({
        blockThisUser:true
      })
    }
    // options.id=3;
    var commondata = {
      thSessionId: wx.getStorageSync("token"),
      userid: wx.getStorageSync("userid"),
      recid: options.id
    }
    this.setData({
      recid: options.id,
      nickname: wx.getStorageSync("userInfo").nickName
    })
    if (options.type){
      this.setData({
        mytype: options.type
      })
    }
    console.log(options.type,this.data.mytype)
    this.init(commondata);
  },
  init: function (data){
    //悬赏的请求--我的悬赏详情接口
    var that = this;
    api.myrewardinfo(data, function (result) {
      console.log(result)
      that.setData({
        list: result
      })
    })
  },
  toPath: function(e){
    var data=e.currentTarget.dataset,url;
    if(data.type==3){
      url='/pages/index/index';
      wx.reLaunch({
        url: url,
      })
    }
  },
  onclick: function (e) {
    var that=this;
    var data = e.currentTarget.dataset;
    if (data.type == 1) {
      // 在这里要判断一下是否为好友关系？？
      var data = {
        userid: list.id,
        thSessionId: wx.getStorageSync('token')
      }
      api.getfriendimg(data, function (res) {
        if(result.data.lenght>0){
          url = "/pages/dialogInfo/dialogInfo?id=${data.id}&src=${data.src}"
        }else{
          that.alert();
        }
      })
      
    } else if (data.type == 2 ||data.type==3) {
      url = "/pages/dialogInfo/dialogInfo?id=${data.id}&src=${data.src}"
    }
    
  },
  alert: function () {
    var _this = this;
    var str = "是否确认与他组队？组队成功后双方自动成为好友关系，可在名片夹中查看对方的名片信息~"
    wxapi.dialog('组队提示', str, '', '', function () {
      wx.navigateTo({
        url: '/pages/mygroupsuccess/mygroupsuccess',
      })
    }, function () {
      
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
  onShareAppMessage: function (res) {
    if (res.target.id == 2) {
      return {
        title: `【${this.data.list.nickname}@你】邀你组队联合打单，${this.data.list.minmoney}元佣金等你来拿~~`,
        path: `/pages/reward/reward?id=${this.data.recid}&userid=${wx.getStorageSync('userid')}`
      }
    }
  }
})