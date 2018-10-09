// pages/marklock/marklock.js
const api = require("../../utils/api");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    num: null,
    page: 1,
    personnum:null,
    lockShow:true, // 根据解锁状态控制显示
    money: null //未解锁状态时 获取自己的牛币数量与 当前公司解锁需要的牛币数量
  },
  toIndex: function(){
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  clock:function(e){
    console.log(e.target.dataset.ind)
    if (e.target.dataset.ind==1){
      wx.switchTab({
        url: '/pages/twoSeaHome/twoSeaHome',
      })
    }else{
      wx.navigateTo({
        url: '/pages/myguest/myguest',
      })
    }
  },
  toPath: function(e){
    let _this=this;
    if (e.currentTarget.dataset.ind==2){
      wx.navigateTo({
        url: `/pages/welfare/welfare`
      })
      return
    }
    if(e.target.dataset.ind==0){
      wx.navigateTo({
        url: '/pages/myguest/myguest',
      })
      return;
    } else if (e.target.dataset.ind == 1){
      wx.switchTab({
        url: '/pages/twoSeaHome/twoSeaHome',
      })
      return;
    }
    if (_this.data.refuse) {
      wx.navigateTo({
        url: '/pages/card/card',
      })
      return;
    }
    wx.redirectTo({
      url: `/pages/createteam/createteam?comid=${this.data.id}&comname=${this.data.comname}`,
    })
  },
  onclick: function(e){
    var url,_this=this;
    var data=e.currentTarget.dataset;
    if(data.type==1){
      if(_this.data.refuse){
        wx.navigateTo({
          url: '/pages/card/card',
        })
        return;
      }
      url = `/pages/group/group?id=${this.data.id}&comname=${this.data.comname}&puserid=${data.id}&nickname=${data.nickname}`
    } else if (data.type == 3) {
      url = `/pages/dialogInfo/dialogInfo?id=${data.id}&src=${data.src}`;
    } else if (data.type == 2) {
      //自己
      // url = "/pages/group/group"
    }
    wx.navigateTo({
      url: url,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()    
    let _this = this;
    // 利用页面传递数据进行渲染  公司名称
    _this.setData({
      comname: options.comname,
      id: options.id,
      userid: wx.getStorageSync("userid")
    })
    //判断是否解锁 
    let obj = {
      thSessionId: wx.getStorageSync('token'),
      userid: wx.getStorageSync('userid'),
      comname: options.comname,
      comeid: options.id
    }
      if (options.unlock == 0) {
        _this.setData({
          lockShow: false
        })
        let data = {
          thSessionId: wx.getStorageSync('token'),
          userid: parseInt(wx.getStorageSync('userid')),
          comid: options.id,
          comname: options.comname
        }
        api.markguestlock(data, function (res) {// 获取解锁需要的金币数目
          _this.setData({
            money: res.data
          })
        })
      }else{
        var data = {
          thSessionId: wx.getStorageSync('token'),
          userid: wx.getStorageSync("userid")
        }
        api.mycard(data, function (result) {
          if (result[0].comname != null && result[0].comname != "" && result[0].position != "" && result[0].position != null && result[0].work != "" && result[0].work != null) {
            _this.setData({
              refuse: false
            })
          } else {
            _this.setData({
              refuse: true
            })
          }
        })
        this.init(options.id, options.comname)
      }
    
  },
  init: function (id, comname){
    var that=this;
    var data = {
      thSessionId: wx.getStorageSync("token"),
      userid: wx.getStorageSync("userid"),
      comid: id,
      comname: comname,
      page_num: that.data.page
    };
    api.markguestlock(data,function(result){
      if (result.data.length==1){
        that.setData({
          list: that.data.page === 1 ? result.data : that.data.list.concat(result.data),
          personnum: result.customnum,
          listOne:true
        })
      }else if (result.data.length) {
        that.setData({
          list: that.data.page === 1 ? result.data : that.data.list.concat(result.data),
          personnum: result.customnum
        })
      } else {
        that.setData({
          page: --that.data.page,
          personnum: result.customnum
        })
      }
      that.setData({
        lockShow:true
      })
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that=this;
    this.setData({
      page: ++this.data.page
    })
    this.init(that.data.id,that.data.comname);
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  /**
   * 确认 解锁 按钮
   */
  Unlock:function(e){
    let data={
      thSessionId: wx.getStorageSync('token'),
      userid: wx.getStorageSync('userid'),
      changeno: '-' + e.target.dataset.money, //需要扣除的牛币 负
      comid: this.data.money.comid // 需要解锁的公司ID
    },_this=this;

    //判断 当前牛币是否足够
    if (this.data.money.niub > this.data.money.prices){
      // 模态框
      wx.showModal({
        title: '解锁确认',
        content: '是否确认花费' + e.target.dataset.money + '牛币解锁查看跟进人情况？',
        showCancel: true,
        success: function (res) {
          if (res.confirm){
            api.z_unlockmate(data, function (res) {
              if (res.code == 0) {
                console.log('解锁成功')
                _this.init(_this.data.money.comid, _this.data.money.comid)
              } else {
                wx.showModal({
                  title: '提示',
                  content: '解锁失败错误码：' + res.code,
                })
              }
            })
          }else{
            console.log('取消了解锁')
          }
        }
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '牛币不足',
        showCancel: false,
      })
    }
  }
})