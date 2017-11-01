angular.module('callprocedure.ctrl', [])
  .controller('CallProcedureCtrl', function ($scope,$ionicPopover) {
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


    // 辅导对象选择
    $ionicPopover.fromTemplateUrl('templates/tutorial/tutoriallist.html', {
      scope: $scope
    }).then(function(popover) {
      $scope.popover = popover;
    });


    $scope.openPopover = function($event) {
      $scope.popover.show($event);
    };
    $scope.closePopover = function() {
      $scope.popover.hide();
    };
    // 清除浮动框
    $scope.$on('$destroy', function() {
      $scope.popover.remove();
    });
    // 在隐藏浮动框后执行
    $scope.$on('popover.hidden', function() {
      // 执行代码
    });
    // 移除浮动框后执行
    $scope.$on('popover.removed', function() {
      // 执行代码
    });
  });
