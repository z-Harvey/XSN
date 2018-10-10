// pages/myreward/myreward.js
var api = require('../../utils/api.js');
var commondata = null;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    activeId: 0,
    page: 1,
    listNone:false,
    redBotOne:false,
    redBotTwo:false,
    myrewardinfo:new Array(),
    inmyrewardinfo:new Array()
  },
  activeTab: function (e) {
    this.setData({
      activeId: e.currentTarget.dataset.index,
    })
    if (this.data.activeId == 0) {
      this.init(commondata);
    } else {
      this.release(commondata)
    }
  },
  toPath: function(e) {
    if(e.currentTarget.dataset.type==='navHome'){
      wx.switchTab({
        url: "../index/index"
      })
      return
    }
    if(e.currentTarget.dataset.redtype==="One"){
      this.setData({
        redBotOne: false
      })
    } else if (e.currentTarget.dataset.redtype === "Two"){
      this.setData({
        redBotTwo: false
      })
    }
    wx.navigateTo({
      url: `/pages/rewardin/rewardin?id=${e.currentTarget.dataset.id}&type=${e.currentTarget.dataset.type}&puserid=${e.currentTarget.dataset.userid}`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('----------------')
    wx.hideShareMenu()
    wx.setStorageSync('rec_status', options.rec_status)
    commondata = {
      thSessionId: wx.getStorageSync("token"),
      userid: wx.getStorageSync("userid"),
      page_num: this.data.page
    }
    this.init(commondata);
  },
  init: function(data,bur) {
    var that = this;
    let num = wx.getStorageSync('redBotOne')
    api.myreward(data, function(result) {
      if ( num < result.length){
          that.setData({
            redBotOne: true
          })
        }else{
        if (num) {
          that.setData({
            redBotOne: false
          })
          }else{
          that.setData({
            redBotOne: true
          })
          }
        }
        wx.setStorageSync('redBotOne', result.length)
        if(result){
          that.setData({
            myrewardinfo: !bur ? result : that.data.myrewardinfo.concat(result),
            myrecid: result[0] ? result[0].recid : ''
          })
        }
        if(that.data.myrewardinfo.length>0){
          that.setData({
            listNone: false,
            listNone1: false,
          })
        }else{
          that.setData({
            listNone: true,
            listNone1: false,
          })
        }
    })
    api.myrewardin(data, function (result) {
      if (wx.getStorageSync('redBotTwo') < result.length) {
        that.setData({
          redBotTwo: true
        })
      }else{
        if (wx.getStorageSync('redBotTwo')){
          that.setData({
            redBotTwo: true
          })
        }
        that.setData({
          redBotTwo: false
        })
      }
      wx.setStorageSync('redBotTwo', result.length)              
    })
  },
  release: function (data,bur) {
    var that = this;
    that.setData({
      redBotOne: false
    })
    api.myrewardin(data, function (result) {
      wx.setStorageSync('redBotTwo', result.length)
      if(result){
        that.setData({
          inmyrewardinfo: !bur ? result : that.data.inmyrewardinfo.concat(result),
          myinrecid: result[0] ? result[0].recid : ''
        })
      }
      // wx.setStorageSync('myrec', result[0].recid)
      if (that.data.inmyrewardinfo.length > 0) {
        that.setData({
          listNone1: false, listNone: false,
        })
      } else {
        that.setData({
          listNone1: true, listNone: false,
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onReachBottom: function () {
    var that = this;
    this.setData({
      page: ++this.data.page
    })
    if (this.data.activeId == 0) {
      var data = {
        thSessionId: wx.getStorageSync("token"),
        userid: wx.getStorageSync("userid"),
        page_num: this.data.page
      }
      this.init(data,true);
    } else {
      var data = {
        thSessionId: wx.getStorageSync("token"),
        userid: wx.getStorageSync("userid"),
        page_num: this.data.page
      }
      this.release(data,true)
    }
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})