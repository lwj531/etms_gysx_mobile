var toolkit = {
  //获取随机数(6位)
  getrandomnumbers: function () {
    var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    var res = "";
    for (var i = 0; i < 6; i++) {
      var id = Math.ceil(Math.random() * 35);
      res += chars[id];
    }
    return res;
  },
  //获取时间戳
  gettimeStamp:function(){
    return  Date.parse(new Date());
  },
  //SHA256加密
  SHA256:function (str) {
    return new Hashes.SHA256().hex(str);
  },
  //base64加密
  Base64Encryption:function(str){
    return new Hashes.Base64().encode(str);
  }
};
