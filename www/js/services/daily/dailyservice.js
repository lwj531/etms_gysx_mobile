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

    //获取一周的实际
    this.getWeekActualList = function (startDate,endDate) {
      return httpsrv.service("/api/Weekly/GetDateRangeActuals/"+ startDate + '/'+ endDate, {}, "get");
    };
  }
  ]);
