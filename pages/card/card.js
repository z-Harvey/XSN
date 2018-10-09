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
    work: '',
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
    var _this=this;
    wx.hideShareMenu()
    if(options.typea){
      this.setData({
        typea: options.typea
      })
    }
    var userInfo = wx.getStorageSync('userInfo');
    var data = {
      thSessionId: wx.getStorageSync('token'),
      userid: wx.getStorageSync("userid")
    }
    api.mycard(data, function (result) {
      console.log('名片制作页面', result[0])
      var product = result[0].product ? result[0].product.split(",") : '';
      var region = result[0].address ? result[0].address.split("|")[0] : '';
      var address = result[0].address ? result[0].address.split("|")[1] : '';
      _this.setData({
        list: result[0],
        name: result[0].name,
        comname: result[0].comname,
        work: _this.data.work || result[0].work,
        gender: result[0].gender,
        src: result[0].avatarurl,
        nickname: result[0].nickname,
        workcard: result[0].position,
        phone: result[0].phoneno
      })
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
  save: function(){
    var that=this;
    if (vail.empty(this.data.comname, "您的公司名字") && vail.empty(this.data.work, "您的行业") && vail.empty(this.data.workcard, "您的职位")){
      var data = {
        thSessionId: wx.getStorageSync("token"),
        nickname: this.data.nickname,
        comname: this.data.comname,
        gender: this.data.gender,
        avatarurl: this.data.src,
        work: this.data.work,
        phoneno: this.data.phone,
        position: this.data.workcard,
        userid: wx.getStorageSync("userid")
      }
      api.saveCardUpdate(data, function (result) {
        console.log(result,'-----------');
        // wx.clearStorage();
        if(result.code==0){
          console.log("code 0",that.data.typea)
          wx.navigateBack({
            detail: 2
          })
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