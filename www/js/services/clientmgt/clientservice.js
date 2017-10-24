angular.module("client.srv", ["http.srv"])
  .service("clientsrv", ["httpsrv", function (httpsrv) {
    //根据Id获取机构信息
    this.getins=function(id){
      return httpsrv.service("/api/Institution/GetInstitutionInfo/"+id,{},"get");
    };
    //获取当前人员信息
    this.getcurrentstaff=function(){
      return httpsrv.service("/api/Staff/GetCurrentStaffInfo/",{},"get");
    };
    }]);
