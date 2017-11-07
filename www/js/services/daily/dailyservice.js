angular.module("daily.srv", ["http.srv"])
  .service("dailysrv", ["httpsrv", function (httpsrv) {
    //保存计划
    this.savePlan = function (model) {
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
    //获取AE类型选项options
    this.getCheckList = function () {
      return httpsrv.service("/api/SystemType/GetKaItems", {}, "get");
    };
    //保存半天事务
    this.saveHalfdayPlan = function (model) {
      return httpsrv.service("/api/Daily/SaveActivityHalfday", model, "post");
    };
    //保存半天事务
    this.saveHalfdayPlans = function (models) {
      return httpsrv.service("/api/Daily/SaveActivityHalfdays", models, "post");
    };
    //获取一周的实际
    this.getWeekActualList = function (startDate,endDate) {
      return httpsrv.service("/api/Weekly/GetDateRangeActuals/"+ startDate + '/'+ endDate, {}, "get");
    };
    //保存AE计划
    this.savePlanKaInstitution = function (activityDate,model) {
      return httpsrv.service("/api/Daily/SavePlanKaInstitution/"+ activityDate, model, "post");
    };
    //获取AE日计划详细
    this.getAEPlan = function (activityDate) {
      return httpsrv.service("/api/Daily/GetKaInstitutionModels/"+ activityDate, "get");
    };
  }
  ]);
