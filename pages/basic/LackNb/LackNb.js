const api = require('../../..//utils/api.js');

Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   * 用于组件自定义设置
   */
  properties: {

  },
  data: {
    yaoqing:{},
    biaoji:{},
    lack:false
  },
  /**
   * 组件的方法列表
   * 更新属性和数据的方法与更新页面数据的方法类似
   */
  methods: {
    close(){
      this.setData({
        lack: false
      })
    },
    show(){
      this.setData({
        lack: true
      })
    },
    toPath(e){
      let data = e.currentTarget.dataset
      console.log(e)
      console.log(data.type == 3)
      if(data.type==1){
          wx.switchTab({
            url: '/pages/twoSeaHome/twoSeaHome',
          })
      }else if(data.type==3){
        console.log(data.type)
        wx.navigateTo({
          url: `/pages/welfare/welfare`,
        })
      }
    }
  },
  created: function () {
    var data = {
      thSessionId: wx.getStorageSync("token"),
      userid: wx.getStorageSync("userid")
    },arr=[],_this=this;
    api.mywelfare(data,function(res){
      res.taskinfo.map(function(p1){
        if (p1.taskmsg == '标记客户') {
          _this.setData({
            biaoji:p1
          })
        }
        if (p1.taskmsg == '邀请新用户') {
          _this.setData({
            yaoqing:p1
          })
        }
      })
    })
  }
})
