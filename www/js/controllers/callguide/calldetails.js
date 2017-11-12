angular.module('calldetails.ctrl', ['client.srv', 'guide.srv'])
  .controller('CalldetailsCtrl', function ($scope, clientsrv, guidesrv, $stateParams, $state) {
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
      $scope.staff.IsAE = staff.Roles.indexOf('AE_REP') !== -1;
      $scope.staff.IsCCR = !$scope.staff.IsAE;
      console.log($scope.staff);
      console.log($scope.staff.IsAE);

    });

    //获取机构签到信息
    guidesrv.getCheckinInfo(moment().format('YYYY-MM-DD'), $scope.insID).then(function (data) {
      $scope.insinfo = data[0];
      console.log(data)
    });
    $scope.detailCount = {
      psi: '',
      checklist: '',
      reviews: ''
    };

    // //AE要获取的数据
    // if ($scope.staff.IsAE) {
    //
    //   //获取实际选择过的checklist
    //   guidesrv.getactualdailykaitems(moment().format('YYYY-MM-DD'), $stateParams.insId).then(function (actualItems) {
    //     $scope.detailCount.checklist = actualItems.length;
    //     console.log(actualItems);
    //   });
    //
    //   //获取生意回顾
    //   guidesrv.getkareviews(moment().format('YYYY-MM-DD'), $stateParams.insId).then(function (reviews) {
    //     $scope.detailCount.reviews = reviews.length;
    //     console.log(reviews);
    //   });
    //
    // }
    // //CCR要获取的数据
    // else if ($scope.staff.IsCCR) {
    //   //  如果是ccr则获取培训记录和疾病知识教育，目前没数据
    //   console.log($scope.staff.IsCCR);
    // }

    //获取今日填写的库存
    guidesrv.getdailyinventorys($scope.insID).then(function (dailyInv) {
      $scope.detailCount.psi = dailyInv.length;
      console.log(dailyInv);
    });

    //初始化
    $scope.init = function () {

    };
    $scope.init();

    $scope.nextStep = function () {
      $state.go("main.todolist", {insId: $stateParams.insId, staffId: $scope.staff.StaffId});
    }

  });
