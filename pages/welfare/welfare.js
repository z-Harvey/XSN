// pages/welfare/welfare.js
const api = require("../../utils/api");

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
    this.setData({
      nickname: wx.getStorageSync("userInfo").nickName
    })
    this.init();
  },
  init: function(){
    var that = this;
    var data = {
      thSessionId: wx.getStorageSync("token"),
      userid: wx.getStorageSync("userid")
    }
    api.mywelfare(data,function(result){
      var day = [], newperson = [];
      for (var i = 0; i < result.taskinfo.length; i++) {
        if (result.taskinfo[i].isdaily && result.taskinfo[i].taskid != 9 && result.taskinfo[i].taskid != 6) {
          day.push(result.taskinfo[i])
        } else if (!result.taskinfo[i].isdaily){
          newperson.push(result.taskinfo[i])
        }
      }
      that.setData({
        gettednum: result.gettednum,
        cangetnum: result.cangetnum,
        welfare: result.taskinfo,
        niub_num: result.niub_num,
        day:day,
        newperson: newperson
      })
      console.log(day);
    })
  },
  toPath: function (e) {
    var data = e.currentTarget.dataset, url;
    if(data.id==1){
      url = `/pages/editcard/editcard`;
    } else if (data.id == 4 || data.id == 5 || data.id == 12){
      url = `/pages/search/search`;
    } else if (data.id == 11 || data.id == 10) {
      url = `/pages/mygroup/mygroup`;
    } else if (data.type==="navHome") {
      wx.switchTab({
        url: '../index/index',
      })
    }
    wx.navigateTo({
      url: url,
    })
  },
  toIcon: function(e){
    var data = e.currentTarget.dataset;
    var url = data.url;
    var content=data.content;
    wx.navigateTo({
      url: url+'?content='+content,
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
  sharesuccess: function(){
    var data = {
      thSessionId: wx.getStorageSync("token"),
      userid: wx.getStorageSync("userid"),
      changetype: 'ShareGroups'
    }
    api.changecode(data, function (res) {
      console.log("已经分享成功了");
      if (res.code == 0) {
        console.log("分享到微信群成功")
      }
    })
  },
  // getGroupId: function(data,that){
  //   api.getGroupId(data,function(res){
  //     console.log(res.data.openGId);
  //     var groupid = res.data.openGId;
  //     var arr = [];
  //     if (wx.getStorageSync("group")) {
  //       arr = wx.getStorageSync("group")
  //     } else {
  //       arr.push(groupid);
  //     }
  //     for (var i = 0; i < arr.length; i++) {
  //       if (arr[i].id == list.id) {
  //         arr.splice(i, 1)
  //         arr.unshift(groupid)
  //         break;
  //       } else {
  //         arr.unshift(groupid)
  //         break;
  //       }
  //     }
  //     wx.setStorageSync('group', arr);
  //     console.log("群数组",arr);
  //     if(arr.length>=5){
  //       that.sharesuccess();
  //     }
  //   })
  // },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var that=this;
    wx.showShareMenu({
      withShareTicket: true
    })
    if (res.target.id == 2) {
      return {
        title: `【${this.data.nickname}@你】我在销售牛遇到贵人，组队一起联合打单，你也来试试吧~~`,
        path: '/pages/index/index',
        success: (res) => {   
          var num = wx.getStorageSync("sharenum") ? wx.getStorageSync("sharenum"):0;
          num++;
          wx.setStorageSync("sharenum",num);
            that.sharesuccess();
          // var shareTickets = res.shareTickets;
          // wx.getShareInfo({
          //   shareTicket: shareTickets[0],
          //   success: (res) => {
          //     var data = {
          //       thSessionId: wx.getStorageSync("token"),
          //       iv: res.iv,
          //       encryptedData: res.encryptedData
          //     }
          //     console.log(res,data,'获取群id');
          //     that.getGroupId(data,that);
          //   },
          // })
          // that.sharesuccess()
          // var group = wx.getStorageSync("group") ? wx.getStorageSync("group"):0+1;
          // wx.setStorageSync("group",group);
          // console.log(group);
            // `/pages/share/share?userid=${wx.getStorageSync("userid")}`
        },
        fail: function (res) {
          // 分享失败
          console.log(res)
        } 
      }
    }else if (res.target.id == 3) {
      console.log("邀请页面")
      return {
        title: `【${this.data.nickname}@你】我在销售牛轻松搞定客户，还把老资源变现了，邀你一起赚钱，快来注册吧~`,
        path: `/pages/share/share?userid=${wx.getStorageSync("userid")}`,
        success: function (res){
          console.log(res)
        }
      }
    }
  }
})