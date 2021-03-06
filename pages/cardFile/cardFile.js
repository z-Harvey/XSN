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
    listNone:false,
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
    api.search(data, function (data) {
      console.log(data)
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
  dialogPath:function(e){
    let data = e.currentTarget.dataset;
    let name=data.name,src=data.src,id=data.id;
    wx.navigateTo({
      url: `/pages/dialogInfo/dialogInfo?id=${id}&src=${src}`
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
   * 登录框
   */
  showDialog(bur) {
    this.selectComponent("#dialog").gits(bur)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    if (!wx.getStorageSync("userid")) {
      this.showDialog(true);
      console.log('meiyou')
      return;
    }
  },
  onShow: function(){
    if (wx.getStorageSync("userid")) {
      console.log('有userid');
      var _this = this;
      this.init(_this)
    }else{
      this.showDialog(false);
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  /**
   * 上拉加载数据
   */
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