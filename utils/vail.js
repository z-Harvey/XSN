//验证
var wxapi = require('./wxapi')

var vail = function(fn){
  return {
    empty : function(d,msg,b){
      if (!d) {
        wxapi.dialog("", (b ? "请" + b : "请输入") + msg)
        return false
      }
      return true
    },
    
  }
}()
module.exports = vail