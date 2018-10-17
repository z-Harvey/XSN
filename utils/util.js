var config = require('../config')

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 拓展对象
 */
const extend = function extend(target) {
  var sources = Array.prototype.slice.call(arguments, 1);
  for (var i = 0; i < sources.length; i += 1) {
    var source = sources[i];
    for (var key in source) {
      if (source.hasOwnProperty(key)) {
        target[key] = source[key];
      }
    }
  }
  return target;
};

var noop = function noop() { };

/***
 * @class
 * 表示请求过程中发生的异常
 */
var RequestError = (function () {
  function RequestError(message) {
    Error.call(this, message);
    this.message = message;
  }

  RequestError.prototype = new Error();
  RequestError.prototype.constructor = RequestError;

  return RequestError;
})();

/**
 * 默认参数
 * Url  请求 URL
 * V    接口版本
 * isSign 是否签名 (某些特定接口需要签名 true | false)
 * method 请求方式
 */
var defaultOptions = {
  url: config.config.host,
  v: config.config.conf.V,
  isSign: false,
  method: 'GET',
  success: noop,
  fail: noop,
};

/**
 * request
 * @param {object} options 
 */
/**
 * @method
 * 进行服务器请求
 *
 * @param {Object} options 登录配置
 * @param {string} [options.url] 登录使用的 URL，服务器应该在这个 URL 上处理登录请求
 * @param {string} [options.method] 请求使用的 HTTP 方法，默认为 "GET"
 * @param {string} [options.v] 请求接口版本，默认为 "v1"
 * @param {Function} [options.success(userInfo)] 登录成功后的回调函数，参数 userInfo 微信用户信息
 * @param {Function} [options.fail(error)] 登录失败后的回调函数，参数 error 错误信息
 */
const request = options => {
  console.log(options);
  let data
  if (typeof options !== 'object') {
    var message = '请求传参应为 object 类型，但实际传了 ' + (typeof options) + ' 类型';
    throw new RequestError(message);
  }
  options = extend({}, defaultOptions, options);
  // options.data = extend({}, options.data, { 
  //   token: wx.getStorageSync('user_token') || ''
  // })
  data = options.data
  // console.log('')
  // console.log('------ start ------')
  // 签名
  if (options.isSign) {
    console.log(`tooth_${Qs.stringify(data)}_stop`)
    // console.log('签名原串 [排序前] >>> ', JSON.stringify(data))
    //data.token = `tooth_${Qs.stringify(data)}_stop`
    // console.log('签名原串 [排序后] >>> ', data.sign)
    // console.log(data)
    // data.token = md5(data.token)
    // console.log('签名 [sign] >>> ', data.sign)

    //data.key = config.config.conf.KEY
    // console.log('请求参数 >>> ', Qs.stringify(data))
  }

  wx.request({
    url: options.url + options.v + options.modules,
    method: options.method,
    data: data,
    header: {
      'content-type':'application/json'
    },
    success: response => {
      if (response.data.code == 0 || response.data.code == 1 || response.data.code == 2) {
        options.success(response.data)
      } else if (response.data.code == -1) {
        wx.clearStorage("token");
        // wx.showModal({
        //   title: "系统提示",
        //   content: response.data.msg,
        // })
        options.success(response.data)
      } else if (response.data.msg) {
        console.log(response)
        wx.showModal({
          title: "系统提示",
          content: response.data.msg,
        })
      }
    },
    fail: function (error) {
      options.fail(error)
      options.fail("------------------")
    },
    /**
     * 登录失败的回调
     */
    complete: function (res) {
      options.fail(res)
    }
  })
}


const requestpost = options => {
  let data
  if (typeof options !== 'object') {
    var message = '请求传参应为 object 类型，但实际传了 ' + (typeof options) + ' 类型';
    throw new RequestError(message);
  }
  options = extend({}, defaultOptions, options);
  
  data = options.data

  if (options.isSign) {
    console.log(`tooth_${Qs.stringify(data)}_stop`)
  }

  wx.request({
    url: options.url + options.v + options.modules,
    method: options.method,
    data: data,
    header: {
      'content-type':'application/x-www-form-urlencoded'
    },
    success: response => {
      console.log("---------success---------------", response)
      if (response.data.code == 0 || response.data.code == 1 || response.data.code == 2) {
        options.success(response.data)
      } else if (response.data.code==-1) {
        console.log("------------------------",response)
        wx.clearStorage("token");        
        wx.showModal({
          title: "系统提示",
          content: response.data.msg,
        })
      }else if (response.data.msg) {
        console.log(response)
        wx.showModal({
          title: "系统提示",
          content: response.data.msg,
        })
      }
    },
    fail: function (error) {
      options.fail("------------------",error)
    },
    complete: function(res){
      console.log("无论成功还是失败都会执行性",res)
    }
  })
}



module.exports = {
  formatTime: formatTime,
  request: request,
  requestpost: requestpost
}