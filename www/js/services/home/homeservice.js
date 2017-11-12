angular.module("home.srv", ["http.srv"])
  .service("homesrv", ["httpsrv", function (httpsrv) {
    //获取消息列表
    this.getreceivelist = function () {
      return httpsrv.service("/api/Message/GetReceiveList/", {}, "get");
    };
    //发送消息
    this.sendmessage = function (model) {
      return httpsrv.service("/api/Message/SendMessage", model, "post");
    };
  }]);
