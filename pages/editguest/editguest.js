// pages/markguest/markguest.js
var app = getApp().globalData;
const api = require("../../utils/api");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    comid: null,
    comname: '',
    btninfo: ['有过合作', '正在合作', '有过跟进', '正在跟进'],
    activeBtn: null,
    activebtn: null,
  },
  toPath: function (e) {
    var that = this;
    var has = this.data.activebtn;
    var data = {
      thSessionId: wx.getStorageSync('token'),
      userid: wx.getStorageSync('userid'),
      comid: this.data.comid,
      comname: this.data.comname,
      relation: this.data.activeBtn,
      hasdecision: has
    }
    api.updateguest(data, function (result) {
      console.log(result)
      if (result.code==0) {
        wx.showLoading({
          title: '提交成功',
          success: function(){
            setTimeout(function(){
              wx.switchTab({
                url: '../my/my',
              })
              return
            },1000)
          }
        })
      }
    })
  },
  changeBtn: function (e) {
    this.setData({
      activeBtn: e.currentTarget.dataset.index
    })
    if (e.currentTarget.dataset.index==1){
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
    var that=this;
    if (options.comid) {
      var da = {
        userid: wx.getStorageSync('userid'),
        thSessionId: wx.getStorageSync('token'),
        comid: options.comid
      }
      api.checkmate(da, function (result) {
        console.log(result);
        that.setData({
          content: result.data.mate_info[0],
          comname: result.data.mate_info[0].comname,
          comid: result.data.mate_info[0].comid, 
          activebtn: result.data.mate_info[0].hasdecision,
          activeBtn: result.data.mate_info[0].relation            
        })
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})