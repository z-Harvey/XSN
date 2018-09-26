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
    let _this=this;
    if (_this.data.refuse) {
      wx.navigateTo({
        url: '/pages/card/card',
      })
      return;
    }
    wx.redirectTo({
      url: `/pages/createteam/createteam?comid=${this.data.id}&comname=${this.data.comname}`,
    })
  },
  onclick: function(e){
    var url,_this=this;
    var data=e.currentTarget.dataset;
    if(data.type==1){
      if(_this.data.refuse){
        wx.navigateTo({
          url: '/pages/card/card',
        })
        return;
      }
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
    let _this=this;
    var data = {
      thSessionId: wx.getStorageSync('token'),
      userid: wx.getStorageSync("userid")
    }
    api.mycard(data, function (result) {
      console.log('名片制作页面', result[0])
      console.log('--------------------------------------------')
      console.log(result[0].comname)
      console.log('-------------------------------------------')
      console.log(result[0].position)
      console.log(result[0].work)
      console.log(result[0].comname != null && result[0].comname != "" && result[0].position != "" && result[0].position != null && result[0].work != "" && result[0].work != null)
      if (result[0].comname != null && result[0].comname != "" && result[0].position != "" && result[0].position != null && result[0].work != "" && result[0].work != null){
        _this.setData({
          refuse:false
        })
      }else{
        _this.setData({
          refuse: true
        })
      }
    })
    this.setData({
      comname: options.comname,
      id: options.id,
      userid: wx.getStorageSync("userid")
    })
    this.init(options.id, options.comname)
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