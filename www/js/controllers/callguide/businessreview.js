angular.module('businessreview.ctrl', ['guide.srv','client.srv'])

  .controller('BusinessreviewCtrl', function ($scope,guidesrv,clientsrv, $stateParams) {
    $scope.insID = $stateParams.insId;
    console.log($scope.insID);

    //初始没选PPT
    $scope.hasPPT = false;
    $scope.changeCheckPPT = function () {
      $scope.hasPPT = !$scope.hasPPT;

    };


    $scope.dateToday = moment();
    //获取当日填写过的生意回顾
    $scope.getKAReviews = function () {
      guidesrv.getkareviews($scope.dateToday.format('YYYY-MM-DD'), $scope.insID).then(function (data) {
        $scope.reviews = data;
        console.log($scope.reviews)
      });
    };

    $scope.switchChecked=function () {

    };

    //初始化
    $scope.init = function () {
      $scope.getKAReviews();
    };
    $scope.init();

    $scope.otherList=[];
    $scope.addOtherMember=function (itemName) {
      $scope.otherList.push({name:itemName});
      console.log($scope.otherList);
    };
  });
