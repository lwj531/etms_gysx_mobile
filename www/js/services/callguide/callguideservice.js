angular.module("guide.srv", ["http.srv"])
  .service("guidesrv", ["httpsrv", function (httpsrv) {

    //获取今日行程
    this.getTodayScheduleList = function (activityDate) {
      return httpsrv.service("/api/Daily/GetCheckinInstitutions/" + activityDate , {}, "get");
    };
    //获取AE日计划行程
    this.getAEDailyPlan = function (activityDate) {
      return httpsrv.service("/api/Daily/GetKaInstitutionModels/" + activityDate , {}, "get");
    };
    //获取已计划行程
    this.getPlanScheduleList = function (activityDate) {
      return httpsrv.service("/api/Daily/GetDailyPlan/" + activityDate , {}, "get");
    };

    //保存签到
    this.saveCheckin = function (model) {
      return httpsrv.service("/api/Checkin/SaveCheckin", model, "post");
    };

    //获取签到信息
    this.getCheckinInfo = function (activityDate,institutionId) {
      return httpsrv.service("/api/Checkin/GetCheckin/"+ activityDate + '/'+ institutionId, {}, "get");
    };

    //获取最近的库存
    this.getlatestinventorys = function (institutionId) {
      return httpsrv.service("/api/Checkin/GetLatestInventorys/"+ institutionId, {}, "get");
    };
    //获取当日填写过的进销存
    this.getdailyinventorys = function (institutionId) {
      return httpsrv.service("/api/Checkin/GetDailyInventorys/"+ institutionId, {}, "get");
    };
    //保存进销存
    this.saveInventory = function (model) {
      return httpsrv.service("/api/Checkin/SaveInventory", model, "post");
    };

    //获取当日填写过的生意回顾
    this.getkareviews = function (activityDate,institutionId) {
      return httpsrv.service("/api/Checkin/GetKaReviews/"+ activityDate + '/'+ institutionId, {}, "get");
    };
    //保存生意回顾
    this.savekareview = function (model) {
      return httpsrv.service("/api/Checkin/SaveKaReview", model, "post");
    };

  }
  ]);
