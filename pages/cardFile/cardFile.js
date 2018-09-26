// pages/cardFile/cardFile.js
const api = require("../../utils/api");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    comname: '',
    list: null,
    page: 1,
    userid: wx.getStorageSync("userid"),
    listNone:false
  },
  toPath: function (e) {
    var data = e.currentTarget.dataset;
    if (data.type ==='myName'){
      wx.navigateTo({
        url: "/pages/peoplecard/peoplecard",
      })
      return
    }
    var url = `/pages/cardInfo/cardInfo?id=${data.id}`
    wx.navigateTo({
      url: url,
    })
  },
  search: function () {
    var _this = this;
    var data = {
      queryType: 'user',
      queryKey: this.data.comname,
      userid: wx.getStorageSync('userid'),
      thSessionId: wx.getStorageSync('token'),
      page_num: this.data.page
    }
    console.log(data);
    this.init(this)
  },
  init: function (_this) {
    var that=this;
    var data = {
      queryType: 'user',
      queryKey: _this.data.comname || '',
      userid: wx.getStorageSync('userid'),
      thSessionId: wx.getStorageSync('token'),
      page_num: _this.data.page
    }
    console.log("搜索页面",data)
    api.search(data, function (data) {
      if(data.total===0){
        that.setData({
          listNone:true
        })
      }else{
        that.setData({
          listNone: false
        })
      }
      _this.setData({
        list: _this.data.page === 1 ? data.friend_info
          : _this.data.list.concat(data.friend_info),
          totalnum: data.total
      })
    })
  },
  inputComname: function (e) {
    this.setData({
      comname: e.detail.value
    })
    // console.log(e.detail.value)
  },
  close: function () {
    this.setData({
      comname: ''
    })
  },
  getPhoneNumber: function (e) {
    if (e.detail.errMsg =='getPhoneNumber:ok'){
      var that = this;
      var data = {
        thSessionId: wx.getStorageSync("token"),
        iv: e.detail.iv,
        encryptedData: e.detail.encryptedData
      }
      api.bindTel(data, function (data) {
        console.log(data)
        if(data.code==0){
          that.setData({
            show: false
          })
          wx.setStorageSync('phone', data.data.phoneno);

          let obj = {
            thSessionId: wx.getStorageSync("token"),
            phoneno: wx.getStorageSync("phone")
          }
          api.bindTelCallUserImg(obj, function (res) {
            res.data['Sign_in'] = true;
            that.setData({
              list: res.data,
              show: false
            })
            wx.setStorageSync('userid', res.data.userid);
            wx.setStorageSync('UserSig', res.data.UserSig);
            console.log(res)
          })
        }else{
          wx.showModal({
            title: "系统提示",
            content: data.msg,
          })
        } 
      });
    }
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    if (wx.getStorageSync("userid")) {
      this.setData({
        show: false
      })
    } else {
      this.setData({
        show: true
      })
    }
  },
  onShow: function(){
    if (wx.getStorageSync("userid")) {
      var _this = this;
      this.init(_this)
    }
    if (wx.getStorageSync("userid")) {
      this.setData({
        show: false
      })
    } else {
      this.setData({
        show: true
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  onReachBottom: function () {
    var that = this;
    if(this.data.totalnum>this.data.page*9){
      this.setData({
        page: ++this.data.page
      })
      this.init(this);
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})