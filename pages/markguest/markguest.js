// pages/markguest/markguest.js
var app=getApp().globalData;
const api = require("../../utils/api");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    comid: null,
    comname: '',
    btninfo: ['有过合作', '正在合作', '有过跟进','正在跟进'],
    activeBtn: 0,
    activebtn: 0,
    show: false
  },
  toPath: function(e){
    var that=this;
    var has = this.data.activebtn;
    var data = {
      thSessionId: wx.getStorageSync('token'),
      userid: wx.getStorageSync('userid'),
      comid: this.data.comid,
      comname: this.data.comname,
      relation: this.data.activeBtn,
      hasdecision: has,
      nickname: wx.getStorageSync('userInfo').nickName
    }
    this.changestate();
    api.markguest(data, function (result){
      console.log(result)
      that.setData({
        show: false
      })
      if(result.data.length>1&&result.data.userid!=that.data.comid){
        wx.navigateTo({
          url: `/pages/marklock/marklock?id=${that.data.comid}&comname=${that.data.comname}`,
        })
      }else{
        wx.redirectTo({
          url: `/pages/markerror/markerror?comid=${that.data.comid}&comname=${that.data.comname}`,
        })
      }
    })
  },
  changestate: function(){
    this.setData({
      show: true
    })
    wx.setNavigationBarTitle({
      title: '匹配搜索'
    })
  },
  changeBtn: function(e){
    this.setData({
      activeBtn: e.currentTarget.dataset.index
    })
    if (e.currentTarget.dataset.index == 1) {
      this.setData({
        activebtn: 0
      })
    }
  },
  changebtn: function (e) {
    this.setData({
      activebtn: e.currentTarget.dataset.index
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    this.init(options.id,this)
  },
  init: function (id, that) {
    var data = {
      comid: id,
      thSessionId: wx.getStorageSync('token'),
    }

    api.getnamecom(data, function (result) {
      that.setData({
        comid: result[0].comid,
        comname: result[0].comname
      })
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
  onShareAppMessage: function () {
  
  }
})