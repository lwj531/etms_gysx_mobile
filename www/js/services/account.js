angular.module("account.srv", ["http.srv"])
  .service("accountsrv", ["httpsrv", function (httpsrv) {
    //登陆
    this.signin = function (model, showloading) {
      return httpsrv.service("/api/Account/SignIn/", model, "post", showloading);
    };
  }
  ]);
