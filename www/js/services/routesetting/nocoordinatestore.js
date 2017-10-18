angular.module("routesetting.srv", ["http.srv"])
  .service("routesettingsrv", ["httpsrv", function (httpsrv) {
      //获取当前用户下的负责的机构中的无坐标机构
     /* this.nocoordinatestoreinfo = function () {
        var deferred = $q.defer();
        $http({
          method: "get",
        //  url: "http://10.10.10.58/api/Car/Info/"
        }).success(function (data) {
          deferred.resolve(data);
        }).error(function (data) {
          deferred.reject(data);
        });
        return deferred.promise;
      };*/
    this.nocoordinatestoreinfo = function () {
      return httpsrv.service("/api/Account/SignIn/", {}, "get", true);
    };

    }
  ]);
