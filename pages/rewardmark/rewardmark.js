// pages/markguest/markguest.js
var app=getApp().globalData;
const api = require("../../utils/api");
var wxapi = require('../../utils/wxapi.js');
const vail = require("../../utils/vail");

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
      nickname: wx.getStorageSync('userInfo').nickName,
      recid: this.data.recid,
      puserid: this.data.puserid
    }
    console.log(data,'未标记时调用')
    api.getrecruitsign(data, function (result){
      //如果标记成功，则弹框
      if (result.code==0){
        that.showModal();
      }
    })
  },
  showModal: function(){
    wx.showModal({
      title: '提交成功',
      content: '您的组队申请已发送至助力发起者，请耐心等待助力结果~',
      confirmText:'我的助力',
      cancelText: '助力详情',
      success: function (e) {
        if (e.cancel){
          wx.navigateTo({
            url: `/pages/reward/reward?id=${this.data.recid}&myid=${wx.getStorageSync('userid')}&myname=${wx.getStorageSync("my_user_name")}`,
          })
        }else{
          // 需要传递返回的数据
          wx.navigateTo({
            url: `/pages/myreward/myreward`,
          })
        }
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
    if(options.id&&options.puserid){
      this.setData({
        recid: options.id,
        puserid: options.puserid
      })
    }
    if (!vail.empty(wx.getStorageSync('token')) && !vail.empty(wx.getStorageSync('userid'))) { 
      wx.showModal({
        title: '',
        content: '请您先登陆',
        showCancel: false,
        success: function () {
          wx.reLaunch({
            url: '/pages/login/login',
          })
        }
      })
    }else{
      if (options.comid && options.comname) {
        this.setData({
          comid: options.comid,
          comname: options.comname
        })
      }
      wx.showModal({
        title: '',
        content: '助力发起者需要通过您的标记信息来选择是否与您进行组队~请先进行企业标记~',
        showCancel: false,
        success: function () {

        }
      })
    }
    
  },
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})