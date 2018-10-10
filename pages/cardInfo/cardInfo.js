// pages/peoplecard/peoplecard.js
const api = require("../../utils/api");
var wxapi = require('../../utils/wxapi.js');
const Util = require("../../utils/util");

var QQMapWX = require("../../utils/qqmap-wx-jssdk.min.js");
var demo = new QQMapWX({
  key: '2X4BZ-VCR64-XX3UU-X7L7D-P7XS3-M5BD7'
});
Page({
  /**
   * 页面的初始数据
   */
  data: {
    num: null
  },
  getPhoneNumber: function (e) {
    if (e.detail.errMsg == 'getPhoneNumber:ok') {
      var that = this;
      var data = {
        thSessionId: wx.getStorageSync("token"),
        iv: e.detail.iv,
        encryptedData: e.detail.encryptedData
      }
      api.bindTel(data, function (data) {
        that.setData({
          phone: data.data.phoneno
        })
        wx.setStorageSync('phone', data.data.phoneno);
        wx.navigateTo({
          url: '/pages/card/card',
        })
      });
    }
  },
  totop: function () {
    wx.reLaunch({
      url: "/pages/index/index",
    })
  },
  dialogPath: function(e){
    var that = this;
    var _this = this;
    var name = e.currentTarget.dataset.name;
    var src = e.currentTarget.dataset.src;
    console.log('--------------------')
    console.log(src)
    console.log('--------------------')    
    console.log(name);
    var data = {
      thSessionId: wx.getStorageSync('token'),
      userid: wx.getStorageSync("userid"),
      puserid: this.data.id
    }
    if (wx.getStorageSync("userid")) {
      api.checkfriend(data, function (result) {
        if (result.code == 0) {
          wx.navigateTo({
            url: `/pages/dialogInfo/dialogInfo?id=${_this.data.id}&src=${src}`
          })
        } else {  
          var str = `成为对方的好友才可发消息给对方，成为好友后对方可以查看到您的个人信息，是否继续？`;
          wxapi.dialog('', str, '', '', function () {
            var data1 = wx.getStorageSync("userInfo").gender, state, data0 = _this.data.list.gender;
            if (data0 == data1) {
              if (data0 == 1) {
                state = 0
              } else {
                state = 1
              }
            } else {
              state = 2
            }
            _this.aggreensuccess(state, name, src, _this)
          }, function () {
          })
        }
      })
    } else {
      url = "/pages/peoplecard/peoplecard";
    }
  },
  aggreensuccess: function (gender, name,src,that) {
    var data = {
      thSessionId: wx.getStorageSync('token'),
      userid: wx.getStorageSync("userid"),
      puserid: this.data.id
    }
    api.setfrined(data, function (res) {
      console.log(res)
      if(res.code==0){
        wx.navigateTo({
          url: `/pages/dialogInfo/dialogInfo?id=${that.data.id}&src=${src}`
        })
      }
    })
    
  },
  toPath: function (e) {
    var url;
    var data = e.currentTarget.dataset;
    if (data.type == 'look') {
      url = "/pages/peoplecard/peoplecard"
    } else if (data.type == 'sendmess') {
      url = "/pages/dialogInfo/dialogInfo"
    } else if (data.type == "comuser") {
      url = `/pages/comuser/comuser?userid=${this.data.userid}&puserid=${e.currentTarget.dataset.id}`
    } else if (data.type == 3) {
      url = "/pages/index/index"
    } else if (data.type == "evaluate") {
      url = `/pages/evaluate/evaluate?id=${e.currentTarget.dataset.id}`
    } else if (data.type == 10) {
        url = "/pages/peoplecard/peoplecard";
    } else if (data.type == 11) {
      console.log(this.data.id);
      url = `/pages/dialogInfo/dialogInfo?id=${this.data.id}&src=${data.src}`;
    } else if (data.type == 'edit') {
      url = "/pages/editcard/editcard"
    }
    wx.navigateTo({
      url: url,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // options.id=3;
    if (options.id == wx.getStorageSync("userid")){
      console.log('自己的名片')
    }
    if(!wx.getStorageSync("token")){
      wxapi.getUser();
      wx.login({
        success: (res) => {
          Util.request({
            modules: '/login',
            method: 'get',
            data: {
              code: res.code
            },
            success: (result) => {
              console.log(result);
              if (result.code == 0) {
                wx.setStorageSync("token", result.data.thSessionId)
                wx.setStorageSync('userid', result.data.userid)
              } else if (result.code == 1) {
                wx.setStorageSync("token", result.data.thSessionId)
                wx.setStorageSync('userid', result.data.userid)
                wx.setStorageSync("UserSig", result.data.UserSig)
              } else if (result.code == 2) {
                console.log("未注册")
              }
              wx.setStorageSync('logincode', result.code)
            }
          })
        }
      })
    }
    if(wx.getStorageSync("userid")){
      this.setData({
        registerbtn: false
      })
    }else{
      this.setData({
        registerbtn: true
      })
    }
    if(wx.getStorageSync("userid")==options.id){
      this.setData({
        mystate: false
      })
    }else{
      this.setData({
        mystate: true
      })
    }
    if(options.id){
      this.setData({
        id: options.id
      })
    }
    var data;
    if(wx.getStorageSync("token")){
      data = {
        thSessionId: wx.getStorageSync('token'),
        userid: wx.getStorageSync("userid"),
        puserid: this.data.id
      }
    }else{
      data = {
        thSessionId: wx.getStorageSync('token'),
        userid: '',
        puserid: this.data.id
      }
    }
    this.init(data);
  },
  init: function (data) {
    var _this = this;
    api.getmycard(data, function (result) {
      var product = result.data.product ? result.data.product.split(",") : '';
      _this.setData({
        list: result.data,
        num: result.data.score,
        product: product,
        address: result.data.address?result.data.address.split("|")[0]:''
      })
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
    if (res.target.id == 1) {
      return {
        title: `您好，这是我的名片，请惠存~~`,
        path: `/pages/cardInfo/cardInfo?id=${wx.getStorageSync("userid")}`
      }
    }
  }
})