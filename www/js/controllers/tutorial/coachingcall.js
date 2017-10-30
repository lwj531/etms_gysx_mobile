angular.module('coachingcall.ctrl', [])
  .controller('CoachingCallCtrl', function ($scope) {
    $scope.isExpand = false;
    $scope.searchmodal = false;

    $scope.ShowSearchModal = function () {
      $scope.isExpand = false;
      $scope.searchmodal = !$scope.searchmodal;
    };

    $scope.InstitutionPriority = "A";
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
    $scope.tabs = [
      {name: 'coached', title: '已辅导机构'},
      {name: 'district', title: '辖区机构'}
    ];
    $scope.currentTab = $scope.tabs[0];
    //切换tab
    $scope.switchTab = function (tab) {
      $scope.currentTab = tab;

    };
    $scope.ToggleFooter = function () {
      $scope.isExpand = !$scope.isExpand;
      $scope.searchmodal = false;
    }

  });
