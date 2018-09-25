// pages/rewardinfo/rewardinfo.js
var wxapi = require('../../utils/wxapi.js');
var api = require('../../utils/api.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    num: 0,
    userinfo: null,
    mytype: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // options.type="in";
    // options.id=3;
    // options.puserid=29;
    wx.hideShareMenu()
    this.setData({
      userid: wx.getStorageSync("userid"),
      recid: options.id,
    })
    var commondata; 
    if (options.type=='in'){
      this.setData({
        mytype: options.type,
        puserid: options.userid
      })
      commondata = {
        thSessionId: wx.getStorageSync("token"),
        userid: options.puserid,
        recid: options.id,
      }
      this.setData({
        myid: options.puserid
      })
    }else{
      commondata = {
        thSessionId: wx.getStorageSync("token"),
        userid: wx.getStorageSync("userid"),
        recid: options.id,
      }
      this.setData({
        myid: wx.getStorageSync("userid")
      })
    }
    console.log(options.type,this.data.mytype)
    this.init(commondata);
    console.log(this.data.myid,this.data.recid)
  },

  init: function (data){
    //悬赏的请求--我的悬赏详情接口
    var that = this;
    api.myrewardinfo(data, function (result) {
      console.log(result)
      that.setData({
        list: result,
        invitees: result.invitees,
        id: result.comid,
        comname: result.comname,
        message: result.message,
        recid: result.recid,
        comid: result.comid,
        minmoney: result.minmoney
      })
      if(that.data.list.rec_status!==1){
        that.setData({
          noFen:false
        })
      }else{
        that.setData({
          noFen: true
        })
      }
    })
  },
  toPath: function(e){
    var data=e.currentTarget.dataset,url;
    if(data.type==3){
      url='/pages/index/index';
      wx.reLaunch({
        url: url,
      })
    }
  },
  zudui: function(toid){
    var data={
      thSessionId: wx.getStorageSync('token'),
      userid: this.data.myid,
      puserid: toid,
      comid: this.data.comid,
      message: this.data.message,
      recid: this.data.recid,
      comname: this.data.comname
    }
    console.log(data);
    api.mycreatein(data,function(result){
      console.log(result)
      if(result.code==0){
        wx.navigateTo({
          url: '/pages/mygroupsuccess/mygroupsuccess',
        })
      }
    })
  },
  onclick: function (e) {
    var url;
    var data = e.currentTarget.dataset;
    if (data.type == 1) {
      // url = `/pages/group/group?id=${this.data.id}&comname=${this.data.comname}&puserid=${data.id}&nickname=${data.nickname}`
      // console.log(url, this.data.comname);
      console.log("与他组队")
      var toid=data.id;
      this.alert(toid)
      // this.zudui(toid)
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
  alert: function (toid) {
    var _this = this;
    var str = "是否确认与他组队？组队成功后双方自动成为好友关系，可在名片夹中查看对方的名片信息~"
    wxapi.dialog('组队提示', str, '', '', function () {
      _this.zudui(toid)
    }, function () {
      
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
  onShareAppMessage: function (res) {
    var that=this;
    if (res.target.id == 1) {
      return {
        title: `【${this.data.list.nickname}@你】邀你组队联合打单，${this.data.minmoney}元佣金等你来拿~~`,
        path: `/pages/reward/reward?id=${this.data.recid}&myid=${this.data.myid}`,
        success: function(){
          console.log(that.data.recid, that.data.myid)
        }
      }
    }
    if (res.target.id == 2) {
      return {
        title: `【${this.data.list.nickname}@你】邀你组队联合打单，${this.data.minmoney}元佣金等你来拿~~`,
        path: `/pages/reward/reward?id=${this.data.recid}&myid=${this.data.myid}`,
        success: function () {
          console.log(that.data.recid, that.data.myid)
        }
      }
    }
  }
})