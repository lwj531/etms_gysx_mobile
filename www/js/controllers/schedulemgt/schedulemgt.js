angular.module('schedulemgt.ctrl', [])
  .controller('ScheduleMgtCtrl', function ($scope) {
    $scope.NextWeek = function () {
      console.log('NextWeek');
    }
    $scope.PrevWeek = function () {
      console.log('PrevWeek');
    }

  });
