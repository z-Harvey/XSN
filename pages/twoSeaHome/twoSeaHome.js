// pages/search/search.js
const api = require('../../utils/api.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    navState: [0,0,0],
    ulLstNone:false,
    listData: [
          {
            "comid": 5603,
            "avatarurl_list": [
              "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKQcricibHm9s9d6E5hRTDHWTLBZr5g1XtImwOBwH0ic5vib3laHLzyjlGibc2UxTLvzN2gtTOTmxrs4WQ/132",
              "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTK8C9x86FTYTzym2CRiajfibgGHdHey4JEkXzxobJ4DjrDLpsFau3uHDUpoiaiaxicpHFa5gxKkHvobrwg/132",
              "https://wx.qlogo.cn/mmopen/vi_32/FP1qr2ceCbX91RrU9unuiasRTHQ2P7jqtMEBicklKeict0mzRInPGicmJ5PVrKMU06547WljuNN2hNPRfR4Z3MicTPw/132"
            ],
            "showrank": 1,
            "comname": "张家口金融控股集团有限公司",
            "allnum": 62
          },
          {
            "comid": 5629,
            "avatarurl_list": [
              "https://wx.qlogo.cn/mmopen/vi_32/PiajxSqBRaEIxfBZFZOo0kArcaMA8koQmuBaw5q5xcHO4EVJdHx6yGNERfLJHBrLUAibjxqAjHRaRs7qrdKXJ3icg/132",
              "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTK8C9x86FTYTzym2CRiajfibgGHdHey4JEkXzxobJ4DjrDLpsFau3uHDUpoiaiaxicpHFa5gxKkHvobrwg/132",
              "https://wx.qlogo.cn/mmopen/vi_32/FP1qr2ceCbX91RrU9unuiasRTHQ2P7jqtMEBicklKeict0mzRInPGicmJ5PVrKMU06547WljuNN2hNPRfR4Z3MicTPw/132"
            ],
            "showrank": 2,
            "comname": "北京掘金控股集团有限公司",
            "allnum": 40
          },
          {
            "comid": 775,
            "avatarurl_list": [
              "https://wx.qlogo.cn/mmopen/vi_32/g50Gv1sfpAETtEcpnHVcn85OSVib8g3qb3OuCa1QvQxBUw4aOTJEcibiaN2W7rzP5icXZ1DF24y3btib6N2QRqyzNsA/132",
              "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKFmdEQ797aNIMFhiaGwPJWRyOLggrT9mAbhaznaym0JeyIqas77icicSpcDU5PtbWZhLZSaUdQUqFhw/132",
              "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTL5qo7fWzND511wnQGTvtBPy0h7FtLFI1iayeYXTRySHAxiaZDSia7EUJ9WprvVwZMibHiakp3DkV97icvw/132"
            ],
            "showrank": 3,
            "comname": "吉林华正农牧业开发股份有限公司",
            "allnum": 28
          },
          {
            "comid": 150,
            "avatarurl_list": [
              "https://wx.qlogo.cn/mmopen/vi_32/g50Gv1sfpAETtEcpnHVcn85OSVib8g3qb3OuCa1QvQxBUw4aOTJEcibiaN2W7rzP5icXZ1DF24y3btib6N2QRqyzNsA/132",
              "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTL5qo7fWzND511wnQGTvtBPy0h7FtLFI1iayeYXTRySHAxiaZDSia7EUJ9WprvVwZMibHiakp3DkV97icvw/132",
              "https://wx.qlogo.cn/mmopen/vi_32/2QhWmbHaiauPHJWozf9MRibkpGVpJq2c16XEPo3SlEr64g1zMU66ctX1famic5xO9jFe6bhm1P0QQZykVlGd9VtYA/132"
            ],
            "showrank": 4,
            "comname": "北京聚牛天下网络科技有限公司",
            "allnum": 16
          },
          {
            "comid": 5681,
            "avatarurl_list": [
              "https://wx.qlogo.cn/mmopen/vi_32/g50Gv1sfpAETtEcpnHVcn85OSVib8g3qb3OuCa1QvQxBUw4aOTJEcibiaN2W7rzP5icXZ1DF24y3btib6N2QRqyzNsA/132",
              "https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83epJHlrZ1pcs2u5Goyu1z51zMUKJ0GcFss2ib5ojafs3w1miaN1PJsS6FlVo0CFWeFHFcaIT80aYMvnA/132",
              "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLBE3Q3ibzGJLTd0hf17ITPcYIV6hPTkOEJF4UKo4UTlpvIqUjukTQoEAWXUiaJudowc0dt67TFkyTQ/132"
            ],
            "showrank": 5,
            "comname": "中国中车股份有限公司",
            "allnum": 10
          },
          {
            "comid": 435,
            "avatarurl_list": [
              "https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83erx6HQAJG6SNjNibep3iaKB6ILxkBvVLTjFgx7iaLnZlffPfQXiaiap7icoaRFJicv3cfJ7mSXj0akW5JwjQ/132",
              "https://prayermo-1256929621.cos.ap-beijing.myqcloud.com/WechatIMG1035.png",
              "https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83erW2iceNjFSwtoPtB1CNPWQfJSuyrM8DPR3iaMUJRGVToDicSIrcrAG4RdSm7r8OA7ztfJJXMCuJmUPg/132"
            ],
            "showrank": 6,
            "comname": "北京东方雨虹防水技术股份有限公司",
            "allnum": 9
          },
          {
            "comid": 267,
            "avatarurl_list": [
              "https://wx.qlogo.cn/mmopen/vi_32/g50Gv1sfpAETtEcpnHVcn85OSVib8g3qb3OuCa1QvQxBUw4aOTJEcibiaN2W7rzP5icXZ1DF24y3btib6N2QRqyzNsA/132",
              "https://prayermo-1256929621.cos.ap-beijing.myqcloud.com/WechatIMG1035.png",
              "https://wx.qlogo.cn/mmopen/vi_32/2mMhyEbKBJCxWIHdxPJO9gibtibhMAibHahD12eaDwXVZM0WztFhVHEl2DiccwA79gfPREllTqbwP51GsribZFcxy9Q/132"
            ],
            "showrank": 7,
            "comname": "京东云计算有限公司",
            "allnum": 20
          },
          {
            "comid": 4395,
            "avatarurl_list": [
              "https://wx.qlogo.cn/mmopen/vi_32/g50Gv1sfpAETtEcpnHVcn85OSVib8g3qb3OuCa1QvQxBUw4aOTJEcibiaN2W7rzP5icXZ1DF24y3btib6N2QRqyzNsA/132",
              "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTIAtibsicGaUUAP6842y6Kk12d0rZg3eq087nlZXQv0t7jLXy1cRdBwDwkC8cVkdRWsEc76AiadmMa2Q/132",
              "https://wx.qlogo.cn/mmopen/vi_32/PiajxSqBRaELteXo0bt4xWkiar2qQQSMyppJWnxnJ2ichTJqaUaGibAxJ9TZDFTd952tibaWxvPiaX8P4iadNTacLZoqQ/132"
            ],
            "showrank": 8,
            "comname": "宁波杉杉股份有限公司",
            "allnum": 7
          },
          {
            "comid": 448,
            "avatarurl_list": [
              "https://wx.qlogo.cn/mmopen/vi_32/g50Gv1sfpAETtEcpnHVcn85OSVib8g3qb3OuCa1QvQxBUw4aOTJEcibiaN2W7rzP5icXZ1DF24y3btib6N2QRqyzNsA/132",
              "https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83erW2iceNjFSwtoPtB1CNPWQfJSuyrM8DPR3iaMUJRGVToDicSIrcrAG4RdSm7r8OA7ztfJJXMCuJmUPg/132",
              "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTI41ZOxfgZoabvKa2ncYJL0xqmJVLuOTeeQcWUJ874Zes22c2ciaZc1ur4oSjicmpubHVY4AIZgRHuQ/132"
            ],
            "showrank": 9,
            "comname": "江苏大才建设集团有限公司",
            "allnum": 5
          },
          {
            "comid": 372,
            "avatarurl_list": [
              "https://wx.qlogo.cn/mmopen/vi_32/g50Gv1sfpAETtEcpnHVcn85OSVib8g3qb3OuCa1QvQxBUw4aOTJEcibiaN2W7rzP5icXZ1DF24y3btib6N2QRqyzNsA/132",
              "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJHIYEickds6dA1lvuMAl2LLia3GdSmZBf3tjFG7u6fowbiawQf4M28NrwTxA2tzHZkMARcl5oJTXOJQ/132",
              "https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83erW2iceNjFSwtoPtB1CNPWQfJSuyrM8DPR3iaMUJRGVToDicSIrcrAG4RdSm7r8OA7ztfJJXMCuJmUPg/132"
            ],
            "showrank": 10,
            "comname": "南京江城工程项目管理有限公司",
            "allnum": 4
          },
          {
            "comid": 182,
            "avatarurl_list": [
              "https://wx.qlogo.cn/mmopen/vi_32/g50Gv1sfpAETtEcpnHVcn85OSVib8g3qb3OuCa1QvQxBUw4aOTJEcibiaN2W7rzP5icXZ1DF24y3btib6N2QRqyzNsA/132",
              "https://prayermo-1256929621.cos.ap-beijing.myqcloud.com/WechatIMG1035.png",
              "https://wx.qlogo.cn/mmopen/vi_32/MlPYG3WoaekGjlib1xGbZdptsEBnSf2hJj5icK5J9k46bqBx5nxK6kiage3E0sbyOviaPIicr1XMDT6wXZ8VIfEv1QA/132"
            ],
            "showrank": 11,
            "comname": "内蒙古蒙牛乳业(集团)股份有限公司",
            "allnum": 14
          },
          {
            "comid": 5690,
            "avatarurl_list": [
              "https://wx.qlogo.cn/mmopen/vi_32/g50Gv1sfpAETtEcpnHVcn85OSVib8g3qb3OuCa1QvQxBUw4aOTJEcibiaN2W7rzP5icXZ1DF24y3btib6N2QRqyzNsA/132",
              "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTIK7sapz4fGma3xtrWtTZIiaKIBbhSicmwRPRN8XHuJ8N2U8KL2tkfoPHonbeQjUMKnG5Wdh9SIlevg/132",
              "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTL5qo7fWzND511wnQGTvtBPy0h7FtLFI1iayeYXTRySHAxiaZDSia7EUJ9WprvVwZMibHiakp3DkV97icvw/132"
            ],
            "showrank": 12,
            "comname": "北京学而思教育科技有限公司",
            "allnum": 19
          }
        ]
  },
  topage: function () {
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },
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
    console.log(this.data.listData)
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  navClick:function(e){
    let ind=e.currentTarget.dataset.index;
    let arr = this.data.navState,arr1=[0,0,0]
    if(arr[ind]==1){
      arr = [0, 0, 0]
      this.setData({
        navState: arr,
        ulLstNone: false
      })
    } else{
      arr1[ind] = 1
      this.industry(arr1)
    }
  },
  industry: function (arr) {
    var _this = this;
    var data = {
        thSessionId: wx.getStorageSync('token'),
        pid: 0
      }
      api.getWork(data, function (data) {
        _this.setData({
          navState: arr,
          ULlistDate: data.industry_list,
          ulLstNone: true
        })
      })
  },
  industrys: function (arr) {
    var _this = this;
    var data = {
        thSessionId: wx.getStorageSync('token'),
        pid: arr.target.dataset.id
      }
      api.getWork(data, function (data) {
        _this.setData({
          LilistDate: data.industry_list
        })
      })
  }
})