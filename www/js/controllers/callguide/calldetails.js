angular.module('calldetails.ctrl', ['client.srv', 'guide.srv'])
  .controller('CalldetailsCtrl', function ($scope, clientsrv, guidesrv, $stateParams,$state) {
    $scope.insID = $stateParams.insId;
    clientsrv.getins($stateParams.insId).then(function (data) {
      $scope.currentIns = data;
      console.log($scope.currentIns);
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
    //判断当前角色
    clientsrv.getcurrentstaff().then(function (staff) {
      $scope.staff = staff;
      $scope.staff.IsAE = staff.Roles.indexOf('AE_REP') != -1;
      $scope.staff.IsCCR = !$scope.staff.IsAE;
      console.log($scope.staff);
    });
    //获取机构签到信息
    $scope.getCheckin = function () {
      guidesrv.getCheckinInfo(moment().format('YYYY-MM-DD'), $scope.insID).then(function (data) {
        $scope.insinfo = data[0];
        console.log(data)
      });
    };
    //获取最近的库存
    $scope.getLatestInventorys = function () {
      guidesrv.getlatestinventorys($scope.insID).then(function (data) {
        $scope.latestInventorys = data;
        console.log($scope.latestInventorys);
      });
    };
    //初始化
    $scope.init = function () {
      $scope.getCheckin();
      $scope.getLatestInventorys();
    };
    $scope.init();

    $scope.nextStep=function () {
      $state.go("main.todolist",{insId:$stateParams.insId,staffId:$scope.staff.StaffId});
    }

  });
