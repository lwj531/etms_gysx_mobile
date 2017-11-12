angular.module('calloverview.ctrl', ['guide.srv','client.srv'])
  .controller('CalloverviewCtrl', function ($scope, $stateParams, guidesrv, clientsrv) {

    console.log($stateParams.insId);

    $scope.staff={
      IsAE:'',
      IsCCR:''
    };
    //初始化
    $scope.init = function () {
      //判断当前角色
      clientsrv.getcurrentstaff().then(function (staff) {
        $scope.staff = staff;
        $scope.staff.IsAE = staff.Roles.indexOf('AE_REP') !== -1;
        $scope.staff.IsCCR = !$scope.staff.IsAE;
        console.log($scope.staff.IsAE);
      });
    };
    $scope.init();
    $scope.overviewModel = {
      call: {
        checkInTime: '',
        checkOutTime: ''
      },
      PSIList: [],
      businessReview: {
        reviewModel: {},
        displayList: [],
        hasPPT: '',
        photoCount: ''
      },
      checklist: [],
      diseaseKnowledge: []
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
      $scope.overviewModel.PSIList = dailySKU;
      console.log($scope.overviewModel.PSIList);
    });
    //获取当天选择过的
    guidesrv.getactualdailykaitems(moment().format('YYYY-MM-DD'), $stateParams.insId).then(function (actualItems) {
      $scope.overviewModel.checklist = actualItems;
      console.log(actualItems);
    });
    //获取生意回顾
    guidesrv.getkareviews(moment().format('YYYY-MM-DD'), $stateParams.insId).then(function (reviews) {
      if(reviews.length>0){
        $scope.overviewModel.businessReview.reviewModel = reviews[0];
        console.log($scope.overviewModel.businessReview.reviewModel);

        $scope.overviewModel.businessReview.hasPPT = $scope.overviewModel.businessReview.reviewModel.HasPPT === false ? '不包含PPT' : '包含PPT';
        $scope.overviewModel.businessReview.photoCount = $scope.overviewModel.businessReview.reviewModel.PhotosList === null ? 0 : $scope.overviewModel.businessReview.reviewModel.PhotosList.length;
        clientsrv.getclients($stateParams.insId).then(function (clients) {
          for (var i = 0; i < $scope.overviewModel.businessReview.reviewModel.ReviewTarget.length; i++) {
            for (var j = 0; j < clients.length; j++) {
              if ($scope.overviewModel.businessReview.reviewModel.ReviewTarget[i] === clients[j].ClientID) {
                $scope.overviewModel.businessReview.displayList.push(clients[j].ClientName);
              }
            }
          }
          for (var k = 0; k < $scope.overviewModel.businessReview.reviewModel.Others.length; k++) {
            $scope.overviewModel.businessReview.displayList.push($scope.overviewModel.businessReview.reviewModel.Others[k]);
          }
        });
      }
    });

  });
