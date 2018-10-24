// pages/industry/industry.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    arrList: new Array(0)
  },
  inpButton:function(){
    wx.navigateTo({
      url: '/pages/basic/industry/industry',
    })
  },
  inpConteClick:function(e){
    let str = e.currentTarget.dataset.str;
    let arrList=this.data.arrList;
    for(let i=0;i<arrList.length;i++){
      if (arrList[i]==str){
        arrList.splice(i,1)
      }
    }
    this.setData({
      arrList: arrList
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    let arr = this.data.arrList;
    let str = wx.getStorageSync('key');
    if(!str){
      return;
    }
    arr.push(wx.getStorageSync('key'))
    let setArr = new Set(arr);    
    this.setData({
      arrList: Array.from(setArr)
    })
    wx.removeStorageSync('key')
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