angular.module('home.ctrl', ['car.srv'])
  .controller('HomeCtrl', function ($scope, $state, carsrv,$ionicHistory) {

    //清除登陆页面的历史纪录
    $ionicHistory.clearHistory();
    $scope.carinfo = function () {
      carsrv.carinfo().then(function (data) {
        $scope.cars = data;
      });
    };
    $scope.loginout=function(){
      localStorage.clear();
    }
  });
