angular.module('home.ctrl', ['car.srv'])
  .controller('HomeCtrl', function ($scope, $state, carsrv) {
    $scope.carinfo = function () {
      carsrv.carinfo().then(function (data) {
        $scope.cars = data;
      });
    };
    $scope.loginout=function(){
      localStorage.clear();
    };


  });
