// pages/card/card.js
const api = require("../../utils/api");
const vail = require("../../utils/vail");
var demoNoSdk = require('../../utils/demo-no-sdk.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo:null,
    comname: '',
    work: '选择你的行业/职能',
    phone: null,
    workcard: ''
  },
  changework: function(e){
    this.setData({
      workcard: e.detail.value
    })
  },
  changegender: function (e) {
    this.setData({
      gender: e.currentTarget.dataset.id
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    if(options.typea){
      this.setData({
        typea: options.typea
      })
    }
    var userInfo = wx.getStorageSync('userInfo');
    // this.setData({
    //   userInfo: wx.getStorageSync('userInfo'),
    //   phone: wx.getStorageSync('phone'),
    //   gender: userInfo.gender||1,
    //   nickname: userInfo.nickName||'nickname',
    //   src: userInfo.avatarUrl||'ddjdjd'    
    // })

    this.setData({
      userInfo: wx.getStorageSync('userInfo'),
      phone: wx.getStorageSync('phone'),
      gender: userInfo.gender,
      nickname: userInfo.nickName,
      src: userInfo.avatarUrl
    })
  },
  changenickname: function (e) {
    this.setData({
      nickname: e.detail.value
    })
  },
  inputComname: function(e){
    this.setData({
      comname: e.detail.value
    })
  },
  toPath: function(){
    wx.navigateTo({
      url: `/pages/basic/industry/industry?comname=${this.data.comname}`,
    })
  },
  // upload: function () {
  //   var _this = this;
  //   demoNoSdk('用户id', function (res, bucket, path) {
  //     _this.setData({
  //       proveurl: res,
  //       src: res
  //     })
  //   })
  // },
  save: function(){
    var that=this;
    if (vail.empty(this.data.comname, "您的公司名字") && vail.empty(this.data.work, "您的行业") && vail.empty(this.data.workcard, "您的职位")){
      var data = {
        thSessionId: wx.getStorageSync("token"),
        comname: this.data.comname,
        work: this.data.work,
        nickname: this.data.nickname,
        phoneno: this.data.phone,
        gender: this.data.gender,
        avatarurl: this.data.src,
        position: this.data.workcard
      }
      api.saveCard(data, function (result) {
        console.log(result,'-----------');
        // wx.clearStorage();
        wx.setStorageSync("userid",result.data.userid)
        wx.setStorageSync("UserSig", result.data.UserSig)
        wx.setStorageSync("import_status", result.data.import_status)
        wx.setStorageSync("register_status", new Date());
        wx.setStorageSync("logincode",result.data.userid);
      
        if(result.code==0){
          console.log("code 0",that.data.typea)
          wx.navigateBack({
            detail: 1
          })
          // wx.switchTab({
          //   url: `/pages/index/index`,
          // })
          // if (that.data.typea){
          //   console.log("1111111111")
          //   wx.switchTab({
          //     url: `/pages/index/index`,
          //   })
          // }else{
            
          // }
          // wx.navigateTo({
          //   url: '/pages/dayname/dayname',
          // })
        }
      });
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    let pages = getCurrentPages();
    let currPage = pages[pages.length - 1];
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