const Util = require('./util')
const wxapi = require('./wxapi')

const api = function(fn) {
  return {
    // 
    myindexcompany: function (data, fn) {
      Util.request({
        modules: '/index/company',
        method: 'get',
        data: data,
        success: (result) => {
          fn(result)
        }
      })
    },
    mycreatein: function(data, fn) {
      Util.requestpost({
        modules: '/team/recteam',
        method: 'post',
        data: data,
        success: (result) => {
          fn(result)
        }
      })
    },
    recruitsign: function(data,fn){
      Util.request({
        modules: '/recruit/signup',
        method: 'get',
        data: data,
        success: (result) => {
          fn(result)
        }
      })
    },
    getrecruitsign: function (data, fn) {
      Util.requestpost({
        modules: '/recruit/signup',
        method: 'post',
        data: data,
        success: (result) => {
          fn(result)
        }
      })
    },
    setfrined: function (data, fn) {
      Util.requestpost({
        modules: '/user/friend',
        method: 'post',
        data: data,
        success: (result) => {
          fn(result)
        }
      })
    },
    checkfriend: function(data,fn){
      Util.request({
        modules: '/checkfriend',
        method: 'get',
        data: data,
        success: (result) => {
          fn(result)
        }
      })
    },
    /**
     * 返回公司名称
     */
    getnamecom: function (data, fn) {
      Util.request({
        modules: '/getcomname',
        method: 'get',
        data: data,
        success: (result) => {
          fn(result.data)
        }
      })
    },
    /**
     * 绑定手机号
     */
    bindTel: function(data, fn) {
      Util.requestpost({
        modules: '/user/phoneno',
        method: 'post',
        data: data,
        success: (result) => {
          console.log('获取手机号', result)
          fn(result)
        }
      })
    },
    getGroupId: function(data,fn){
      Util.requestpost({
        modules: '/user/getgroupid',
        method: 'post',
        data: data,
        success: (result) => {
          console.log('获取群号', result)
          fn(result)
        }
      })
    },
    /**
    * 首次进入,制作名片
    */
    saveCard: function (data, fn) {
      console.log(data);
      Util.requestpost({
        modules: '/user/regist',
        method: 'post',
        data: data,
        success: (result) => {
          console.log("result-------------",result)
          fn(result)
        }
      })
    },
    /**
    * 制作名片,获取二级目录
    */
    getWork: function (data, fn) {
      console.log(data);
      Util.request({
        modules: '/industry',
        method: 'get',
        data: data,
        success: (result) => {
          fn(result.data)
        }
      })
    },
    /**
   * 首页信息
   */
    getindex: function (data, fn) {
      Util.request({
        modules: '/index',
        method: 'get',
        data: data,
        success: (result) => {
          fn(result)
        }
      })
    },
    // 首页--活动列表 /activity/detail
    activity: function (data, fn) {
      Util.request({
        modules: '/activity/detail',
        method: 'get',
        data: data,
        success: (result) => {
          fn(result.data)
        }
      })
    },
    // 活动列表报名
    activitysign: function (data, fn) {
      Util.requestpost({
        modules: '/activity/signup',
        method: 'post',
        data: data,
        success: (result) => {
          fn(result)
        }
      })
    },
    /**
   * 查询
   */
    search: function (data, fn) {
      Util.request({
        modules: '/query',
        method: 'get',
        data: data,
        success: (result) => {
          console.log("查询内容",result)
          fn(result.data)
        }
      })
    },
    /**
   * 判断用户和公司之间是否标记
   */
    checkmate: function (data, fn) {
      Util.request({
        modules: '/checkmate',
        method: 'get',
        data: data,
        success: (result) => {
          console.log("检查用户和公司之间的标记关系", result)
          fn(result)
        }
      })
    },
    /**
   * 未标记用户标记客户
   */
    markguest: function (data, fn) {
      Util.requestpost({
        modules: '/user/mate',
        method: 'post',
        data: data,
        success: (result) => {
          console.log("标记用户", result)
          fn(result)
        }
      })
    },
    /**
   * 标记用户标记客户
   */
    markguestlock: function (data, fn) {
      Util.request({
        modules: '/user/mate',
        method: 'get',
        data: data,
        success: (result) => {
          console.log("标记用户已解锁", result)
          fn(result)
        }
      })
    },
    /**
       * 创建悬赏
       */
    createrecruit: function (data, fn) {
      Util.requestpost({
        modules: '/recruit/create',
        method: 'post',
        data: data,
        success: (result) => {
          console.log("创建悬赏", result)
          fn(result)
        }
      })
    },
    // 邀请组队
    getfriends: function (data, fn) {
      Util.requestpost({
        modules: '/team/create',
        method: 'post',
        data: data,
        success: (result) => {
          console.log("邀请组队", result)
          fn(result)
        }
      })
    },
    /**
      * 用户获取名
    */
    getmycard: function (data, fn) {
      Util.request({
        modules: '/user/getcard',
        method: 'get',
        data: data,
        success: (result) => {
          console.log("我的名片的渲染", result)
          fn(result)
        }
      })
    },
    /**
      * 渲染我的名片
    */
    mycard: function (data, fn) {
      Util.request({
        modules: '/user/card',
        method: 'get',
        data: data,
        success: (result) => {
          console.log("我的名片的渲染 ", result)
          fn(result.data)
        }
      })
    },
    /**
      * 保存我的名片
    */
    savecard: function (data, fn) {
      Util.requestpost({
        modules: '/user/card',
        method: 'post',
        data: data,
        success: (result) => {
          console.log("保存我的名片", result)
          fn(result)
        }
      })
    },

    /**
      * 我的客户
    */
    myguest: function (data, fn) {
      Util.request({
        modules: '/user/mycustomer',
        method: 'get',
        data: data,
        success: (result) => {
          console.log("我的客户", result.data)
          fn(result)
        }
      })
    },
    /**
      * 更改客户标记
    */
    updateguest: function (data, fn) {
      Util.requestpost({
        modules: '/user/updmate',
        method: 'post',
        data: data,
        success: (result) => {
          console.log(" 更改客户标记", result.data)
          fn(result)
        }
      })
    },
    /**
      * 我的组队---我发起的
    */
    mygroup: function (data, fn) {
      Util.request({
        modules: '/user/myteam',
        method: 'get',
        data: data,
        success: (result) => {
          console.log("我发起的组队", result.data)
          fn(result.data)
        }
      })
    },
    /**
      * 我的组队---我参与的
    */
    mygroupin: function (data, fn) {
      Util.request({
        modules: '/user/inteam',
        method: 'get',
        data: data,
        success: (result) => {
          console.log(" 我参与的组队", result.data)
          fn(result.data)
        }
      })
    },
    /**
      * 我的悬赏---我发起的
    */
    myreward: function (data, fn) {
      Util.request({
        modules: '/recruit/myreward',
        method: 'get',
        data: data,
        success: (result) => {
          console.log("我的悬赏", result.data)
          fn(result.data)
        }
      })
    },
    /**
      * 我的悬赏---我参与的
    */
    myrewardin: function (data, fn) {
      Util.request({
        modules: '/recruit/myinvited',
        method: 'get',
        data: data,
        success: (result) => {
          console.log("我的悬赏", result,result.data)
          fn(result.data)
        }
      })
    },
    getmine: function(data,fn){
      Util.request({
        modules: '/recruit/recdetail',
        method: 'get',
        data: data,
        success: (result) => {
          console.log("chakan我的悬赏", result, result.data)
          fn(result.data)
        }
      })
    },
    /**
      * 我的悬赏详情页面
    */
    myrewardinfo: function (data, fn) {
      Util.request({
        modules: '/recruit/recdetail',
        method: 'get',
        data: data,
        success: (result) => {
          console.log("我的悬赏详情页面", result.data)
          fn(result.data)
        }
      })
    },
    /**
      * 我的悬赏分享页
    */
    myrewardshare: function (data, fn) {
      Util.request({
        modules: '/recruit/recinfo',
        method: 'get',
        data: data,
        success: (result) => {
          console.log("我的悬赏分享页", result.data)
          fn(result.data)
        }
      })
    },
    /**
      * 评价好友
    */
    evaluation: function (data, fn) {
      Util.requestpost({
        modules: '/user/evaluation',
        method: 'post',
        data: data,
        success: (result) => {
          console.log("评价好友", result)
          fn(result)
        }
      })
    },
   
  /**
   * 拉取好友评价标签
 */
  gettags: function (data, fn) {
    Util.request({
      modules: '/gettags',
      method: 'get',
      data: data,
      success: (result) => {
        console.log("拉取好友评价标签", result.data)
        fn(result.data)
      }
    })
  },
    /**
      * 拉取好友的评价
    */
    evaluationinfo: function (data, fn) {
      Util.request({
        modules: '/user/getevaluation',
        method: 'get',
        data: data,
        success: (result) => {
          console.log("拉取好友的评价", result.data)
          fn(result.data)
        }
      })
    },
    /**
      * 同意组队？
    */
    agreen: function (data, fn) {
      Util.requestpost({
        modules: '/team/agree',
        method: 'post',
        data: data,
        success: (result) => {
          console.log("同意组队？", result)
          fn(result)
        }
      })
    },
    /**
      * 删除数据
    */
    del: function (data, fn) {
      Util.requestpost({
        modules: '/team/disshow',
        method: 'post',
        data: data,
        success: (result) => {
          console.log("删除数据", result.data)
          fn(result.data)
        }
      })
    },
    /**
      * 打单结果
    */
    groupresult: function (data, fn) {
      Util.requestpost({
        modules: '/team/over',
        method: 'post',
        data: data,
        success: (result) => {
          console.log("打单结果", result)
          fn(result)
        }
      })
    },
    /**
      * 我的活动
    */
    myactivity: function (data, fn) {
      Util.request({
        modules: '/user/myactivity',
        method: 'get',
        data: data,
        success: (result) => {
          console.log("我的活动", result)
          fn(result.data)
        }
      })
    },
    /**
          * 帮助列表
        */
    myhelp: function (data, fn) {
      Util.request({
        modules: '/help',
        method: 'get',
        data: data,
        success: (result) => {
          console.log("帮助列表", result)
          fn(result.data)
        }
      })
    },
    myhelpinfo: function (data, fn) {
      Util.request({
        modules: '/helpinfo',
        method: 'get',
        data: data,
        success: (result) => {
          console.log("帮助列表详情", result)
          fn(result.data)
        }
      })
    },
   /**
      * 福利中心
    */
    mywelfare: function (data, fn) {
      Util.request({
        modules: '/user/task',
        method: 'get',
        data: data,
        success: (result) => {
          console.log("福利中心", result.data)
          fn(result.data)
        }
      })
    },
    /**
      * 牛币明细
    */
    myicon: function (data, fn) {
      Util.request({
        modules: '/user/niubdetail',
        method: 'get',
        data: data,
        success: (result) => {
          console.log("牛币明细", result.data)
          fn(result.data)
        }
      })
    },  
    /**
     * 获取验证码
   */
    getCode: function (data, fn) {
      Util.request({
        modules: '/user/invitenew',
        method: 'get',
        data: data,
        success: (result) => {
          console.log("获取验证码", result.data)
          fn(result)
        }
      })
    },
    /**
     * 获取手机号注册
   */
    getregistercode: function (data, fn) {
      Util.requestpost({
        modules: '/user/invitenew',
        method: 'post',
        data: data,
        success: (result) => {
          console.log("获取手机号注册", result.data)
          fn(result)
        }
      })
    },
    /**
       * 获取公司名字
     */
    getcomName: function (data, fn) {
      Util.request({
        modules: '/user/work',
        method: 'get',
        data: data,
        success: (result) => {
          console.log("获取公司名字", result.data)
          fn(result)
        }
      })
    },
    /**
      * 工作认证
    */
    myworkprove: function (data, fn) {
      Util.requestpost({
        modules: '/user/workprove',
        method: 'post',
        data: data,
        success: (result) => {
          console.log("工作认证", result.data)
          fn(result)
        }
      })
    },
    // /user/getworkinfo
    /**
      * 工作认证
    */
    myworkinfo: function (data, fn) {
      Util.request({
        modules: '/user/getworkinfo',
        method: 'get',
        data: data,
        success: (result) => {
          console.log("工作认证信息", result.data)
          fn(result.data)
        }
      })
    },
    /**
       * 我的页面
     */
    getmyinfo: function (data, fn) {
      Util.request({
        modules: '/user/mine',
        method: 'get',
        data: data,
        success: (result) => {
          console.log("我的页面", result.data)
          fn(result)
        }
      })
    },

    /**
       * 签到
     */
    signin: function (data, fn) {
      Util.request({
        modules: '/signin',
        method: 'get',
        data: data,
        success: (result) => {
          console.log("我的签到", result.data)
          fn(result)
        }
      })
    },
    // 改变牛币数量
    changecode: function (data, fn){
      Util.requestpost({
        modules: '/sharechange',
        method: 'post',
        data: data,
        success: (result) => {
          console.log("改变牛币数量", result.data)
          fn(result)
        }
      })
    },
    // 获取好友头像
    getfriendimg: function(data,fn){
      Util.request({
        modules: '/user/getnick',
        method: 'get',
        data: data,
        success: (result) => {
          console.log("获取好友头像", result.data)
          fn(result)
        }
      })
    },
    // 获取共同的而用户
    getcomuser: function(data,fn){
      Util.request({
        modules: '/user/getcomcompany',
        method: 'get',
        data: data,
        success: (result) => {
          console.log("获取共同的而用户", result.data)
          fn(result.data)
        }
      })
    }
  }
}()
module.exports = api