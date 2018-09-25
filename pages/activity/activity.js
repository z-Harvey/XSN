// pages/activity/activity.js
const api = require("../../utils/api");
var wxapi = require('../../utils/wxapi.js');
const Util = require('../../utils/util')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    state: null
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('------------------------------')
    console.log(options)
    this.setData({
      id: options.id,
      typea: options.type
    })
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
            if (result.code == 2) {
              console.log("未注册")
              wx.setStorageSync("token", result.data.thSessionId)
              wx.setStorageSync('userid', '')
            }else{
              wx.setStorageSync("token", result.data.thSessionId)
              wx.setStorageSync('userid', result.data.userid)
            }
            wx.setStorageSync('logincode', result.code)
            if (options.type == 1) {
              this.init(options.id)
            } else {
              this.ini(options.id)
            }
          }
        })
      }
    })
    
  },
  computeTime: function (year, month, day, hour, minute, second){
      var leftTime = (new Date(year, month - 1, day, hour, minute, second)) - (new Date()); 
      var days = parseInt(leftTime / 1000 / 60 / 60 / 24, 10); 
      var hours = parseInt(leftTime / 1000 / 60 / 60 % 24, 10); 
      var minutes = parseInt(leftTime / 1000 / 60 % 60, 10);
      var seconds = parseInt(leftTime / 1000 % 60, 10);
      // console.log(hours,minutes)
    days = this.checkTime(days) > 0 ? this.checkTime(days)+"天":'';
    hours = this.checkTime(hours) > 0 ? this.checkTime(hours) + "小时" : '';
    minutes = this.checkTime(minutes) > 0 ? this.checkTime(minutes) + "分" : '';
    seconds = this.checkTime(seconds) > 0 ? this.checkTime(seconds) + "秒" : '';
      
      var str = days + hours  + minutes + seconds;
      this.setData({
        time: str
      })
      console.log(str,this.data.time)
  },
  checkTime: function(i) { 
    if (i < 10) {
      i = "0" + i;
    }
    return i;
  }, 
  init: function(actid){
    var that=this;
    var data = {
      thSessionId: wx.getStorageSync("token"),
      userid: wx.getStorageSync("userid"),
      actid: actid,
      type: this.data.typea
    }
    api.activity(data, function (result){
      console.log(result);
      that.setData({
        detail: result.act_details[0],
        iconnun: result.niubnum,
        activitytime: result.act_details[0].activitytime.split("|"),
        signuptime: result.act_details[0].signuptime.split("|"),
        totalicon: result.act_details[0].price,
        issignup: result.issignup
      })   
      if (result.act_details[0].aci_status==1){
        var signtime = that.data.signuptime[0];
        var day = signtime.split(" ");
        var date = day[0];
        var time = day[1];
        var year = date.split("-")[0];
        var month = date.split("-")[1];
        var dayy = date.split("-")[2];

        var hour = time.split(":")[0];
        var minute = time.split(":")[1];
        var second = time.split(":")[2];

        setInterval(function () {
          that.computeTime(year, month, dayy, hour, minute, second);
        }, 1000); 
      }
    })
  },
  ini: function (actid) {
    var that = this;
    var data = {
      thSessionId: wx.getStorageSync("token"),
      userid: wx.getStorageSync("userid"),
      actid: actid,
      type: this.data.typea
    }
    that.setData({
      data:data
    })
    api.activity(data, function (result) {
      console.log(result, '活动详情');
      that.setData({
        detail: result.act_details,
      })
    })
  },
  totop: function(){
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  signUp: function(){
    if (this.data.iconnun>this.data.totalicon){
      this.confirm()
    }else{
      this.close();
    }
  },
  confirm: function(){
    var _this = this;
    var str = `确认报名参加活动并支付${this.data.totalicon}牛币?`;
    wxapi.dialog('', str, '', '', function () {
      console.log("确认支付牛币")
      _this.success(_this);
    }, function () {
    })
  },
  success: function(that){
    var data = {
      thSessionId: wx.getStorageSync("token"),
      userid: wx.getStorageSync("userid"),
      actid: that.data.id,
      changeno: that.data.totalicon
    }
    console.log(data);
    api.activitysign(data,function(result){
      console.log(result)
      if(result.code==0){
        wx.navigateTo({
          url: `/pages/register/register?id=${that.data.id}&type=${that.data.typea}` ,
        })
      }
    })
  },
  close: function () {
    var _this = this;
    var str = `抱歉，牛币不足，快去福利中心领牛币，再来报名吧~`;
    wxapi.dialog('', str, '取消', '领牛币', function () {
      wx.navigateTo({
        url: '/pages/welfare/welfare',
      })
    }, function () {
      
    })
  },
  isState: function(){
    // 活动倒计时
    var date=new Date();

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
    return {
      title: `活动分享`,
      path: `/pages/activity/activity?id=${this.data.id}&type=${this.data.typea}`
    }
  }
})