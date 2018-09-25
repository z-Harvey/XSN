// pages/reward/reward.js
const wxapi = require("../../utils/wxapi.js");
const api = require("../../utils/api");
const Util = require("../../utils/util");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickname: wx.getStorageSync("userInfo").nickName,
    show: true,
  },
  showModal: function (that) {
    wx.showModal({
      title: '提交成功',
      content: '您的组队申请已发送至悬赏发起者，请耐心等待悬赏结果~',
      confirmText: '我的悬赏',
      cancelText: '返回',
      success: function (res) {
        console.log("成功",res)
        if (res.confirm){
          wx.navigateTo({
            url: `/pages/myreward/myreward`,
          })
        }else{
          // wx.navigateTo({
          //   url: `/pages/reward/reward?id=${that.data.recid}`,
          // })
        }
      },
      fail: function () {
       console.log("失败不需要处理")
      }
    })
  },
  agreegroup: function(that){
    var data = {
      thSessionId: wx.getStorageSync("token"),
      userid: wx.getStorageSync("userid"),
      comid: that.data.comid,
      comname: that.data.comname,
      puserid: that.data.puserid,
      message: that.data.message,
      recid: that.data.recid
    };
    console.log(data)
    api.recruitsign(data, function (result) {
      console.log(result)
      if (result.code == 0) {
        that.showModal(that);    
        that.setData({
          successbtn: 1
        })  
      }
    })
  },
  toPath: function (e) {
    var that=this;
    var url;
    var data = e.currentTarget.dataset;
    if (data.type == 1) {
      console.log("判断我和这家公司的关系")
      var da = {
        userid: wx.getStorageSync('userid'),
        thSessionId: wx.getStorageSync('token'),
        comid: that.data.comid,
      }
      api.checkmate(da, function (data) {
        console.log("我和这家公司的关系",data)
        if (data.data.has_mate == 0) {
          console.log("我和这家公司没有关系")
          url = `/pages/rewardmark/rewardmark?comid=${that.data.comid}&comname=${that.data.comname}&id=${that.data.recid}&puserid=${that.data.puserid}`;
          console.log(url);
          wx.navigateTo({
            url: url,
          })
        } else if (data.data.has_mate == 1) {
          console.log("我和这家公司有关系,向后台发起组队成功");
          that.agreegroup(that);
          // url = `/pages/marklock/marklock?id=${that.data.comid}&comname=${that.data.comname}`;
          // wx.navigateTo({
          //   url: url,
          // })
        }
      })
    } else if (data.type == 2) {
      url = "/pages/index/index",
      wx.reLaunch({
        url: url,
      })
    }
  },
  getPhoneNumber: function (e) {
    if (e.detail.errMsg == 'getPhoneNumber:ok') {
    var that=this;
    var data = {
      thSessionId: wx.getStorageSync("token"),
      iv: e.detail.iv,
      encryptedData: e.detail.encryptedData
    }
    api.bindTel(data, function (data) {
      if (data.code == 0) {
        that.setData({
          show: false
        })
        wx.setStorageSync('phone', data.data.phoneno);
        wx.navigateTo({
          url: `/pages/card/card?typea='recid'`,
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    console.log(options.userid == wx.getStorageSync('userid'))
    if (options.userid == wx.getStorageSync('userid')) {
      this.setData({
        butBlockNone: true
      })
    }else{
      this.setData({
        butBlockNone: false
      })
    }
    var that = this;
    this.setData({
      recid: options.id,
      myid: options.myid,
      reactid: wx.getStorageSync('userid'),
      puserid: options.myid
    })
    if (wx.getStorageSync("token")) {
      var commondata = {
        thSessionId: wx.getStorageSync("token"),
        recid: options.id,
        userid: wx.getStorageSync('userid')
      }
      if (options.myid == wx.getStorageSync('userid')) {
        this.ini(commondata);
      } else {
        this.init(commondata);
      }
    } else {
      wxapi.getUser();
      wx.login({
        success: (res) => {
          Util.request({
            modules: '/login',
            method: 'get',
            data: {
              code: res.code
            },
            success: (result) => {
              console.log(result);
              if (result.code == 0) {
                wx.setStorageSync("token", result.data.thSessionId)
                wx.setStorageSync('userid', result.data.userid)
              } else if (result.code == 1) {
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
              // that.init(that, options.userid);

            }
          })
        }
      })
    }

    if (wx.getStorageSync("userid")) {
      this.setData({
        showbtn: false
      })
    } else {
      this.setData({
        showbtn: true
      })
    }
  },
  ini: function (data) {
    //悬赏的请求--我的悬赏详情接口
    var that = this;
    api.getmine(data,function(result){
      console.log(result);
      that.setData({
        list: result,
        minmoney: result.minmoney,
        maxmoney: result.maxmoney,
        comid: result.comid,
        comname: result.comname,
        message: result.message,
        successbtn: result.isinvited,
        invitees: result.invitees
      })
    })
  },
  init: function(data){
    var that=this;
    api.myrewardshare(data, function (result){
      console.log(result);
      that.setData({
        list: result[0],
        minmoney: result[0].minmoney,
        maxmoney: result[0].maxmoney,
        comid: result[0].comid,
        comname: result[0].comname,
        message: result[0].message,
        successbtn: result[0].isinvited
      })
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
    if (res.target.id == 1) {
      return {
        title: `【${this.data.nickname}@你】邀你组队联合打单，${this.data.minmoney}元佣金等你来拿~~`,
        path: `/pages/reward/reward?id=${this.data.recid}&myid=${this.data.reccreate}`
      }
    }
  }
})