// pages/basic/industry/industry.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    araename: false,
    depositname: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    wx.showLoading({
      title: '加载中',
    })
    const that = this;
    // 全国地区
    wx.request({
      url: app.globalData.httphost + '/mxcx/UtilsController/getOneIndustry',
      success: function (res) {
        console.log(res.data.value)
        if (res) {
          wx.hideLoading()
        }
        that.setData({
          maplist: res.data.value
        })
      },
      fail: function (res) {
        console.log(res)
      }

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

  },
  //  获取省下全-市-数据
  araename: function (e) {
    wx.showLoading({
      mask: true,
      title: '加载中',
    })
    const that = this;
    const id = e.currentTarget.dataset.id;
    that.setData({
      araename: id
    })
    wx.request({
      url: app.globalData.httphost + '/mxcx/UtilsController/getTowIndustry?towKey=' + id,
      success: function (res) {
        if (res) {
          wx.hideLoading()
        }
        that.setData({
          areamaplist: res.data.value
        })
      }
    })
  },
  villageitemTap: function (e) {
    const id = e.currentTarget.dataset.id;
    const that = this;
    that.setData({
      villageitem: id
    })

  }
})