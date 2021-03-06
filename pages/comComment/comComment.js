// pages/comComment/comComment.js
const api = require("../../utils/api.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:{
      comname: '1',
      reviews_list: '',
      subShow: false,
      subMot: false
    }
  },
  tapOk:function(e){
    let that=this,bur = e.currentTarget.dataset,url
    console.log(bur)
    if(bur.bur=='true'){
      console.log(bur.bur)
      if (that.data.source =='myguest'){
        wx.navigateBack({
          delta: -1
        })
        return
      }
      url = `/pages/myguest/myguest`;
    }else{
      if (that.data.source == 'marklock') {
        wx.navigateBack({
          delta: -1
        })
        return
      }
      url = `/pages/marklock/marklock?id=${that.data.comid}&comname=${that.data.comname}&unlock=${that.data.unlock}`;
    }
    wx.redirectTo({
      url: url,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this,loginInfo = wx.getStorageSync('loginInfo')
    let data={
      thSessionId: loginInfo.token,
      userid: loginInfo.userid,
      comid: options.comid
    }
    that.setData({
      unlock: options.unlock,
      comname: options.comname,
      comid: options.comid,
      source: options.source
    })
    api.z_getRreviews(data,function(res){
      let obj = res.data.reviews_list,arr=[];
      for(let i=0;i<obj.length;i++){
        let o={
          value: obj[i],
          show: false
        }
        arr.push(o)
      }
      res.data.reviews_list=arr
      that.setData({
        list: res.data
      })
    })
  },
  tapClick:function(option){
    let that=this,obj=option.currentTarget.dataset;
    let data=that.data.list;
    data.reviews_list[obj.index].show = !data.reviews_list[obj.index].show
    that.setData({
      list: data
    })
    let judge=false;
    data.reviews_list.map(function(p1){
      p1.show?judge=true:false;
    })
    if(judge){
      that.setData({
        subShow:true
      })
    }else{
      that.setData({
        subShow: false
      })
    }
  },
  submit:function(){
    let that = this, arr = [], str, loginInfo = wx.getStorageSync('loginInfo');
    that.data.list.reviews_list.map(function(p1){
      if (p1.show){
        arr.push(p1.value)
      }
    })
    str=arr.join('|')
    let data={
      thSessionId: loginInfo.token,
      userid: loginInfo.userid,
      comid: that.data.comid,
      reviews:str
    }
    api.z_postReviews(data,function(res){
      // wx.showToast({
      //   title: '评价成功',
      //   mask:true
      // })
      // setTimeout(function(){
      //   wx.navigateBack({
      //     delta: -1
      //   })
      // },1500)
      that.setData({
        subMot: true
      })
    })
  },
  addTo:function(){
    this.selectComponent('#inp').disNone(true)
  },
  onMyevent:function(e){
    let that=this;
    let data = that.data.list;
    let isPush=true;
    data.reviews_list.map(function(p1){
      if (p1.value == e.detail.paramBtoA){
        p1.show=true;
        isPush=false;
      }
    })
    if(isPush){
      let obj = {
        value: e.detail.paramBtoA,
        show: true
      }
      data.reviews_list.push(obj)
    }
    that.setData({
      list: data,
      subShow: true      
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
  onShareAppMessage: function () {

  }
})