angular.module('checklist.ctrl', ['guide.srv', 'client.srv'])
  .controller('ChecklistCtrl', function($scope, guidesrv, clientsrv, $stateParams) {
    $scope.insID = $stateParams.insId;
    $scope.staffID = $stateParams.staffId;
    console.log($scope.insID);
    console.log($scope.staffID);

    $scope.dateToday = moment();


    guidesrv.getkaitems().then(function (data) {
      $scope.KAItems = data;
      console.log($scope.KAItems);
    });
    guidesrv.getplandailykaitems($scope.dateToday.format('YYYY-MM-DD'), $scope.insID).then(function (data) {
      $scope.planDailyKAItems = data;
      console.log($scope.planDailyKAItems);
    });
    guidesrv.getactualdailykaitems($scope.dateToday.format('YYYY-MM-DD'), $scope.insID).then(function (data) {
      $scope.actualDailyKAItems = data;
      console.log($scope.actualDailyKAItems);
    });




  });
