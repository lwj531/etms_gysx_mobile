angular.module("routesetting.srv", ["http.srv"])
  .service("routesettingsrv", ["httpsrv", function (httpsrv) {
      //获取当前用户下的负责的机构中的无坐标机构
    this.nocoordinatestoreinfo = function () {
      return httpsrv.service("/api/Account/SignIn/", {}, "get", true);
    };
    //关键字搜索查询机构
    this.keywordsearchstore = function(){
      return httpsrv.service("/api/Account/SignIn/", {}, "get", true);
    };
    //保存路线信息
    this.saveroutelineinfo = function(){
      return httpsrv.service("/api/Account/SignIn/", {}, "get", true);
    };
    //删除路线
    this.deleterouteline = function(){
      return httpsrv.service("/api/Account/SignIn/", {}, "get", true);
    };

    }
  ]);
