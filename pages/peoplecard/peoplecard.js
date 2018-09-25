// pages/peoplecard/peoplecard.js
const api = require("../../utils/api");
var wxapi = require('../../utils/wxapi.js');

var QQMapWX = require("../../utils/qqmap-wx-jssdk.min.js");
var demo = new QQMapWX({
  key: '2X4BZ-VCR64-XX3UU-X7L7D-P7XS3-M5BD7'
}); 
Page({
  /**
   * 页面的初始数据
   */
  data: {
    num:  null
    ,chexBox: false
    , motIfblock:false
    , transmit:false
  },
  toPath: function (e) {
    var url;
    var data = e.currentTarget.dataset;
    if (data.type == 'edit') {
      url = "/pages/editcard/editcard"
    } else if (data.type == "evaluate") {
      url = "/pages/evaluate/evaluate"
    } else if (data.type == "comuser") {
      url = "/pages/comuser/comuser"
    } else if (data.type == "navHome") {
      wx.switchTab({
        url: '../index/index',
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
    this.setData({
      listsss:options
    })
    wx.hideShareMenu()
    if (wx.getStorageSync('chexBox')){
      this.setData({
        transmit: true
      })
    }
    if(options.shareid){
      this.init(options.shareid)
    }else{
      this.init(wx.getStorageSync("userid"));
    }
    // this.location();
  },
  init: function(id){
    var _this=this;
    var data={
      thSessionId: wx.getStorageSync('token'), 
      userid: wx.getStorageSync("userid"),
      puserid: id
    }
    api.getmycard(data,function(result){
      var product = result.data.product ? result.data.product.split(",") : '';
      _this.setData({
        list: result.data,
        num: result.data.score,
        product: product,
        address: result.data.address?result.data.address.split("|")[0]:''
      })
    })
  },
  location: function () {
    var that = this;
    wxapi.location(function (res) {
      demo.reverseGeocoder({
        location: {
          latitude: res.latitude,
          longitude: res.longitude
        },
        success: function (data) {
          console.log(data);
          var city=data.result.ad_info.city.replace(/['市']/g,'');
          var region = data.result.ad_info.district.replace(/['区']/g, '')
          console.log(city)
          that.setData({
            city: city,
            // address: region
          })
        }
      });
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
   * 用户点击分享时
   */
  onShareAppMessage: function (res) {
    let _this=this;
    if (_this.data.chexBox){
      wx.setStorageSync("chexBox", _this.data.chexBox)
    }
    _this.setData({
      motIfblock: false
    })
    if (res.target.id == 1) {
      return {
        title: `您好，这是我的名片，请惠存~~`,
        path: `/pages/cardInfo/cardInfo?id=${wx.getStorageSync("userid")}`
      }
    }
    if(_this.data.chexBox){
      _this.setData({
        transmit: true
      })
    }
  },
  //点击递名片时触发
  clickShare:function(res){
    if(res.currentTarget.dataset.type==1){
      this.setData({
        motIfblock: false
      })     
      return 
    }
    if (wx.getStorageSync('chexBox')){
      this.setData({
        motIfblock: false
      })
      return true;
    }
    this.setData({
      motIfblock: true
    })
  },
  //点击‘不在提示’时更改布尔值
  clickChebox:function () {
    this.setData({
      chexBox: !this.data.chexBox
    })
  }
})