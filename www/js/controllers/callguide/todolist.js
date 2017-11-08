angular.module('todolist.ctrl', [])
  .controller('TodolistCtrl', function($scope) {
    $scope.insID = $stateParams.insId;
    $scope.staffID = $stateParams.staffId;
    console.log($scope.insID);
    console.log($scope.staffID);


    guidesrv.gettodo().then(function (data) {
      $scope.todoList = data;
      console.log($scope.todoList);
    });

  });
