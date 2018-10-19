// pages/basic/inputAlert/inputAlert.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    show:false,
    inpVal: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    disNone:function(bur){
      this.setData({
        show:bur
      })
    },
    inpValue:function(e){
      if(e.detail.value==' '){
        this.setData({
          inpVal: ''
        })
        return
      }
      this.setData({
        inpVal: e.detail.value
      })
    },
    operation:function(e){
      let that=this;
      if (e.currentTarget.dataset.bur==='true'){
        if (that.data.inpVal!=''){
          this.triggerEvent('myevent', { paramBtoA: that.data.inpVal });
          this.setData({
            show: false,
            inpVal: ''
          })
        }
      }else{
        this.setData({
          show: false
        })
      }
    }
  }
})
