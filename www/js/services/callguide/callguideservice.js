angular.module("guide.srv", ["http.srv"])
  .service("guidesrv", ["httpsrv", function (httpsrv) {

    //获取今日行程
    this.getTodayScheduleList = function (activityDate) {
      return httpsrv.service("/api/Daily/GetCheckinInstitutions/" + activityDate, {}, "get");
    };
    //获取AE日计划行程
    this.getAEDailyPlan = function (activityDate) {
      return httpsrv.service("/api/Daily/GetKaInstitutionModels/" + activityDate, {}, "get");
    };
    //获取已计划行程
    this.getPlanScheduleList = function (activityDate) {
      return httpsrv.service("/api/Daily/GetDailyPlan/" + activityDate, {}, "get");
    };

    //保存签到
    this.saveCheckin = function (model) {
      return httpsrv.service("/api/Checkin/SaveCheckin", model, "post");
    };

    //获取签到信息
    this.getCheckinInfo = function (activityDate, institutionId) {
      return httpsrv.service("/api/Checkin/GetCheckin/" + activityDate + '/' + institutionId, {}, "get");
    };

    //获取最近的库存
    this.getlatestinventorys = function (institutionId) {
      return httpsrv.service("/api/Checkin/GetLatestInventorys/" + institutionId, {}, "get");
    };
    //获取库存
    this.getskus = function (institutionId) {
      return httpsrv.service("/api/Product/GetProductSkus/" + institutionId, {}, "get");
    };
    //获取当日填写过的进销存
    this.getdailyinventorys = function (institutionId) {
      return httpsrv.service("/api/Checkin/GetDailyInventorys/" + institutionId, {}, "get");
    };
    //保存进销存
    this.saveInventory = function (model) {
      return httpsrv.service("/api/Checkin/SaveInventory", model, "post");
    };

    //获取当日填写过的生意回顾
    this.getkareviews = function (activityDate, institutionId) {
      return httpsrv.service("/api/Checkin/GetKaReviews/" + activityDate + '/' + institutionId, {}, "get");
    };
    //保存生意回顾
    this.savekareview = function (model) {
      return httpsrv.service("/api/Checkin/SaveKaReview", model, "post");
    };

    //获取KaItem选项
    this.getkaitems = function () {
      return httpsrv.service("/api/SystemType/GetKaItems/", {}, "get");
    };
    //获取计划过的KA机构ITEM
    this.getplandailykaitems = function (activityDate, institutionId) {
      return httpsrv.service("/api/Daily/GetPlanDailyKaItems/" + activityDate + '/' + institutionId, {}, "get");
    };
    //获取实际KA机构ITEM checklist
    this.getactualdailykaitems = function (activityDate, institutionId) {
      return httpsrv.service("/api/Checkin/GetActualDailyKaItems/" + activityDate + '/' + institutionId, {}, "get");
    };
    //保存KA实际ITEM项 checklist
    this.savekaactualitems = function (activityDate, institutionId, model) {
      return httpsrv.service("/api/Checkin/SaveKaActualItems/" + activityDate + '/' + institutionId, model, "post");
    };

    //查询待办事项
    this.gettodo = function (institutionId) {
      return httpsrv.service("/api/Checkin/GetTodo/" + institutionId, {}, "get");
    };
    //保存待办事项
    this.savetodo = function (model) {
      return httpsrv.service("/api/Checkin/SaveTodo", model, "post");
    };
    //删除路线
    this.detetetodo = function (activityId) {
      return httpsrv.service("/api/Checkin/TodoModel/" + activityId, {}, "delete");
    };
  }
  ]);
