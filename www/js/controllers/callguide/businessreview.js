angular.module('businessreview.ctrl', ['guide.srv', 'client.srv'])

  .controller('BusinessreviewCtrl', function ($scope, guidesrv, clientsrv, $stateParams, $state) {
    console.log($stateParams.insId);

    $scope.getClientInfo = function () {

      //初始化生意回顾页面提交数据
      $scope.businessReview = {
        ActivityDate: moment().format('YYYY-MM-DD'),
        // StaffID: $scope.staff.StaffId,
        InstitutionID: $stateParams.insId,
        // ReviewTarget: [],
        // Others: [],
        ReviewTargetCount: '',
        HasPPT: false,
        PhotosList:['qweqweqw']
      };

      clientsrv.getcurrentstaff().then(function (staff) {
        //获取当前人员的信息
        $scope.staff = staff;
        console.log($scope.staff);
        $scope.businessReview.StaffID= $scope.staff.StaffId;
      });
    };
    clientsrv.getclients($stateParams.insId).then(function (clients) {
      guidesrv.getkareviews(moment().format('YYYY-MM-DD'), $stateParams.insId).then(function (reviews) {
        for (var i = 0; i < clients.length; i++) {
          clients[i].selected = false;

          for (var j = 0; j < reviews.length; j++) {
            for (var k = 0; k < reviews[j].ReviewTarget.length; k++) {
              if (reviews[j].ReviewTarget[k] === clients[i].ClientID) {
                clients[i].selected = true;
              }
            }
          }

          if (i === clients.length - 1) {
            $scope.clientOptions = clients;
            console.log(clients);
          }
        }
      });

    });

    //PPT
    $scope.changeCheckPPT = function () {
      $scope.businessReview.HasPPT = !$scope.businessReview.HasPPT;

    };
    $scope.isFocus = false;
    //要用 .  否则取不到值
    $scope.setOthers = {
      Name: ''
    };
    //暂存other列表
    $scope.otherList = [];


    //初始化
    $scope.init = function () {
      $scope.getClientInfo();
    };
    $scope.init();

    $scope.clearInput = function () {
      $scope.setOthers.Name = '';
    };
    // 手动添加
    $scope.addOtherMember = function () {
      if ($scope.setOthers.Name !== '') {
        $scope.otherList.push({name: $scope.setOthers.Name, selected: true});
        $scope.setOthers.Name = '';
        $scope.inputFocus = true;
        console.log($scope.otherList);
      }
    };

    //保存生意回顾
    $scope.saveReview = function () {
      $scope.businessReview.Others = [];
      for (var m = 0; m < $scope.otherList.length; m++) {
        if ($scope.otherList[m].selected === true) {
          $scope.businessReview.Others.push($scope.otherList[m].name);
        }
      }
      $scope.businessReview.ReviewTarget = [];
      for (var n = 0; n < $scope.clientOptions.length; n++) {
        if ($scope.clientOptions[n].selected === true) {
          $scope.businessReview.ReviewTarget.push($scope.clientOptions[n].ClientID);
        }
      }
      //两个for都结束后post
      if (n === $scope.clientOptions.length && m === $scope.otherList.length) {
        $scope.businessReview.ReviewTargetCount = $scope.businessReview.ReviewTarget.length;
        console.log($scope.businessReview);
        guidesrv.savekareview($scope.businessReview).then(function () {
          $scope.popup("操作成功");
          $state.go("main.calldetails", {insId: $stateParams.insId});
        });
      }
    };

  });
