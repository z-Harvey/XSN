// pages/markguest/markguest.js
var app=getApp().globalData;
const api = require("../../utils/api");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    comid: null,
    comname: '',
    btninfo: ['有过合作', '正在合作', '有过跟进','正在跟进'],
    activeBtn: 0,
    activebtn: 0,
    show: false,
    UpStr:null,
    department: null,//部门信息 Array
    selBur:false,//选择部门的下拉列表 是否隐藏
    selConTitleText:'请选择线索相关的决策部门名称',
    selNone: true//下拉按钮 是否隐藏
  },
  toPath: function(e){
    if(e.target.dataset.ext==1){
      wx.navigateBack({
        delta:1
      })
      return
    }
    var that=this;
    var data = {
      thSessionId: wx.getStorageSync('token'),
      userid: wx.getStorageSync('userid'),
      comid: this.data.comid,
      comname: this.data.comname,
      relation: this.data.activeBtn,
      hasdecision: this.data.activebtn,
      department: this.data.UpStr ? this.data.UpStr : ''
    }
    
    this.changestate();
    api.markguest(data, function (result){
      that.setData({
        show: false
      })
      if(result.code == 0){
        wx.redirectTo({
          url: `/pages/marklock/marklock?id=${that.data.comid}&comname=${that.data.comname}&unlock=${result.data.isunlock}`,
        })
      }else{
        wx.redirectTo({
          url: `/pages/markerror/markerror?comid=${that.data.comid}&comname=${that.data.comname}`,
        })
      }
    })
  },
  changestate: function(){
    this.setData({
      show: true
    })
    wx.setNavigationBarTitle({
      title: '匹配搜索'
    })
  },
  changeBtn: function(e){
    this.setData({
      activeBtn: e.currentTarget.dataset.index
    })
    if (e.currentTarget.dataset.index == 1) {
      this.setData({
        activebtn: 0,
        selNone: true        
      })
    }
  },
  changebtn: function (e) {
    if (e.target.dataset.index == 0) {
      this.setData({
        selNone: true
      })
    } else {
      this.setData({
        selNone: false
      })
    }
    this.setData({
      activebtn: e.currentTarget.dataset.index
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    this.init(options.id,this)
    let _this = this, data = {
      thSessionId: wx.getStorageSync('token')
    }
    api.z_department(data, function (res) {// 拉取决策部门名称
      res.data.map(function(p1,p2){
        p1['show']=false
      })
      _this.setData({
        department: res.data
      })
    })
  },
  init: function (id, that) {
    var data = {
      comid: id,
      thSessionId: wx.getStorageSync('token'),
    }

    api.getnamecom(data, function (result) {
      that.setData({
        comid: result[0].comid,
        comname: result[0].comname
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
  onShareAppMessage: function () {
  
  },
  /**
   * 点击select出现下拉事件
   */
  selBut:function(){
    if (this.data.selBur){
      this.setData({
        selBur:true
      })
    }else{
      this.setData({
        selBur: true
      })
    }
  },
  /**
   * 部门名称选择的确认按钮
   */
  depBut:function(event){
    let str='',arr=[],arr1=[];
    this.setData({
      selBur:false
    })
    this.data.department.map(function(p1,p2){
      if(p1.show){
        arr.push(p1.id);
        arr1.push(p1.department)
      }
    })
    str=arr.join('|')
    this.setData({
      UpStr:str,
      selConTitleText: arr1.length > 0 ? arr1.join('、'): '请选择线索相关的决策部门名称' 
    })
    return false;
  },
  /**
   * 部门名称下拉列表 的多选
   */
  listBtn:function(e){
    var _this=this;
    var arr = _this.data.department,num=0;
    _this.data.department.map(function(p1,p2){
      p1.show?num++:num
    })
    if(num<3||e.target.dataset.data.show){
      _this.data.department.map(function (p1, p2) {
        if (p1.id == e.target.dataset.data.id) {
          if (arr[p2].show) {
            arr[p2].show = false
          } else {
            arr[p2].show = true
          }
          _this.setData({
            department: arr
          })
        }
      })
    }
  }
})