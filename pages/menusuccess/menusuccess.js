// pages/menusuccess/menusuccess.js
const api = require("../../utils/api");
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  toPath: function (e) {
    var url;
    var data = e.currentTarget.dataset;
    if (data.type == 1) {
      // console.log("分享成功后加分")
      // var data = {
      //   thSessionId: wx.getStorageSync("token"),
      //   userid: wx.getStorageSync("userid"),
      //   changetype: 'ShareTeamWin'
      // }
      // api.changecode(data, function (res) {
      //   if (res.code == 0) {
      //     console.log("打单分享成功")
      //   }
      // })
    } else if (data.type == 2) {
      url = "/pages/mygroup/mygroup"
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
      nickname: wx.getStorageSync("userInfo").nickName,
      userid: wx.getStorageSync("userid"),
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
  onShareAppMessage: function (res) {
    console.log("dadan成功分享")
    if (res.target.id == 1) {
      return {
        title: `【${this.data.nickname}@你】我在销售牛遇到贵人，组队一起联合打单，你也来试试吧~~`,
        path: `/pages/index/index`,
        success: function(res){
          console.log("分享成功了吧")
              var data = {
                thSessionId: wx.getStorageSync("token"),
                userid: wx.getStorageSync("userid"),
                changetype: 'ShareTeamWin'
              }
              api.changecode(data,function(res){
                if(res.code==0){
                  console.log("打单分享成功")
                }
              })
　　　　　　
　　　　},
      }
    }
  }
})