angular.module('clientmgt.ctrl', ['routesetting.srv'])
  .controller('ClientMgtCtrl', function ($scope, routesettingsrv) {
    //列表数据
    $scope.clientList = [];
    //显示的数据 为了本地搜索
    $scope.localClientList = [];
    //搜索关键字
    $scope.searchmodel = {
      Key: "InstitutionName",
      Value: ""
    };
    $scope.search = function () {
      var model = [$scope.searchmodel];
      routesettingsrv.searchins(model).then(function (data) {
        $scope.clientList = data;
        $scope.localClientList = data;
      });
    };
    //搜索本地数据
    $scope.searchlocal = function () {
      $scope.localClientList = [];
      for (var i = 0; i < $scope.clientList.length; i++) {
        if ($scope.clientList[i].InstitutionName.indexOf($scope.searchmodel.Value) != -1 || $scope.searchmodel.Value == "") {
          $scope.localClientList.push($scope.clientList[i]);
        }
      }
    };

    $scope.cannel = function () {
      $scope.searchmodel.Value = "";
    }

    //第一次打开页面 默认搜索一次
    $scope.search();
    $scope.$watch('searchmodel.Value', function (newValue, oldValue, scope) {
      $scope.searchlocal();
    });
  });
