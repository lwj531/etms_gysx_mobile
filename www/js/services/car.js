angular.module("car.srv", [])
  .service("carsrv", [
    "$http", "$q", function ($http, $q) {
      //获取当前用户下的车辆信息
      this.carinfo = function () {
        var deferred = $q.defer();
        $http({
          method: "get",
          url: "http://10.10.10.58/api/Car/Info/"
        }).success(function (data) {
          deferred.resolve(data);
        }).error(function (data) {
          deferred.reject(data);
        })
        return deferred.promise;
      }
    }
  ]);
