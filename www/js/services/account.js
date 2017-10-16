angular.module("account.srv", [])
  .service("accountsrv", [
    "$http", "$q", function ($http, $q) {
      //登陆
      this.signin = function (model) {
        var deferred = $q.defer();
        $http({
          method: "post",
          url: "http://10.10.10.58/api/Account/SignIn/",
          data: model
        }).success(function (data) {
          deferred.resolve(data);
        }).error(function (data) {
          deferred.reject(data)
        });
        return deferred.promise;
      };
    }
  ]);
