// pages/traArea/traArea.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    slider_width:'30rpx',
    slider_left:'40rpx'
  },
  //40 156 276 388
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this;
  },
  navListClick:function(e){
    let eve=e.currentTarget.dataset,that=this;
    let left_arr = ['40rpx', '156rpx', '276rpx', '388rpx', '516rpx'];    
    if(eve.navnum<4){
      that.setData({
        slider_width: '30rpx',        
        slider_left: left_arr[eve.navnum]
      })
    }else{
      that.setData({
        slider_width: '60rpx',
        slider_left: left_arr[eve.navnum]
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  toPath:function(e){
    let data=e.currentTarget.dataset;
    let domType=data.type
    if(domType=='info'){
      wx.navigateTo({
        url: '/pages/traArea/experDeta/experDeta',
      })
    }
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