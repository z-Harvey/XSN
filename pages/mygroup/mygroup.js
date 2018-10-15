// pages/mygroup/mygroup.js
var wxapi = require('../../utils/wxapi.js');
var api = require('../../utils/api.js');
var commondata = null;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    activeId: 0,
    page: 1,
    listNone:false,
    mystOne:false,
    mystTwo:false,
    myrewardinfo:new Array(),
    inrewardinfo:new Array(),
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
  topath: function(e){
    var data=e.currentTarget.dataset;
    if(data.type==='navHome'){
      wx.switchTab({
        url: "../index/index"
      })
      return;
    }
    wx.navigateTo({
      url: `/pages/dialogInfo/dialogInfo?id=${data.id}&src=${data.src}`,
    })
  },
  activeTab: function(e){
    this.setData({
      activeId: e.currentTarget.dataset.index,
    })
    if (this.data.activeId == 0) {
      this.init(commondata);
    } else {
      this.release(commondata)
    }
  },
  agrren: function(e){
    var id=e.currentTarget.dataset.id;
    var name=e.currentTarget.dataset.name;
    var src = e.currentTarget.dataset.src;
    var data = {
      thSessionId:wx.getStorageSync('token'), 
      teamid: e.currentTarget.dataset.teamid,
      isagree: 1,
      userid: wx.getStorageSync('token')      
    }
    var _this = this;
    var str="是否确定同意组队?组队成功后双方自动成为好友关系,可在文件夹中查看对方的消息~";
    wxapi.dialog('', str, '', '', function () {
      api.agreen(data,function(result){
        console.log(result);
        var data=result.gender_list,state;
        if(data[0]==data[1]){
          if(data[0]==1){
            state=0
          }else{
            state = 1
          }
        }else{
          state = 2          
        }
        _this.aggreensuccess(state,name,src,id,result.niub);
      })
    }, function () {
      
    })
  },
  aggreensuccess: function(gender,name,src,id,niubi){
    wx.navigateTo({
      url: `/pages/mygroupsuccess/mygroupsuccess?nickname=${name}&gender=${gender}&src=${src}&id=${id}&niubi=${niubi}`,
    })
  },
  end: function(e){
    var _this = this;
    var str = "请选择打单结果~";
    this.setData({
      in: e.currentTarget.dataset.index
    })
    wxapi.dialog('', str, '打单失败', '打单成功', function () {
      var data = {
        thSessionId: wx.getStorageSync("token"),
        teamid: e.currentTarget.dataset.teamid,
        laststatus: 1,
        nickname: e.currentTarget.dataset.nickname,
        pnickname: e.currentTarget.dataset.pnickname
      }
      _this.endsuccess(data);
    }, function () {
      var data = {
        thSessionId: wx.getStorageSync("token"),
        teamid: e.currentTarget.dataset.teamid,
        laststatus: 2
      }
      _this.enderror(data);
    })
  },
  endsuccess: function(data){
    api.groupresult(data, function (result) {
      console.log(result,'打单结果')
      if(result.code==0){
        wx.navigateTo({
          url: '/pages/menusuccess/menusuccess',
        })
      }
    })
  },
  enderror: function(data){
    var _this=this;
    api.groupresult(data, function (result) {
      console.log(result, '打单失败结果')
      if(result.code==0){
        _this.init(commondata)
      }else{
        
      }
    })
  },
  del: function(e){
    var data = {
      thSessionId: wx.getStorageSync('token'),
      teamid: e.currentTarget.dataset.teamid,
      userid: e.currentTarget.dataset.userid
    }
    var _this = this;
    var str = "是否确认删除组队信息~";
    wxapi.dialog('', str, '', '', function () {
      api.del(data, function (result) {
        console.log(result,'删除信息成功')
        _this.delsuccess();
      })
    }, function () {
    })
  },
  delsuccess: function(){
    console.log("删除成功")
    if (this.data.activeId == 0) {
      this.init(commondata);
    } else {
      this.release(commondata)
    }
  },
  evaluate: function(e){
    wx.navigateTo({
      url: `/pages/evaluateinfo/evaluateinfo?id=${e.currentTarget.dataset.id}&nickname=${e.currentTarget.dataset.nickname}&pavatarurl=${e.currentTarget.dataset.pavatarurl}&teamid=${e.currentTarget.dataset.teamid}&usertype=${e.currentTarget.dataset.usertype}`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('-------------------------------')
    wx.hideShareMenu()
    wx.setStorageSync('team_status', options.team_status)  
    commondata = {
      thSessionId: wx.getStorageSync("token"),
      userid: wx.getStorageSync("userid"),
      page_num: this.data.page
    }
    this.init(commondata);
  },
  init: function (data,bur) {
    var that = this;
    let num = wx.getStorageSync("mystOne")
    api.mygroup(data, function (result) {
      if (num && num < result.length){
        that.setData({
          mystOne:true
        })
      }else{
        that.setData({
          mystOne: false
        })
      }
      wx.setStorageSync("mystOne", result.length)
      if(result){
        that.setData({
          myrewardinfo: !bur ? result : that.data.myrewardinfo.concat(result)
        })
        console.log(that.data.myrewardinfo)
        that.data.myrewardinfo.length > 0 ? that.setData({
          listNone: false
        }) : that.setData({
          listNone: true
        })
      }
    })
  },
  release: function (data,bur) {
    var that = this;
    let num = wx.getStorageSync("mystTwo")
    that.setData({
      mystOne: false
    })
    api.mygroupin(data, function (result) {
      if(num&&num<result.length){
        that.setData({
          mystOne: true
        })
      }else{
        that.setData({
          mystOne: false
        })
      }
      if(result){
        that.setData({
          inrewardinfo: !bur ? result : that.data.inrewardinfo.concat(result)
        })
        console.log(that.data.inrewardinfo.length)
        that.data.inrewardinfo.length>0?that.setData({
          listNone:false
        }):that.setData({
          listNone:true
        })
      }
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
    // this.init(commondata);
    if (this.data.activeId == 0) {
      var data = {
        thSessionId: wx.getStorageSync("token"),
        userid: wx.getStorageSync("userid"),
        page_num: this.data.page
      }
      console.log(data);
      this.init(data);
    } else {
      var data = {
        thSessionId: wx.getStorageSync("token"),
        userid: wx.getStorageSync("userid"),
        page_num: this.data.page
      }
      this.release(data)
    }
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
    var that = this;
    this.setData({
      page: ++this.data.page
    })
    if (this.data.activeId == 0) {
      var data = {
        thSessionId: wx.getStorageSync("token"),
        userid: wx.getStorageSync("userid"),
        page_num: this.data.page
      }
      console.log(data);
      this.init(data,true);
    } else {
      var data = {
        thSessionId: wx.getStorageSync("token"),
        userid: wx.getStorageSync("userid"),
        page_num: this.data.page
      }
      this.release(data,true)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})