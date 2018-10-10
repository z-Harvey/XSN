//index.js
//获取应用实例
const app = getApp();
const wxapi = require("../../utils/wxapi.js");
const api = require('../../utils/api.js');
const Util = require('../../utils/util')

Page({
  data: {
    current: 0,
    scrollTop:null,
    handBoxNone:true,
    showss:false
  },
  onPageScroll: function (e) {
    var _this=this;
    if (e.scrollTop > 150) {
      console.log(true)
      _this.setData({
        showss: true
      })
    } else {
      console.log(false)
      _this.setData({
        showss: false
      })
    }
    console.log(e);//{scrollTop:99}
  },
  refresh: function(){
      var that = this;
      wx.login({
        success: (res) => {
          console.log('code')
          console.log(res)
          Util.request({
            modules: '/login',
            method: 'get',
            data: {
              code: res.code
            },
            success: (result) => {
              console.log(result)
              if (result.code == 0) {
                console.log("首次，已经登陆")
                wx.setStorageSync("token", result.data.thSessionId)
                wx.setStorageSync('userid', result.data.userid)
              } else if (result.code == 1) {
                console.log("已经登陆多次")
                // wx.reLaunch({
                //   url: '/pages/index/index',
                // })
                wx.setStorageSync("token", result.data.thSessionId)
                wx.setStorageSync('userid', result.data.userid)
                wx.setStorageSync("UserSig", result.data.UserSig)
              } else if (result.code == 2) {
                console.log("未注册")
                wx.setStorageSync("token", result.data.thSessionId)
                wx.setStorageSync('userid', '')
                // wx.reLaunch({
                //   url: '/pages/index/index',
                // })
              }
              wx.setStorageSync('logincode', result.code)
              if (wx.getStorageSync('userid')) {
                that.setData({
                  butLogin: true
                })
              } else {
                that.setData({
                  butLogin: false
                })
              }

              // // 会话列表 请求会话对象的，头像、昵称
              // let data = {
              //   thSessionId: result.data.thSessionId,
              //   userid: 1
              // }
              // api.converList(data, function (res) {
              //   console.log(res)
              // })
              that.init();
            }
          })
        }
      })
  },
  onLoad: function(options){
    // wx.switchTab({
    //   url: '/pages/twoSeaHome/twoSeaHome',
    // })
    // wx.navigateTo({
    //   url: '/pages/basic/Jump/Jump'
    // });
    // return
  }, 
  onShow: function(){
    console.log(1)
    let _this=this;
    setTimeout(function () {
      _this.setData({
        handBoxNone: false
      })
    }, 5500)
    if (wx.getStorageSync("userid")){
      this.setData({
        butLogin: true
      })
    } else {
      this.setData({
        butLogin: false
      })
    }
    this.refresh();
  },
  init: function(){
    var _this = this;
    var data = {
      thSessionId: wx.getStorageSync("token"),
      userid: wx.getStorageSync('userid')||''
    }
    api.getindex(data, function (data) {
      if(data.code==0){
        _this.setData({
          list: data.data,
          totalcomnum: data.data.show_com_num,
          numtotal: data.data.all_mate_com_num + 10000,
          company: data.data.com_info
        })
      }else if(data.code==-1){
        _this.refresh()
      }
    })
    // var data1 = {
    //   thSessionId: wx.getStorageSync("token"),
    //   page_num: 1
    // }
    // api.myindexcompany(data1, function (data) {
    //   console.log("首页加载返回的数据", data)
    //   var data = data.data.com_info;
    //   _this.setData({
    //     company: data,
    //   })
    // })
  },
  changepage: function(e){
    var _this=this;
    var num = parseInt(e.detail.current)+1;
    console.log(num, _this.data.totalcomnum)
    if (num % 4 == 0 && num<_this.data.totalcomnum/3){
      var data = {
        thSessionId: wx.getStorageSync("token"),
        page_num: (num/4)+1
      }
      api.myindexcompany(data, function (data) {
        console.log("首页加载返回的数据", data)
        var data=data.data.com_info;
        _this.setData({
          company: _this.data.page === 1 ? data : _this.data.company.concat(data),
        })
      })
    }
  },
  changecurrent: function(e){
    this.setData({
      current: e.detail.current
    })
  },
  showDialog() {
    this.selectComponent("#dialog").gits()
  },
  toPath: function(e){
    var data = e.currentTarget.dataset,url;
    if (data.id == 0) {
      console.log(data.id == 0)
      wx.switchTab({
        url: '../twoSeaHome/twoSeaHome',
      })
      return
    }else if(data.id == 1){
      wx.navigateTo({
        url: '/pages/welfare/welfare',
      })
      return
    }
    if(data.id){
      url = `/pages/activity/activity?id=${data.id}&type=${data.type}`
      console.log(url);
    }else{
      url ="/pages/search/search"
    }
    wx.navigateTo({
      url: url,
    })
  },
  togroup: function (e) {
    console.log(!wx.getStorageSync('userid'))
    if(!wx.getStorageSync('userid')){
      this.showDialog();
      return;
    }
    var params = e.currentTarget.dataset, url;
    var da = {
      userid: wx.getStorageSync('userid'),
      thSessionId: wx.getStorageSync('token'),
      comid: params.id
    }
    api.checkmate(da, function (data) {//判断是否有标记关系
      if (data.data.has_mate == 0) {
        url = `/pages/markguest/markguest?id=${params.id}&comname=${params.comname}&unlock=${params.unlock}`;
        wx.navigateTo({
          url: url,
        })
      } else if (data.data.has_mate == 1) {
        url = `/pages/marklock/marklock?id=${params.id}&comname=${params.comname}&unlock=${params.unlock}`;
        wx.navigateTo({
          url: url,
        })
      }
    })
  },
  onShareAppMessage: function () {
    
  },
  getPhoneNumber:function(e){
    if (e.detail.errMsg == 'getPhoneNumber:ok') {
      var that = this;
      var data = {
        thSessionId: wx.getStorageSync("token"),
        iv: e.detail.iv,
        encryptedData: e.detail.encryptedData
      }
      api.bindTel(data, function (data) {
        console.log(data);
        if (data.code == 0) {
          wx.setStorageSync('phone', data.data.phoneno);
          let obj = {
            thSessionId: wx.getStorageSync("token"),
            phoneno: wx.getStorageSync("phone")
          }
          api.bindTelCallUserImg(obj, function (res) {
            that.setData({
              butLogin: false
            })
            wx.setStorageSync('userid', res.data.userid);
            wx.setStorageSync('UserSig', res.data.UserSig);
            that.onShow()
          })
        } else {
          wx.showModal({
            title: "系统提示",
            content: data.msg,
          })
        }
      });
    }
  },
  chexQb:function(){
    wx.switchTab({
      url: '/pages/twoSeaHome/twoSeaHome',
    })
  }
})