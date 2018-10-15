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
    // 弹窗显示控制
    MotNone: false
  },
  /**
   * 组件的方法列表
   * 更新属性和数据的方法与更新页面数据的方法类似
   */
  methods: {
    gits() {
      //触发成功回调
      if(this.data.MotNone){
        this.setData({
          MotNone:false
        })
      }else{
        this.setData({
          MotNone: true
        })
      }
    },
    phone:function(){
      this.setData({
        MotNone: false
      })
      wx.navigateTo({
        url: '/pages/basic/numReg/numReg',
      })
    },
    getPhoneNumber(e){
      if (e.detail.errMsg == 'getPhoneNumber:ok') {
        var that = this;
        var data = {
          thSessionId: wx.getStorageSync("token"),
          iv: e.detail.iv,
          encryptedData: e.detail.encryptedData
        }
        api.bindTel(data, function (data) {
          if (data.code == 0) {
            wx.setStorageSync('phone', data.data.phoneno);
            let obj = {
              thSessionId: wx.getStorageSync("token"),
              phoneno: data.data.phoneno
            }
            api.bindTelCallUserImg(obj, function (res) {
              wx.setStorageSync('userid', res.data.userid);
              wx.setStorageSync('UserSig', res.data.UserSig);
              that.setData({
                MotNone: false
              })
            })
          } else {
            wx.showModal({
              title: "系统提示",
              content: data.msg,
            })
          }
        });
      }
    }
  }
})
