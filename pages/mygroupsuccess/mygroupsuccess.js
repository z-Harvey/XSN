// pages/mygroupsuccess/mygroupsuccess.js
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
      url = `/pages/dialogInfo/dialogInfo?id=${this.data.id}&src=${data.src}`
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
    if(options.gender&&options.nickname){
      this.setData({
        nickname: options.nickname,
        gender: options.gender,
        headsrc: options.src,
        id: options.id,
        niubi: options.niubi
      })
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