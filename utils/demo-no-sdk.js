var Util = require('./util');
var config=require('../config.js');

// method: options.method,
//   pathname: options.pathname,
var uploadFile = function (id,fn) {
  var getAuthorization = function (options, callback) {
    wx.request({
      method: 'GET',
      url: config.config.host +'/user/getauth',
      data: {
        thSessionId: wx.getStorageSync('token'),
        userid: wx.getStorageSync('userid'),
        method: options.method,        
      },
      dataType: 'json',
      success: function (result) {
        console.log(result);
        callback(result.data.data);
      }
    });
  };
  // 上传文件
  var uploadFile = function (filePath) {
    var filept=filePath;
    var Key = filePath.substr(filePath.lastIndexOf('.'));
   
    getAuthorization({ method: 'post', pathname: '/' }, function (AuthData) {
      //这里是第一步需要传递的一些参数url: AuthData.Host,
      console.log(AuthData.Host + '/' + AuthData.Cos_work_prove_path + Key);
      var requestTask = wx.uploadFile({
        url: AuthData.Host,
        name: 'file',
        filePath: filePath,
        formData: {
          'success_action_status': 200,
          'Authorization': AuthData.authorization,
          'Content-Type': 'application/xml',
          'x-cos-security-token': '*',
          'key': AuthData.Cos_work_prove_path+Key,
        },
        success: function (res) {
          var Location = AuthData.Cos_work_prove_path + Key;
          var bucket = AuthData.Host+'/'+AuthData.Cos_work_prove_path + Key;
          // var url=path+Key;
          var url=Key;
          if (res.statusCode === 200) {
            wx.showModal({ title: '上传成功', content: Location, showCancel: false });
            fn(filept, bucket, url);
          } else {
            wx.showModal({ title: '上传失败', content: JSON.stringify(res), showCancel: false });
          }
        },
        fail: function (res) {
          wx.showModal({ title: '上传失败', content: JSON.stringify(res), showCancel: false });
        }
      });
    });
  };
  // 选择文件
  wx.chooseImage({
    count: 9, // 默认9
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: function (res) {
      console.log(res.tempFilePaths[0])
      uploadFile(res.tempFilePaths[0]);
    }
  })
};
module.exports = uploadFile;

// requestTask.onProgressUpdate(function (res) {
//   console.log('正在进度:', res);
// });