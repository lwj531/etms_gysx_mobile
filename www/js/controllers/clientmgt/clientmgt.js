angular.module('clientmgt.ctrl', ['routesetting.srv'])
  .controller('ClientMgtCtrl', function ($scope, routesettingsrv) {
    //搜索关键字
    $scope.searchmodel = {
      Key: "InstitutionName",
      Value: ""
    };
    var model = [$scope.searchmodel];
    routesettingsrv.searchins(model).then(function (data) {
      $scope.clientList = data;
    });

    $scope.cannel=function(){
      $scope.key="";
    }

  });
