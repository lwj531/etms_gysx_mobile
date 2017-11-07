angular.module('calldetails.ctrl', ['client.srv','guide.srv'])
  .controller('CalldetailsCtrl', function ($scope, clientsrv,guidesrv, $stateParams) {
    $scope.insID = $stateParams.insId;
    clientsrv.getins($stateParams.insId).then(function (data) {
      $scope.currentIns = data;

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

    $scope.dateToday = moment();
    //获取机构签到信息
    $scope.getCheckin = function () {
      guidesrv.getCheckinInfo($scope.dateToday.format('YYYY-MM-DD'), $scope.insID).then(function (data) {
        $scope.insinfo = data[0];
        console.log(data)
      });
    };
    //获取最近的库存
    $scope.getLatestInventorys = function () {
      guidesrv.getLatestInventorys($scope.insID).then(function (data) {
        $scope.insinfo = data[0];
        console.log(data)
      });
    };
    //初始化
    $scope.init = function () {
      $scope.getCheckin();
    };
    $scope.init();

  });
