// pages/basic/numReg/numReg.js
const api = require('../../../utils/api.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    phoneNum:null,
    yzm:null,
    yzmText:'获取验证码',
    show:true,
    OKshow:false
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

  },
  cheng:function(event){
    // if (!(/^1(2|3|4|5|6|7|8|9)\d{9}$/.test(26601164561))){
    //   console.log('错误')
    // }
    let _this=this;
    if(event.target.dataset.type==0){
      _this.setData({
        phoneNum: event.detail.value
      })
    }else{
      _this.setData({
        yzm: event.detail.value
      })
    }
  },
  phoneOK:function(e){
    if (this.data.yzm_num == this.data.yzm){
      let data = {
        thSessionId: wx.getStorageSync('token'),
        phoneno: wx.getStorageSync('phone')
      }
      api.bindTelCallUserImg(data, function (res) {
        wx.setStorageSync('UserSig', res.data.UserSig);
        wx.setStorageSync('userid', res.data.userid);
        wx.navigateBack({
          detail: 1
        })
      })
    }else{
      wx.showToast({
        title: '验证码错误！',
        duration: 1500,
        icon:'no',
        image:'/img/my/tan.png'
      })
    }
  },
  /**
   * 获取验证码
   */
  yzmUP:function(){
    var _this=this,s=60;
    console.log(!(/^1(2|3|4|5|6|7|8|9)\d{9}$/.test(this.data.yzm)))
    if (!(/^1(2|3|4|5|6|7|8|9)\d{9}$/.test(this.data.phoneNum))){
      console.log('111111')
    }else{
      let data = {
        thSessionId: wx.getStorageSync('token'),
        phoneno: this.data.phoneNum
      }
      api.z_yzcode(data,function(res){
        if(res.code==0){
          _this.setData({
            yzmText: s + 's',
            show: false
          })
          s--
          var index = setInterval(function () {
            _this.setData({
              yzmText: s + 's',
              show: false
            })
            s--
            if (s <= 0) {
              clearInterval(index);
              _this.setData({
                yzmText: '获取验证码',
                show: true
              })
            }
          }, 1000)
          wx.showToast({
            title:'验证码已发送',
            duration: 1500
          })
          _this.setData({
            yzm_num: res.data.yzm_code,
            OKshow:true
          })
          wx.setStorageSync('phone', _this.data.phoneNum);
        }
      })
    }
  }
})