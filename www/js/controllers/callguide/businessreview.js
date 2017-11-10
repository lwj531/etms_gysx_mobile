angular.module('businessreview.ctrl', ['guide.srv', 'client.srv'])

  .controller('BusinessreviewCtrl', function ($scope, guidesrv, clientsrv, $stateParams,$state) {
    console.log($stateParams.insId);
    console.log($stateParams.staffId);


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


    //要用 .  否则取不到值
    $scope.setOthers = {
      Name: ''
    };
    //暂存other列表
    $scope.otherList=[];
    //生意回顾页面提交数据
    $scope.businessReview = {
      ActivityDate: moment().format('YYYY-MM-DD'),
      StaffID: $stateParams.staffId,
      InstitutionID: $stateParams.insId,
      // ReviewTarget: [],
      // Others: [],
      ReviewTargetCount: '',
      HasPPT: false
    };

    $scope.clearInput = function () {
      $scope.setOthers.Name = '';
    };
    // 手动添加
    $scope.addOtherMember = function () {
      if ($scope.setOthers.Name !== '') {
        $scope.otherList.push({name: $scope.setOthers.Name, selected: true});
        console.log($scope.otherList);
      }
    };

    //保存生意回顾
    $scope.saveReview = function () {
      $scope.businessReview.Others=[];
      for(var m=0;m<$scope.otherList.length;m++){
        if($scope.otherList[m].selected===true){
          $scope.businessReview.Others.push($scope.otherList[m].name);
        }
      }
      $scope.businessReview.ReviewTarget=[];
      for(var n=0;n<$scope.clientOptions.length;n++){
        if($scope.clientOptions[n].selected===true){
          $scope.businessReview.ReviewTarget.push($scope.clientOptions[n].ClientID);
        }
      }
      $scope.businessReview.ReviewTargetCount=$scope.businessReview.ReviewTarget.length;
      console.log($scope.businessReview);
      guidesrv.savekareview($scope.businessReview).then(function () {
        $scope.popup("操作成功");
        // $state.go("main.calldetails");

      });
    };
    //初始化
    $scope.init = function () {

    };
    $scope.init();

  });
