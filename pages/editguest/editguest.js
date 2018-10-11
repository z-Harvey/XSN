// pages/markguest/markguest.js
var app = getApp().globalData;
const api = require("../../utils/api");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    comid: null,
    comname: '',
    btninfo: ['有过合作', '正在合作', '有过跟进', '正在跟进'],
    activeBtn: null,
    activebtn: null,
    seleText: ['销售', '销售牛', '销售牛1', '销售牛2', '销售牛2', '销售牛2', '销售牛2'],
    playContent: '请选择线索相关的决策部门名称',
    seleCShow:false,
    seleBox:false,
    UpladPlay:'',
    department:null//决策部门信息列表
  },
  /**
   * 提交
   */
  toPath: function (e) {
    var that = this;
    var has = this.data.activebtn, UpladPlay;
    if(has==0){
      UpladPlay = this.data.UpladPlay
    }else{
      UpladPlay = ''
    }
    var data = {
      thSessionId: wx.getStorageSync('token'),
      userid: wx.getStorageSync('userid'),
      comid: this.data.comid,
      comname: this.data.comname,
      relation: this.data.activeBtn,
      hasdecision: has,
      department: UpladPlay
    }
    api.updateguest(data, function (result) {
      console.log(result)
      if (result.code==0) {
        wx.showLoading({
          title: '提交成功',
          success: function(){
            setTimeout(function(){
              wx.switchTab({
                url: '../my/my',
              })
              return
            },1000)
          }
        })
      }
    })
  },
  changeBtn: function (e) {
    this.setData({
      activeBtn: e.currentTarget.dataset.index
    })
    if (e.currentTarget.dataset.index==1){
      this.setData({
        activebtn: 0,
        seleBox:true
      })
    }
  },
  changebtn: function (e) {
    this.setData({
      activebtn: e.currentTarget.dataset.index
    })
    if (e.currentTarget.dataset.index==0){
      this.setData({
        seleBox: true
      })
    }else{
      this.setData({
        seleBox: false
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    let userid = wx.getStorageSync('userid'), token = wx.getStorageSync('token');
    var that=this,arr;
    if (options.comid) {
      var da = {
        userid:userid,
        thSessionId: token,
        comid: options.comid
      }
      api.checkmate(da, function (result) {
        console.log(result);
        let str;
        arr = result.data.department_list
        if(arr!=null&&arr!=''){
          str=arr.join('、')
        }else{
          str = '请选择线索相关的决策部门名称'   
        }
        that.setData({
          content: result.data,
          comname: result.data.comname,
          comid: result.data.comid, 
          activebtn: result.data.hasdecision,
          activeBtn: result.data.relation,
          seleBox: result.data.hasdecision == 0 ? true:false,
          playContent:str
        })
      })
    }
    let data={
      thSessionId: token
    }
    api.z_department(data, function (res) {// 拉取决策部门名称
      res.data.map(function (p1, p2) {
        p1['show'] = false;
        if(arr!=null&&arr!=''){
          arr.map(function (s1) {
            if (s1 == p1.department) {
              p1.show = true
            }
          })
        }
      })
      that.setData({
        department: res.data
      })
    })
  },
  listClick:function(e){
    let data=e.target.dataset,dep=this.data.department,num=0;
    dep.map(function(p1,p2){
      p1.show?num++:num;
    })
    if (num >= 3 && !dep[data.index].show ){
      return false
    }
    dep[data.index].show = !dep[data.index].show
    this.setData({
      department:dep
    })
  },
  /**
   *  决策部门点击确定时执行
   */
  seleOK:function(){
    this.data.playContent
    let dep = this.data.department, str, arr = new Array, arr1 = new Array,numStr;
    dep.map(function(p1,p2){
      if(p1.show){
        arr.push(p1.department)
        arr1.push(p1.id)
      }
    })
    numStr=arr1.join('|')
    str=arr.join('、')
    this.setData({
      UpladPlay:numStr,
      playContent: str != '' ? str :'请选择线索相关的决策部门名称',
      // seleCShow: false
    })
    if (this.data.seleCShow) {
      this.setData({
        seleCShow: false
      })
    } else {
      this.setData({
        seleCShow: true
      })
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})