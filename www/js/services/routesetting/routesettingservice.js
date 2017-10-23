angular.module("routesetting.srv", ["http.srv"])
  .service("routesettingsrv", ["httpsrv", function (httpsrv) {
    //获取用户下所有的机构
    this.getins = function(){
      return httpsrv.service("/api/Institution/GetInstitutions",{},"get");
    };
    //获取用户下所有路线图
    this.getroutes=function(){
      return httpsrv.service("/api/Routeline/GetRoutelines",{},"get");
    };
    //获取路线图明细
    this.getroutedetail=function(routeid){
      return httpsrv.service("/api/Routeline/GetRouteline/"+routeid,{},"get");
    };
    //保存路线
    this.saveroute=function(model){
      return httpsrv.service("/api/Routeline/SaveRouteline",model,"post");
    };
    //删除路线
    this.deteteroute=function(id){
      return httpsrv.service("/api/Routeline/DelRouteline/"+id,{},"delete");
    };
    //搜索门店
    this.searchins=function(model){
      return httpsrv.service("/api/Institution/GetInstitutionsByKey/",model,"post");
    };
    //无坐标门店
    this.getnolatlngins=function(){
      var model =[{
        Key:"InstitutionLat",
        Value:0
      },
        {
          Key:"InstitutionLng",
          Value:0
        }
      ]
      return httpsrv.service("/api/Institution/GetInstitutionsByKey/",model,"post");
    };

    //根据机构返回所在线路
    this.getRoutelinesByInstitution = function(insid){
      return httpsrv.service("/api/Routeline/GetRoutelinesByInstitution/"+insid,{},"get");
    }
  }]);


















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
