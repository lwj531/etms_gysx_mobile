angular.module("daily.srv", ["http.srv"])
  .service("dailysrv", ["httpsrv", function (httpsrv) {
    //保存计划
    this.savePlan = function (model) {
      //test
      return httpsrv.service("/api/Daily/SaveActivityRouteline", model, "post");
    };
  }
  ]);
