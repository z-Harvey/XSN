// pages/myguest/myguest.js
const api = require("../../utils/api");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    btninfo: ['有过合作', '正在合作', '有过跟进', '正在跟进'],
    page: 1,
    toView: 'eeede'
  },
  jumpTo: function (e) {
    console.log(e)
    // 获取标签元素上自定义的 data-opt 属性的值
    let target = e.currentTarget.dataset.opt;
    this.setData({
      toView: target
    })
  },
  inputComname: function (e) {
    this.setData({
      comname: e.detail.value
    })
  },
  markguest: function(e){
    var data = e.currentTarget.dataset;
    console.log(data)
    var url = `/pages/marklock/marklock?id=${data.comid}&comname=${data.comname}&unlock=${data.unlock}`;
    wx.navigateTo({
      url: url,
    })
  },
  toPath: function (e) {
    var url;
    var data = e.currentTarget.dataset;
    console.log(data.type == 'navHome')
    if (data.type == 'edit') {
      var res=this.data.list[data.index]
      url = `/pages/editguest/editguest?comid=${res.comid}`;
    } else if (data.type == 'mark') {
      url = "/pages/search/search"
    } else if (data.type == 'eval') {
      console.log(data.data.comid)
      url = `/pages/comComment/comComment?comid=${data.data.comid}`
    } else if (data.type == 'navHome') {
      wx.switchTab({
        url: "../index/index"
      })
    } else if (data.type == 'soce') {
      wx.navigateTo({
        url: "/pages/search/search"
      })
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
    if (options.guest_status){
      wx.setStorageSync('guest_status', options.guest_status);
    }
    this.init();
  },
  init: function (actid) {
    var that = this;
    var data = {
      thSessionId: wx.getStorageSync("token"),
      userid: wx.getStorageSync("userid"),
      page_num: that.data.page
    }
    api.myguest(data, function (result) {
      console.log(result.data)
      if(result.data.length===0){
        that.setData({
          listNone:true
        })
      }else{
        result.data.map(function(p1){
          p1.department_list = p1.department_list.length > 0 ? p1.department_list.join('、'):false;
        })
        that.setData({
          listNone:false
        })
      }
      that.setData({
        list: that.data.page === 1 ? result.data : that.data.list.concat(result.data)
      })
    })
  },
  search: function () {
    var _this = this;
    var data = {
      queryType: 'guest',
      queryKey: this.data.comname,
      userid: wx.getStorageSync('userid'),
      thSessionId: wx.getStorageSync('token')
    }
    api.search(data, function (data) {
      console.log(data);
      _this.setData({
        list: data
      })
    })
  },
  close: function(){
    this.setData({
      comname: ''
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
    var that = this;
    this.setData({
      page: ++this.data.page
    })
    this.init();
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