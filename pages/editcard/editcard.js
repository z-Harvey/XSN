// pages/editcard/editcard.js
var wxapi=require('../../utils/wxapi.js');
const api = require("../../utils/api");
const vail = require("../../utils/vail");
var QQMapWX = require("../../utils/qqmap-wx-jssdk.min.js");
var demo = new QQMapWX({
  key: '2X4BZ-VCR64-XX3UU-X7L7D-P7XS3-M5BD7'
}); 

var demoNoSdk = require('../../utils/demo-no-sdk.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    percent: 20,
    name: '',
    state: false,
    list: [],
    onoff: true
  },
  changework: function (e) {
    var name = this.data.workcard;
    this.setData({
      workcard: e.detail.value
    })
    if (name != e.detail.value) {
      this.setData({
        state: true
      })
    }
  },
  save: function(){
    this.changepercent();
    if(this.data.percent==100){
      this.dialogtotal();
    }else{
      this.dialog();
    }
  },
  dialog: function(){
    var _this=this;
    wxapi.dialog('', `还差${100 - _this.data.percent}%的信息填写完即可可领取牛币+10，请确认是否放弃机会？`, '稍后完善', '返回填写', function () {
      console.log("继续填写该页面")
    }, function () {
      if (_this.data.state) {
        _this.alert();
      } else {
        _this.saveCard(_this);
      }
    })
  },
  dialogtotal: function () {
    var _this = this;
    wx.showModal({
      title: '',
      content: '信息已全部填写，获得牛币+10',
      showCancel: false,
      success: function(result){
        console.log(result,_this.data.state)
        if (_this.data.state) {
          _this.alert();
        } else {
          _this.saveCard(_this);
        }
      }
    })
  },
  alert: function(){
    var _this=this;
    wxapi.dialog('', '修改公司信息后将变更认证状态，是否确认继续保存？', '', '继续保存', function () {
      console.log("继续保存")
      _this.saveCard(_this);
    }, function () {
      console.log("取消保存");
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    this.init();
    if (options.str) {
      this.setData({
        work: options.str
      })
    }
  },
  init: function () {
    var _this = this;
    var data = {
      thSessionId: wx.getStorageSync('token'),
      userid: wx.getStorageSync("userid")
    }
    api.mycard(data, function (result) {
      console.log('我的小页面',result[0])
      var product = result[0].product?result[0].product.split(","):'';
      var region = result[0].address?result[0].address.split("|")[0]:'';
      var address = result[0].address ?result[0].address.split("|")[1]:'';

      _this.setData({
        list: result[0],
        name: result[0].name,
        comname: result[0].comname,
        work: _this.data.work||result[0].work,
        email: result[0].email == 'null' ? '' : result[0].email,
        wxno: result[0].wxno=='null'?'':result[0].wxno,
        productlist: product,
        gender: result[0].gender,
        avatarurl: result[0].avatarurl,
        completion: result[0].completion,
        address: address,
        region: region,
        src: result[0].avatarurl,
        nickname: result[0].nickname,
        workcard: result[0].position
      })
    })
  },
  toPath: function (e) {
    let data=e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/basic/industry/industry?type='person'&source='edit'&data_type=`+data.type,
    })
  },
  changeaddress: function(e){
    this.setData({
      address: e.detail.value
    })
    console.log(this.data.address)
  },
  changenickname: function (e) {
    this.setData({
      nickname: e.detail.value
    })
  },
  changename: function(e){
    this.setData({
      name: e.detail.value
    })
  },
  changegender: function (e) {
    this.setData({
      gender: e.currentTarget.dataset.id
    })
  },
  changecomname: function(e){
    var name=this.data.comname;
    this.setData({
      comname: e.detail.value
    })
    if(name!=e.detail.value){
      this.setData({
        state: true
      })
      
    }
  },
  changeemail: function(e){
    var reg =/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
    if (reg.test(e.detail.value)){
      this.setData({
        email: e.detail.value,
        onoff: true
      })
    }else{
      this.setData({
        onoff: false
      })
    }
  },
  changewxno: function (e) {
    this.setData({
      wxno: e.detail.value
    })
  },
  changeproduct: function (e) {
    console.log(e)
    var index=e.currentTarget.dataset.index;
    this.data.productlist[index]=e.detail.value;
    console.log(this.data.productlist)
  },
  changenum: function(e){
    var product = this.data.productlist ? this.data.productlist:[];
    product.push('');
    this.setData({
      productlist: product
    })
    console.log("111")
  },
  changepercent: function(){
    var percent = 20;
    if (vail.empty(this.data.name)) {
      percent=percent+20;
    } 
    if (vail.empty(this.data.comname)){
      percent = percent + 10;
    }
    if (vail.empty(this.data.work)) {
      percent = percent + 10;
    }
    if (vail.empty(this.data.email)) {
      percent = percent + 10;
    }
    if (vail.empty(this.data.wxno)) {
      percent = percent + 10;
    }
    if (vail.empty(this.data.productlist)) {
      percent = percent + 10;
    }
    if (vail.empty(this.data.avatarurl)) {
      percent = percent + 10;
    }
    this.setData({
      percent: percent
    })
  },
  upload: function () {
    var _this = this;
    demoNoSdk('用户id', function (res, bucket, path) {
      _this.setData({
        proveurl: res,
        src: res
      })
    })
  },
  saveCard: function (that) {
    var state = that.data.state?1:0;
    wx.setStorageSync("updatestate", state)
    wx.setStorageSync("updatecomname", that.data.comname)
    
    var data = {
      thSessionId: wx.getStorageSync('token'),
      userid: wx.getStorageSync("userid"),
      nickname: that.data.nickname,
      name: that.data.name,
      phoneno: that.data.list.phoneno,
      comname: that.data.comname,
      email: that.data.email,
      product: that.data.productlist ? that.data.productlist.join(",") : that.data.productlist,
      gender: that.data.gender,
      avatarurl: that.data.src,
      work: that.data.work,
      completion: that.data.percent,
      wxno: that.data.wxno,
      address: that.data.region+'|'+that.data.address,
      is_change_company: that.data.state?1:0,
      position: that.data.workcard
    }
    console.log(data);
    api.savecard(data, function (result) {
      console.log(result,'保存我的名片')
      if(result.code==0){
        wx.reLaunch({
          url: '/pages/my/my',
        })
      }
    })
  },
  location: function(){
    var that=this;
    wxapi.location(function(res){
      demo.reverseGeocoder({
        location: {
          latitude: res.latitude,
          longitude: res.longitude
        },
        success: function (data) {
          var address = data.result.ad_info.city    +data.result.ad_info.district;
          console.log(data.result);
          that.setData({
            address: data.result.address,
            region: address
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
  onShow: function (options) {
    let pages = getCurrentPages();
    let currPage = pages[pages.length - 1];
    // this.init()
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