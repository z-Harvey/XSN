// pages/collage/collage.js
import WxValidate from '/../../utils/WxValidate.js';
import public_r from '/../../utils/public.js';
var Validate = "";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgurl: '',
    sessionKey: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    Validate = new WxValidate(
      {
        name: {
          required: true,
        },
        storeLogo: {
          required: true,
        },
        storeBackgroundPicture: {
          required: true,
        },
        businessIndName: {
          required: true,
        },
        businessCityName: {
          required: true,
        },
        detailAddress: {
          required: true,
        },
        businessDistrict: {
          required: true,
        },
        merchantIntroduction: {
          required: true,
        },
        facilities_content: {
          required: true,
        },
        storePhone: {
          required: true,
        },
        businessHours: {
          required: true,
        },
        personInChargeName: {
          required: true,
        },
        personInChargePhone: {
          required: true,
          tel: true,
        }
      }, {
        name: {
          required: '请输入商户名称',
        },
        storeLogo: {
          required: '请上传LOGO',
        },
        storeBackgroundPicture: {
          required: '请上传商户照片',
        },
        businessIndName: {
          required: '请选择行业',
        },
        businessCityName: {
          required: '请选择地区',
        },
        detailAddress: {
          required: '请填写详细地址',
        },
        businessDistrict: {
          required: '请选择商圈',
        },
        merchantIntroduction: {
          required: '请填写商户介绍',
        },
        facilities_content: {
          required: '请选择便利设施',
        },
        storePhone: {
          required: '请输入客服电话',
        },
        businessHours: {
          required: '请选择营业时间',
        },
        personInChargeName: {
          required: '请填写联系人',
        },
        personInChargePhone: {
          required: '请填写联系人手机号',
          tel: '请输入正确的手机号',
        },
      });
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
  imgTap: function (e) {
    const that = this;
    const thaturl = that.data.imgurl

    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        if (thaturl != '') {
          if (thaturl.length == 4) {
            wx.showToast({
              title: '最多只能上传四张图片',
            })
            return false;
          }
          that.setData({
            imgurl: thaturl.concat(tempFilePaths)
          })
        } else {
          that.setData({
            imgurl: tempFilePaths
          })
        }
      }
    })
  }, formSbumit: function (e) {
    const params = e.detail.value;
    console.log(e.detail.value)
    if (!Validate.checkForm(e)) {
      const error = Validate.errorList[0]
      wx.showToast({
        title: error.msg,
        mask: true,
        icon: 'none'
      })
      return false
    }
    var that = this;
    wx.request({
      url: 'http://wmomo.wicp.net/mxcx/MerchantController/merchantRegister',
      data: params,
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        // that.setData({ submitHidden: true })
        // appInstance.userState.status = 0
        // wx.navigateBack({
        //   delta: 1
        // })
        console.log(res.data)
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  aaa:function(){
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.record']) {
          wx.authorize({
            scope: 'scope.getUserInfo',
            success() {
              // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
              wx.startRecord()
            }
          })
        }
      }
    })
  },
  tiao:function(e){
    console.log('b')
    wx.navigateTo({
      url:'industry/industry'
  })
  }
})