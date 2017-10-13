angular.module('car.ctrl', ["car.srv"])
  .controller('CarCtrl', function ($scope, carsrv) {
    //获取用户的车辆信息
    $scope.carinfo = function () {
      carsrv.carinfo().then(function (info) {
        console.log(info);
      });
    }
  });
