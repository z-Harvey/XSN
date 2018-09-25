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
    handBoxNone:true
  },
  refresh: function(){
    if (wx.getStorageSync("token")) {
      this.init()
    } else {
      var that = this;
      wx.login({
        success: (res) => {
          Util.request({
            modules: '/login',
            method: 'get',
            data: {
              code: res.code
            },
            success: (result) => {
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
              that.init();
            }
          })
        }
      })
    }
  },
  onLoad: function(){
    var _this=this;
    this.refresh();
  },
  onShow: function(){
    let _this=this;
    setTimeout(function () {
      _this.setData({
        handBoxNone: false
      })
    }, 5500)
  },
  init: function(){
    var _this = this;
    var data = {
      thSessionId: wx.getStorageSync("token")
    }
    api.getindex(data, function (data) {
      console.log("首页加载返回的数据",data)
      if(data.code==0){
        _this.setData({
          list: data.data,
          totalcomnum: data.data.show_com_num,
          numtotal: data.data.all_mate_com_num + 10000,
        })
      }else if(data.code==-1){
        _this.refresh()
      }
    })
    var data1 = {
      thSessionId: wx.getStorageSync("token"),
      page_num: 1
    }
    api.myindexcompany(data1, function (data) {
      console.log("首页加载返回的数据", data)
      var data = data.data.com_info;
      _this.setData({
        company: data,
      })
    })
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

  toPath: function(e){
    var data = e.currentTarget.dataset,url;
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
    var params = e.currentTarget.dataset, url;
    var da = {
      userid: wx.getStorageSync('userid'),
      thSessionId: wx.getStorageSync('token'),
      comid: params.id
    }
    api.checkmate(da, function (data) {
      console.log(data);
      if (data.data.has_mate == 0) {
        url = `/pages/activityInfo/activityInfo?id=${params.id}&comname=${params.comname}`;
        wx.navigateTo({
          url: url,
        })
      } else if (data.data.has_mate == 1) {
        url = `/pages/marklock/marklock?id=${params.id}&comname=${params.comname}`;
        wx.navigateTo({
          url: url,
        })
      }
    })
  },
  onShareAppMessage: function () {
    
  },
  queryMultipleNodes: function () {
    var query = wx.createSelectorQuery()
    query.select('#searchInp').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      console.log(res[0].top)       // 节点[0]的上边界坐标
      res[1].scrollTop // 显示区域的竖直滚动位置
    })
  },
  getPhoneNumber:function(e){
    console.log(e)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData) 
  }
})