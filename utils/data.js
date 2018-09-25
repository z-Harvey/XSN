const newwelfare=[
  { title: '新手礼包', con: '完成注册', num: 50, btnTxt: '已领取', url: '' },
  {
    title: '完善个人信息', con: '填写个人名片信息至100%', num: 10, btnTxt: '去填写', url: '/pages/editcard/editcard'
  },
  {
    title: '关注公众号', con: '关注销售牛公众号', num: 10, btnTxt: '去关注', url: ''
  },
  {
    title: '首次标记客户', con: '首次在找客情中标记客户', num: 10, btnTxt: '去标记', url: '/pages/search/search'
  },
  {
    title: '首次标记已合作的客户', con: '首次在找客情中标记有过合作或正在合作的客户', num: 50, btnTxt: '去标记', url: '/pages/search/search'
  },
  {
    title: '累计标记客户达10家', con: '在找客情中标记客户累积达到10家', num: 300, btnTxt: '去标记', url: '/pages/search/search'
  }
]

const daywelfare = [
  {
    title: '每日签到', con: '每日登陆销售牛', num: 10, btnTxt: '已领取', url: '' },
  {
    title: '分享朋友圈', con: '将销售牛分享至朋友圈，每次分享一次，上限五次', num: 20, btnTxt: '去分享', url: ''
  },
  {
    title: '分享微信群', con: '将销售牛分享至微信群，每群每天一次，上限五次', num: 20, btnTxt: '去分享', url: ''
  },
  {
    title: '邀请新用户', con: '分享海报邀请新用户注册成功', num: 100, btnTxt: '去邀请', url:'/pages/share/share'
  },
  {
    title: '联合打单成功分享', con: '标记打单结束后分享至微信群', num: 30, btnTxt: '去标记', url: '/pages/mygroup/mygroup'
  },
  {
    title: '好评后分享', con: '条件：5星好评后分享至微信群', num: 300, btnTxt: '去评价', url: '/pages/mygroup/mygroup'
  }
]

module.exports={
  newwelfare,
  daywelfare
}