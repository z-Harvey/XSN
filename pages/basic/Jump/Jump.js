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
    click:function() {
      wx.navigateTo({
        url: '../../pages/welfare/welfare',
      })
    }
  }
})
