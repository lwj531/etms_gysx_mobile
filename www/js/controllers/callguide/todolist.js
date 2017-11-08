angular.module('todolist.ctrl', [])
  .controller('TodolistCtrl', function($scope, $stateParams,guidesrv,clientsrv,$state) {

    console.log($stateParams.insId);
    console.log($stateParams.staffId);

    clientsrv.getins($stateParams.insId).then(function (data) {
      $scope.currentIns = data;

      console.log($scope.currentIns.InstitutionName + $scope.currentIns.InstitutionPriority + $scope.currentIns.Address);
      //机构左侧图标
      switch ($scope.currentIns.InstitutionPriority) {
        case "A":
          $scope.inslevelflag = "uicon-markerA";
          break;
        case "B":
          $scope.inslevelflag = "uicon-markerB";
          break;
        case "C":
          $scope.inslevelflag = "uicon-markerC";
          break;
        default:
          $scope.inslevelflag = "uicon-markerA";
      }

    });
    guidesrv.gettodo().then(function (data) {
      $scope.todoList = data;
      console.log($scope.todoList);
    });

  });
