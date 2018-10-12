// pages/share/share.js
const wxapi = require("../../utils/wxapi.js");
const api = require("../../utils/api");
const Util = require("../../utils/util");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userifo: null,
    ophone:null,//用户输入的手机号
    yzm:null,//用户输入的验证码
    yamCont:'获取验证码',
    yzmBtn: true,
    resYzm:null//获取到的验证码
  },
  /**
   * 生命周期函数--监听页面加载
   */
  inp:function(e){
    if(e.target.dataset.typ=='oph'){
      this.setData({
        ophone: e.detail.value
      })
      console.log(e.target.dataset.typ+':'+e.detail.value)
    }else{
      this.setData({
        yzm: e.detail.value
      })
      console.log(e.target.dataset.typ + ':' + e.detail.value)      
    }
  },
  onLoad: function (options) {
    this.setData({
      userifo: options
    })
    wx.hideShareMenu()
    var that=this;
      wx.login({
        success: (res) => {
          Util.request({
            modules: '/login',
            method: 'get',
            data: {
              code: res.code
            },
            success: (result) => {
              if (result.code == 2) {
                console.log("未注册")
                wx.setStorageSync("token", result.data.thSessionId)
                wx.setStorageSync('userid', '')
              }else{
                wx.setStorageSync("token", result.data.thSessionId)                
                // wx.switchTab({
                //   url: '/pages/index/index',
                // })
              }
              wx.setStorageSync('logincode', result.code)
            }
          })
        }
      })
    this.setData({
      shareuserid: options.userid
    })
  },
  save: function(){
    let that=this;
    if (this.data.resYzm == this.data.yzm) {
      let data = {
        thSessionId: wx.getStorageSync("token"),        
        phoneno: this.data.ophone,
        userid: this.data.userifo.userid,
        jy_status: 1
      }
      api.getregistercode(data, function (res) {//建立邀请关系
        if(res.code==0){
          let obj = {
            thSessionId: wx.getStorageSync("token"),
            phoneno: that.data.ophone
          }
          api.bindTelCallUserImg(obj, function (res) {
            wx.setStorageSync('userid', res.data.userid);
            wx.setStorageSync('UserSig', res.data.UserSig);
            wx.showToast({
              title: '注册成功',
              mask:true
            })
            setTimeout(function(){
              wx.switchTab({
                url: '/pages/index/index',
              })
            },1500)
          })
        }
      })
    }
  },
  yzcode:function(){
    console.log(this.data.ophone)
    if (this.data.ophone == '' || this.data.ophone == null){
      wx.showToast({
        title: ' 请输入手机号码 ',
        image:'/img/my/tan.png'
      })
      return
    }
    if (!(this.data.ophone.length === 11)){
      wx.showToast({
        title: ' 号码错误 ',
        image: '/img/my/tan.png'        
      })
      return
    }
    let data={
      thSessionId: wx.getStorageSync("token"),
      phoneno: this.data.ophone
    },that=this,num=60;
    that.setData({
      yzmBtn: false,
      yzmCont: num + 's'
    })
    var index = setInterval(function () {
      num = num - 1
      that.setData({
        yzmCont: num + 's'
      })
      if (num === 0) {
        clearInterval(index)
        that.setData({
          yzmBtn: true
        })
      }
    }, 1000)
    api.z_yzcode(data,function(res){
      if(res.data.is_user==1){
        wx.showToast({
          title: ' 号码已被注册 ',
          image: '/img/my/tan.png'
        })
        clearInterval(index)
        that.setData({
          yzmBtn: true
        })
      } else {
        that.setData({
          resYzm: res.data.yzm_code
        })
      }
      console.log(res)
    })
  }
})