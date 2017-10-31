angular.module('amap.dt', [])
.directive("amap", function ($rootScope) {
  return {
    restrict: "AE",
    replace: true,
    template: "<div style='width: 100%;height: 100%'></div>",
    link: function ($scope, element, attrs) {
      $scope.$on('amap', function (errorType,data) {
        //已获取数据后执行
        if(data=="datacompleted"){
          //地图初始化
          $rootScope.map = new AMap.Map(element[0],
            {
              center:$scope.center,
              resizeEnable: true,
              //zoom: 10,
              draggable: true,
              /*mapStyle: 'amap://styles/b8bc3f4188432ed34aa545312ddf20f9'//样式URL*/
            });
          //$rootScope.map.setFeatures("road");//仅显示道路
          //通知初始化完成
          $rootScope.$broadcast("amap", "mapcompleted");
        }
      });
    }
  };
})
