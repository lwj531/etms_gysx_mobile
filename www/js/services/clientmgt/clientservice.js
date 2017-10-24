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
    //获取门店人员信息
    this.getclients=function(insId){
      return httpsrv.service("/api/Client/GetClients/"+insId,{},"get");
    };
    //保存新增的门店人员信息
    this.saveclient=function(model){
      return httpsrv.service("/api/Client/SaveClient/",model,"post");
    };
    //获取门店的SKU
    this.getskus=function(insId){
      return httpsrv.service("/api/Institution/GetInstitutionSkuSort/"+ insId,{},"get");
    };
    //保存门店sku排序
    this.saveSkuSort=function(model){
      return httpsrv.service("/api/Institution/SaveInstitutionSkuSort/",model,"post");
    };
    }]);
