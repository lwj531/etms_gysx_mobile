angular.module('calloverview.ctrl', ['guide.srv'])
  .controller('CalloverviewCtrl', function ($scope, $stateParams, guidesrv, clientsrv) {

    console.log($stateParams.insId);

    $scope.overviewModel={
      call:{
        checkInTime:'',
        checkOutTime:''
      },
      PSIList:[],
      businessReview:{
        Members:[],
        photoCount:'',
        hasPPT:false
      },
      checklist:[],
      diseaseKnowledge:[]
    };

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
    clientsrv.getcurrentstaff().then(function (staff) {
      //当前人员的信息
      $scope.staff = staff;
      console.log($scope.staff);
    });

    //获取当天填写进销存
    guidesrv.getdailyinventorys($stateParams.insId).then(function (dailySKU) {
      $scope.SKUList = dailySKU;
      $scope.overviewModel.PSIList=dailySKU;
      console.log($scope.overviewModel.PSIList);
    });
    //获取当天选择过的
    guidesrv.getactualdailykaitems(moment().format('YYYY-MM-DD'), $stateParams.insId).then(function (actualItems) {
      if (actualItems.length === 0) {
        //如果没选择过则带出计划中的
        guidesrv.getplandailykaitems(moment().format('YYYY-MM-DD'), $stateParams.insId).then(function (planItems) {
          $scope.overviewModel.checklist=planItems;
          console.log(planItems);
        });
      }
      else {
        $scope.overviewModel.checklist=actualItems;
        console.log(actualItems);
      }
    });
    //获取生意回顾
    guidesrv.getkareviews(moment().format('YYYY-MM-DD'), $stateParams.insId).then(function (reviews) {
      // for (var i = 0; i < clients.length; i++) {
      //   clients[i].selected = false;
      //
      //   for (var j = 0; j < reviews.length; j++) {
      //     for (var k = 0; k < reviews[j].ReviewTarget.length; k++) {
      //       if (reviews[j].ReviewTarget[k] === clients[i].ClientID) {
      //         clients[i].selected = true;
      //       }
      //     }
      //   }
      //
      //   if (i === clients.length - 1) {
      //     $scope.clientOptions = clients;
      //     console.log(clients);
      //   }
      // }
      console.log(reviews);
    });

  });
