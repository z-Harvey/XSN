// pages/release/release.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
  
  },
  toPath: function () {
    wx.navigateTo({
      url: `/pages/rewardinfo/rewardinfo?id=${this.data.recid}&myid=${this.data.reccreate}`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    wx.hideShareMenu()
    console.log(options.minmoney)
    if (options.maxmoney&&options.minmoney){
      this.setData({
        maxmoney: options.maxmoney,
        minmoney: options.minmoney,
        nickname: wx.getStorageSync("userInfo").nickName,
        puserid: options.userid,
        recid: options.recid,
        reccreate: options.rectcreate
      })
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    console.log(wx.getStorageSync('my_user_name'))
    if(res.target.id==1){
      return {
        title: `【${wx.getStorageSync('my_user_name')}@你】邀你组队联合打单，${this.data.minmoney}元佣金等你来拿~~`,
        path: `/pages/reward/reward?id=${this.data.recid}&myid=${this.data.reccreate}&myname=${wx.getStorageSync('my_user_name')}`
      }
    }
  }
})