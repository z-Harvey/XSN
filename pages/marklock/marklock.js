// pages/marklock/marklock.js
const api = require("../../utils/api");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    num: null,
    page: 1
  },
  toIndex: function(){
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  toPath: function(){
    wx.redirectTo({
      url: `/pages/createteam/createteam?comid=${this.data.id}&comname=${this.data.comname}`,
    })
  },
  onclick: function(e){
    var url;
    var data=e.currentTarget.dataset;
    if(data.type==1){
      url = `/pages/group/group?id=${this.data.id}&comname=${this.data.comname}&puserid=${data.id}&nickname=${data.nickname}`
      console.log(url,this.data.comname);
    } else if (data.type == 3) {
      url = `/pages/dialogInfo/dialogInfo?id=${data.id}&src=${data.src}`;
    } else if (data.type == 2) {
      //自己
      // url = "/pages/group/group"
    }
    wx.navigateTo({
      url: url,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    this.setData({
      comname: options.comname,
      id: options.id,
      userid: wx.getStorageSync("userid")
    })
    this.init(options.id, options.comname)
    console.log(this.data.userid,"标记用户",options.comname);
  },
  init: function (id, comname){
    var that=this;
    var data = {
      thSessionId: wx.getStorageSync("token"),
      userid: wx.getStorageSync("userid"),
      comid: id,
      comname: comname,
      page_num: that.data.page
    };
    api.markguestlock(data,function(result){
      console.log("标记解锁",result.data)
      if (result.data.length) {
        that.setData({
          list: that.data.page === 1 ? result.data : that.data.list.concat(result.data),
          personnum: result.customnum
        })
        console.log(that.data.page);
      } else {
        that.setData({
          page: --that.data.page,
          personnum: result.customnum
        })
      }
        // that.setData({
        //   list: result.data,
        //   personnum: result.data.length
        // })
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that=this;
    this.setData({
      page: ++this.data.page
    })
    this.init(that.data.id,that.data.comname);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})