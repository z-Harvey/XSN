// pages/search/search.js
const api = require('../../utils/api.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    comname: '',
    list: null,
    page: 1,
    toView: 'eeede',    
    none:false
  },
  jumpTo: function (e) {
    // 获取标签元素上自定义的 data-opt 属性的值
    let target = e.currentTarget.dataset.opt;
    console.log(target)
    this.setData({
      toView: target
    })
  },
  inputComname: function (e) {
    this.setData({
      comname: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
      this.setData({
        state: options
      })
    // var _this = this;
    // var data = {
    //   queryType: 'company',
    //   queryKey: this.data.comname,
    //   userid: wx.getStorageSync('userid'),
    //   thSessionId: wx.getStorageSync('token'),
    //   page_num: this.data.page
    // }
    // this.init(data, this)
  },
  showDialog(bur) {
    this.selectComponent("#dialog").gits(bur)
  },
  toPath: function (e) {
    let params = e.currentTarget.dataset, url;    
    let that=this;
    if (!wx.getStorageSync('userid')){
      this.showDialog(true)
      return
    } else if (that.data.state.my_sea) {
      wx.setStorageSync('editcard_comname', params.comname)
      wx.navigateBack({
        delta: '-1'
      })
      return
    } else if (that.data.state.crea) {
      if (params.unlock==0){
        wx.showToast({
          title:'未标记客户',
          icon: 'none'
        })
        return
      }
      wx.setStorageSync('editcard_data', params)
      wx.navigateBack({
        delta: '-1'
      })
      return
    }
    var da={
      userid: wx.getStorageSync('userid'),
      thSessionId: wx.getStorageSync('token'),
      comid: params.id,
    }
    api.checkmate(da,function(data){
      if(data.data.has_mate==0){
        url = `/pages/activityInfo/activityInfo?id=${params.id}&comname=${params.comname}`;
        wx.navigateTo({
          url: url,
        })
      } else if (data.data.has_mate==1){
        url = `/pages/marklock/marklock?id=${params.id}&comname=${params.comname}&unlock=${params.unlock}`;
        wx.navigateTo({
          url: url,
        })
      }
    })
  },
  search: function(){
    var _this=this;
    var data={
      queryType:'company',
      queryKey: this.data.comname,
      userid: wx.getStorageSync('userid'),
      thSessionId: wx.getStorageSync('token'),
      page_num: this.data.page
    }
    this.init(data,this)
  },
  sdsrceach:function(){
    var _this = this;
    var data = {
      is_deepquery:1,
      queryType: 'company',
      queryKey: this.data.comname,
      userid: wx.getStorageSync('userid'),
      thSessionId: wx.getStorageSync('token'),
      page_num: this.data.page
    }
    this.init(data, this,1)
  },
  init: function(data,_this,t){
    let that=this;
    api.search(data, function (data) {
      console.log(data)
      _this.setData({
        list: data
      })
      if(t==1){
        that.setData({
          none:false
        })
      }else{
        that.setData({
          none: true
        })
      }
      // _this.ini(data,_this)
    })
  },
  close: function () {
    this.setData({
      comname: ''
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // this.setData({
    //   page: ++this.data.page
    // })
    // this.init({
    //   queryType: 'company',
    //   queryKey: this.data.comname,
    //   userid: wx.getStorageSync('userid'),
    //   thSessionId: wx.getStorageSync('token'),
    //   page_num: this.data.page
    // },this)

    // console.log(this.data.page_num)
    
  },
  // ini(data,_this) {
  //   if (data.length) {
  //     _this.setData({
  //       list: _this.data.page === 1 ? data : _this.data.list.concat(data)
  //     })
  //   } else {
  //     // _this.setData({
  //     //   page: --_this.data.page
  //     // })
  //   }
  // },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})