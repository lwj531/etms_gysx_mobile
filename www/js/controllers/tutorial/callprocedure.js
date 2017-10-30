angular.module('callprocedure.ctrl', [])
  .controller('CallProcedureCtrl', function ($scope) {
    $scope.InstitutionPriority="A";
    //机构左侧图标
    switch ($scope.InstitutionPriority) {
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
