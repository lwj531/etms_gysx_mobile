angular.module("routesetting.srv", ["http.srv"])
  .service("routesettingsrv", ["httpsrv", function (httpsrv) {
    //获取用户下所有的机构
    this.getins = function () {
      return httpsrv.service("/api/Institution/GetInstitutions", {}, "get");
    };
    //获取用户下所有路线图
    this.getroutes = function () {
      return httpsrv.service("/api/Routeline/GetRoutelines", {}, "get");
    };
    //获取路线图明细
    this.getroutedetail = function (routeid) {
      return httpsrv.service("/api/Routeline/GetRouteline/" + routeid, {}, "get");
    };
    //保存路线
    this.saveroute = function (model) {
      return httpsrv.service("/api/Routeline/SaveRouteline", model, "post");
    };
    //删除路线
    this.deteteroute = function (id) {
      return httpsrv.service("/api/Routeline/DelRouteline/" + id, {}, "delete");
    };
    //搜索门店
    this.searchins = function (model) {
      return httpsrv.service("/api/Institution/GetInstitutionsByKey/", model, "post");
    };
    //搜索门店不显示菊花
    this.searchinsnoloading = function (model) {
      return httpsrv.service("/api/Institution/GetInstitutionsByKey/", model, "post", false);
    };
    //无坐标门店
    this.getnolatlngins = function () {
      var model = [{
        Key: "InstitutionLat",
        Value: 0
      },
        {
          Key: "InstitutionLng",
          Value: 0
        }
      ];
      return httpsrv.service("/api/Institution/GetInstitutionsByKey/", model, "post");
    };

    //根据机构返回所在线路
    this.getRoutelinesByInstitution = function (insid) {
      return httpsrv.service("/api/Routeline/GetRoutelinesByInstitution/" + insid, {}, "get");
    };
  }]);
