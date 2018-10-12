// pages/search/search.js
const api = require('../../utils/api.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    navState: [0, 0],
    relaArr1: [0,0,0,0],
    relaArr2: [0,0],
    sortArr:[1,0,0,0,0],//排序数组
    ulLstNone:false,
    pages_num:1,
    toView:'eeede',
    listData: null//公海数据列表
  },
  /**
   * 跳转到 搜索界面
   */
  topage: function () {
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },
  jumpTo: function (e) {
    console.log(e)
    // 获取标签元素上自定义的 data-opt 属性的值
    let  target = e.currentTarget.dataset.opt;
    console.log(target)
    this.setData({
      toView: target
    })
  },
  /**
   * 登录弹框组件
   */
  showDialog() {
    this.selectComponent("#dialog").gits()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    if(wx.getStorageSync('userid')){
      this.setData({
        butLogin:true
      })
    }else{
      this.setData({
        butLogin:false
      })
    }
  },
  /**
   * 生命周期函数  : 界面渲染与返回界面后触发 
   */
  onShow:function(){
    this.setData({
      pages_num:1
    })
    let _this = this, data = {
      thSessionId: wx.getStorageSync('token'),
      page_num: _this.data.pages_num,//页码
      order_type: '0',//排序
      userid: wx.getStorageSync('userid'),
      relation: '',//客户关系
      hasdecision: ''//决策信息
    }
    api.z_companysea(data, function (res) {
      console.log(res)
      _this.setData({
        listData: res.data
      })
    })
  },
  /**
   * 排序的点击效果事件
   */
  sortBtn:function(e){
    let ind = e.currentTarget.dataset.num;
    let arr = this.data.sortArr, arr1 = [0, 0, 0, 0, 0], order_type = '0', relation = '', hasdecision=''
    if (arr[ind] == 1) {
      arr = [1, 0, 0, 0, 0]
      this.setData({
        sortArr: arr,
      })
    } else {
      arr1[ind] = 1
      this.setData({
        sortArr: arr1,
      })
    }
    this.data.sortArr.map(function(p1,p2){
      p1 == 1 ? order_type = String(p2):''
    })
    this.data.relaArr1.map(function (p1, p2) {//合作
      p1 == 1 ? relation = String(p2) :''
    })
    this.data.relaArr2.map(function (p1, p2) {//决策
      p1 == 1 ? hasdecision = String(p2) : ''
    })
    this.setData({
      listData: [],
      pages_num: 1,
      ulLstNone: false,
      navState: [0, 0]
    })
    this.aja('1', order_type, relation, hasdecision)
  },
  /**
   * NAV的点击效果事件
   */
  navClick:function(e){
    let ind=e.currentTarget.dataset.index;
    let arr = this.data.navState,arr1=[0,0]
    if(arr[ind]==1){
      arr = [0, 0]
      this.setData({
        navState: arr,
        ulLstNone: false
      })
    } else{
      arr1[ind] = 1
      this.setData({
        navState: arr1,
        ulLstNone: true
      })
    }
  },
  /**
   * 确认筛选 与 重置筛选
   */
  industry: function (e) {
    let _this = this, data = e.target.dataset;
    let bur=data.bur;
    let num1='', num2='', num3=''
    if(bur==='true'){
      _this.data.relaArr1.map(function(p1,p2){
        p1 == 1 ?num1 = String(p2) :''       
      })
      _this.data.relaArr2.map(function (p1, p2) {
        p1 == 1 ? num2 = String(p2) : ''
      })
      _this.data.sortArr.map(function (p1, p2) {
        p1 == 1 ? num3 = String(p2) : ''
      })
      console.log(num1)
      _this.setData({
        listData: [],
        pages_num: 1,
        ulLstNone: false,
        navState: [0, 0]
      })
      _this.aja('1', num3, num1, num2);
      
    }else{
      _this.aja('1', '1', '', '');
      _this.setData({
        listData: [],
        pages_num: 1,
        ulLstNone: false,
        navState:[0,0],
        relaArr1:[0,0,0,0],
        relaArr2:[0,0]
      })
    }
  },
  /**
   * 客户关系的点击效果
   */
  rela1: function (e) {
    let _this = this, data = e.target.dataset;
    if(data.num==1){
      if (_this.data.relaArr2[1]==1){
        _this.setData({
          relaArr2:[0,0]
        })
      }
    }
    let arr = [0, 0, 0, 0];
    if (_this.data.relaArr1[data.num] === 0) {
      arr[data.num] = 1;
      _this.setData({
        relaArr1: arr
      })
    } else {
      _this.setData({
        relaArr1: arr
      })
    }
  },
  /**
   * 决策链的点击效果
   */
  rela2: function (e) {
    let _this = this, data = e.target.dataset;
    if(data.num==1){
      if (_this.data.relaArr1[1]){
        return
      }
    }
    let arr = [0, 0, 0, 0];
    if (_this.data.relaArr2[data.num] === 0) {
      arr[data.num] = 1;
      _this.setData({
        relaArr2: arr
      })
    } else {
      _this.setData({
        relaArr2: arr
      })
    }
  },
  togroup:function(e){
    if(!wx.getStorageSync('userid')){
      this.showDialog()
      return
    }
    var params = e.currentTarget.dataset, url, mate = e.target.dataset.mate;
    if (mate == 0) {
      url = `/pages/markguest/markguest?id=${params.id}&comname=${params.comname}`;
        wx.navigateTo({
          url: url,
        })
    } else if (mate == 1) {
      url = `/pages/marklock/marklock?id=${params.id}&comname=${params.comname}&unlock=${params.unlock}`;
        wx.navigateTo({
          url: url,
        })
      }
  },
  showDialog() {
    this.selectComponent("#dialog").gits()
  },
  /**
   * 上拉加载数据
   */
  onReachBottom: function () {
    let _this = this;
    let order_type='0'//排序
      , relation=''//合作关系
      , hasdecision=''//有无决策
      , num = _this.data.pages_num+1
      _this.setData({
        pages_num: _this.data.pages_num+1
      })
    _this.data.relaArr1.map(function (p1, p2) {//合作
      p1 == 1 ? relation = String(p2) :''
    })
    _this.data.relaArr2.map(function (p1, p2) {//决策
      p1 == 1 ? hasdecision = String(p2) : ''
    })
    _this.data.sortArr.map(function (p1, p2) {//排序
      p1 == 1 ? order_type = String(p2) :''
    })
    num = String(num)
    _this.aja(num, order_type, relation, hasdecision)
  },
  aja: function (num, order_type, relation, hasdecision){
    let _this = this, data = {
      thSessionId: wx.getStorageSync('token'),
      page_num: num,//页码
      order_type: order_type,//排序
      userid: wx.getStorageSync('userid'),
      relation: relation,//客户关系
      hasdecision: hasdecision//决策信息
    }
    api.z_companysea(data, function (res) {
      console.log('公海')
      _this.setData({
        listData: _this.data.listData.concat(res.data)
      })
      console.log(res.data)
    })
  }
})