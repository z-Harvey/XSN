// pages/evaluateinfo/evaluateinfo.js
var api = require('../../utils/api.js');
const vail = require("../../utils/vail");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfo: null,
    score: 5,
    message:'',
    scoreinfo: '超赞',
    list: null,
    info: []
  },
  changescore: function(e){
    var index = parseInt(e.currentTarget.dataset.index) + 1,score;
    if(index==1){
      score='吐槽'
    } else if (index == 2) {
      score = '较差'
    } if (index == 3) {
      score = '一般'
    } if (index == 4) {
      score = '满意'
    } if (index == 5) {
      score = '超赞'
    }
    this.setData({
      score: index,
      scoreinfo: score
    })
  },
  changemessage: function(e){
    this.setData({
      message: e.detail.value
    })
  },
  changetag: function(e){
    var index=e.currentTarget.dataset.index;
    var list=this.data.list;
    list[index] = this.data.list[index]?0:1;
    this.setData({
      list: list
    })
  },
  toPath: function () {
    this.save();
  },
  tag: function(){
    var arr = [], list = this.data.list;
    for (var i = 0; i < list.length; i++) {
      if (list[i]) {
        arr.push(this.data.info[i].tagmsg)
      }
    }
    this.setData({
      tags: arr.join("|")
    })
  },
  save: function () {
    var _this=this;
    this.tag();
    if (vail.empty(this.data.score, "您的评分") && vail.empty(this.data.tags, "您的评价标签") && vail.empty(this.data.message, "您的其他意见")) {
      
      var data = {
        thSessionId: wx.getStorageSync("token"),
        userid: wx.getStorageSync("userid"),
        puserid: this.data.id,
        score: this.data.score,
        tags: this.data.tags,
        message: this.data.message,
        usertype: this.data.usertype,
        teamid: this.data.teamid
      }
      console.log(data);
      api.evaluation(data,function(result){
        console.log(result);
        if(result.code==0){
          if (_this.data.score < 4) {
            wx.showModal({
              title: '',
              content: '您已评价成功',
              success: function () {
                wx.navigateBack({
                  delta: 1
                })
              }
            })
          } else {
            wx.navigateTo({
              url: "/pages/evalsuccess/evalsuccess",
            })
          }
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    this.setData({
      id: options.id,
      nickname: options.nickname,
      pavatarurl: options.pavatarurl,
      teamid: options.teamid,
      usertype: options.usertype
    })
    this.init()
  },
  init: function(){
    var that=this,arr=[];
    var data={
      thSessionId: wx.getStorageSync('token')
    }
    api.gettags(data,function(result){
      console.log(result);
      for(var i=0;i<result.length;i++){
        arr.push(0)
      }
      that.setData({
        info: result,
        list: arr
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