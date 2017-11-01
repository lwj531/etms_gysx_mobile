angular.module("daily.srv", ["http.srv"])
  .service("dailysrv", ["httpsrv", function (httpsrv) {
    //保存计划
    this.savePlan = function (model) {
      //test
      return httpsrv.service("/api/Daily/SaveActivityRouteline", model, "post");
    };
    //获取一周的计划
    this.getWeekPlanList = function (startDate,endDate) {
      return httpsrv.service("/api/Weekly/GetDateRangePlans/"+ startDate + '/'+ endDate, {}, "get");
    };
    //获取半天事务类型options
    this.getHalfdayType = function () {
      return httpsrv.service("/api/SystemType/GetHalfdays", {}, "get");
    };
    //保存半天事务
    this.saveHalfdayPlan = function (model) {
      return httpsrv.service("/api/Daily/SaveActivityHalfday", model, "post");
    };
  }
  ]);
