// pages/basic/industry/industry.js
var app = getApp();
const api = require("../../../utils/api");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    let str=options.data_type;
    if (options.comname) {
      this.setData({
        comname: options.comname,
      })
    } else {
      this.setData({
        type1: options.type
      })
    }
    console.log(options.source)
    if(options.source==="'edit'"){
      this.init(0, str.split("|"));
    }else{
      this.init(0, false);      
    }
  },
  init: function (id,arr) {
    var _this = this;
    var data = {
      thSessionId: wx.getStorageSync('token'),
      pid: id
    }
    api.getWork(data, function (data) {
      console.log(data);
      _this.setData({
        industry_list: data.industry_list
      })
      arr ? data.industry_list.map(function (p1) {
        if (p1.name === arr[0]) {
          _this.araename('', p1, arr[1])
        }
      }):true;
    })
  },
  name: function(e){
    const that = this;
    const id = e.currentTarget.dataset.id;
    that.setData({
      depositname: id,
      name: e.currentTarget.dataset.name
    })
    var str=this.data.work+"|"+this.data.name;
    var url;
    if(this.data.type1){
      url = `/pages/editcard/editcard?str=${str}`
    }else{
      url = `/pages/card/card?str=${str}&comname=${this.data.comname}`
    }
    wx.setStorageSync('key', str)
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      stat: 1,
      work: str,
    })
    wx.navigateBack({
      delta: 1,
    })
  },
  araename: function (e,obj,arr) {
    const that = this;
    let id;
    if(obj!==undefined){
      id=obj.id;
      that.setData({
        araename: obj.id,
        work: obj.name
      })
    }else{
      id = e.currentTarget.dataset.id;
      that.setData({
        araename: id,
        work: e.currentTarget.dataset.name
      })
    }
    var data = {
      thSessionId: wx.getStorageSync('token'),
      pid: id
    }
    api.getWork(data, function (data) {
      console.log(data);
      that.setData({
        maplist: data.industry_list
      })
      data.industry_list.map(function(p1){
        if(p1.name===arr){
          that.setData({
            depositname: p1.id,
            name: p1.name
          })
        }
      })
    })
  },
})