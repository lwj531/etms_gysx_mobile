angular.module('editroute.ctrl', ['routesetting.srv', 'daily.srv'])
  .controller('EditRouteCtrl', function ($scope, $rootScope, $ionicHistory, $state, $stateParams, routesettingsrv, dailysrv) {
    //获取路线明细
    routesettingsrv.getroutedetail($stateParams.lineId).then(function (data) {
      $scope.currentRoute = data;
    });
    //本地机构
    $scope.localInsList = [];
    $scope.insList = [];
    //获取用户名下的机构
    $scope.getIns = function (callback) {
      routesettingsrv.getins().then(function (data) {
        $scope.insList = data;
        if (callback != null) {
          callback();
        }
        ;
        for (var i = 0; i < $scope.insList.length; i++) {
          for (var j = 0; j < $scope.currentRoute.Institutions.length; j++) {
            if ($scope.insList[i].InstitutionID == $scope.currentRoute.Institutions[j].InstitutionID) {
              $scope.insList[i].selected = true;//是否已存在路线机构列表中
            }
            if (i == $scope.insList.length - 1) {
              $scope.localInsList = $scope.insList;
            }
          }
        }
      });
    }
    $scope.showMask = false;
    $scope.showAddIns = false;
    //点添加机构
    $scope.showFooter = function () {
      $scope.getIns(function () {
        $scope.showMask = true;
        $scope.showAddIns = true;
      });
    };
    //机构搜索关键字
    $scope.insKey = "";
    //搜索本地数据
    $scope.searchlocal = function () {
      $scope.localInsList = [];
      for (var i = 0; i < $scope.insList.length; i++) {
        if ($scope.insList[i].InstitutionName.indexOf($scope.insKey) != -1 || $scope.insKey == "") {
          $scope.localInsList.push($scope.insList[i]);
        }
      }
    };
    //根据类型返回ionic
    $scope.getIonic = function (item) {
      switch (item.InstitutionPriority) {
        case "A":
          return "markerA_52.png";
          break;
        case "B":
          return "markerB_52.png";
          break;
        case "C":
          return "markerC_52.png";
          break;
        default:
          return "markerA_52.png";
      }
    };
    $scope.getCssClass = function (item) {
      switch (item.InstitutionPriority) {
        case "A":
          return "uicon-markerA";
          break;
        case "B":
          return "uicon-markerB";
          break;
        case "C":
          return "uicon-markerC";
          break;
        default:
          return "uicon-markerA";
      }
    };
    //重置搜索
    $scope.resetSearchIns = function () {
      $scope.insKey = "";
    };
    $scope.$watch('insKey', function (newValue, oldValue, scope) {
      $scope.searchlocal();
    });
    //添加至路线机构列表
    $scope.addToRouteIns = function (item) {
      if (!item.selected) {
        $scope.currentRoute.Institutions.push(item);
        item.selected = true;
      }
    };
    //点关闭，关闭底部
    $scope.closeFooter = function () {
      $scope.showMask = false;
      $scope.showAddIns = false;
    };
    //列表排序
    $scope.moveItem = function (item, fromIndex, toIndex) {
      $scope.currentRoute.Institutions.splice(fromIndex, 1);
      $scope.currentRoute.Institutions.splice(toIndex, 0, item);
    };
    //删除项目
    $scope.onItemDelete = function (item) {
      $scope.currentRoute.Institutions.splice($scope.currentRoute.Institutions.indexOf(item), 1);
    };
    //保存计划
    $scope.savePlan = function () {
      if ($scope.currentRoute.Institutions.length <= 0) {
        $rootScope.toast("请选择机构");
      } else {
        $scope.currentRoute.ActivityDate = $stateParams.activityDate;
        dailysrv.savePlan($scope.currentRoute).then(function (state) {
          if (state) {
            $rootScope.toast("保存成功", function () {
              $scope.$emit('closeFooter');//通知关闭底部
              $ionicHistory.goBack();
            });
          } else {
            $rootScope.toast("保存失败");
          }
        });
      }
    };
  });
