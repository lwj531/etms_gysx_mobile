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

    // //CCR获取我负责的机构总店
    // this.getMyInstitutionList = function () {
    //   return httpsrv.service("/api/Institution/GetInstitutions", {}, "get");
    // };
  }
  ]);
