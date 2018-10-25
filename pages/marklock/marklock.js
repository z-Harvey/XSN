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
    money: null, //未解锁状态时 获取自己的牛币数量与 当前公司解锁需要的牛币数量
    toView: 'eeede',
    dire:true,
    is_reviews: 1,
    reviews_num:Number
  },
  tapNew:function(){
    wx.navigateTo({
      url: `/pages/comComment/comComment?comid=${this.data.id}&comname=${this.data.comname}&unlock=${this.data.unlock}&source=marklock`
    })
  },
  onPageScroll: function (e) {
    var _this = this;
    if (e.scrollTop >= 100) {
      _this.setData({
        showss: true
      })
    } else {
      _this.setData({
        showss: false
      })
    }
    // console.log(e);//{scrollTop:99}
  },
  //滚动到顶部
  jumpTo: function (e) {
    wx.pageScrollTo({
      scrollTop:0
    })
    // console.log(e)
    // // 获取标签元素上自定义的 data-opt 属性的值
    // let target = e.currentTarget.dataset.opt;
    // this.setData({
    //   toView: target
    // })
  },
  toIndex: function(){
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  clock:function(e){
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
  onShow: function (options){
    let _this=this;
    let loginInfo = _this.data.loginInfo,userInfo = _this.data.userInfo;
    //判断是否解锁 
    let obj = {
      thSessionId: loginInfo.token,
      userid: loginInfo.userid,
      comname: _this.data.comname,
      comeid: _this.data.id
    }
    if (_this.data.unlock == 0) {
      _this.setData({
        lockShow: false
      })
      let data = {
        thSessionId: loginInfo.token,
        userid: parseInt(loginInfo.userid),
        comid: _this.data.id,
        comname: _this.data.comname
      }
      api.markguestlock(data, function (res) {// 获取解锁需要的金币数目
        console.log(res)
        _this.setData({
          reviews_list: res.data.reviews_list,
          pri_reviews_list: res.data.reviews_list,
          is_reviews: res.data.is_reviews,
          money: res.data,
          review_niub: res.data.review_niub,
          reviews_num: res.data.reviews_list.length
        })
      })
      api.getmyinfo(data, function (res) {
        console.log(res)
      })
    } else {
      var data = {
        thSessionId: loginInfo.token,
        userid: loginInfo.userid
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
      this.init(_this.data.id, _this.data.comname)
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    let _this = this;
    let loginInfo=_this.data.loginInfo = wx.getStorageSync('loginInfo');
    _this.data.userInfo=wx.getStorageSync('userInfo')
    // 利用页面传递数据进行渲染  公司名称
    _this.setData({
      comname: options.comname,
      id: options.id,
      userid: loginInfo.userid,
      unlock: options.unlock
    })
  },
  showTapList:function(){
    console.log(this.data.dire)
    if (this.data.dire){
      this.setData({
        dire:false
      })
      return
    }
    this.setData({
      dire: true
    })
  },
  init: function (id, comname){
    var that=this;
    let loginInfo = that.data.loginInfo = wx.getStorageSync('loginInfo')
    var data = {
      thSessionId: loginInfo.token,
      userid: loginInfo.userid,
      comid: id,
      comname: comname,
      page_num: that.data.page
    };
    api.markguestlock(data,function(result){
      console.log(result)
      that.setData({
        reviews_list: result.reviews_list,
        pri_reviews_list: result.reviews_list,
        is_reviews: result.is_reviews,
        review_niub: result.review_niub,
        reviews_num: result.reviews_list.length
      })
      result.data.map(function(p1,p2){
        p1.department_list != null ? p1.department_list = p1.department_list.join('、') : p1.department_list=false;
      })
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
    if(that.data.lockShow){
      that.setData({
        page: ++that.data.page
      })
      that.init(that.data.id, that.data.comname);
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return{
      title: `【${this.data.userInfo.nickname}@你】我在销售牛遇到贵人相助，一起组队打单，你也来试试吧~`,
      path: `pages/share/share?username=${this.data.userInfo.nickname}&userid=${this.data.loginInfo.userid}&userimg=${this.data.userInfo.avatarurl}`,
      imageUrl: '/img/my/noneSign.png'
    }
  },
  motShow: function () {
    this.selectComponent("#LackNb").show()
  },
  /**
   * 确认 解锁 按钮
   */
  Unlock:function(e){
    console.log(1)
    
    let loginInfo=this.data.loginInfo
    let data={
      thSessionId: loginInfo.token,
      userid: loginInfo.userid,
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
      _this.motShow()
      return;
    }
  }
})