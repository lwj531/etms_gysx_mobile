angular.module('clientmgt.ctrl', ['routesetting.srv'])
  .controller('ClientMgtCtrl', function ($scope,routesettingsrv) {
    //列表数据
    $scope.clientList=[];
    //搜索关键字
    $scope.searchmodel={
      Key:"InstitutionName",
      Value:""
    };


    $scope.search = function(){
      var model =[$scope.searchmodel];
      routesettingsrv.searchinsnoloading(model).then(function (data) {
        $scope.clientList = data;
      });
    }
    //第一次打开页面 默认搜索一次
    $scope.search();
    $scope.$watch('searchmodel.Value',function(newValue,oldValue, scope){
      $scope.search();
    });




  });
