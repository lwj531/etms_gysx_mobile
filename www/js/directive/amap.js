angular.module('amap.dt', [])
.directive("amap", function ($rootScope) {
  return {
    restrict: "E",
    replace: true,
    template: "<div id='map' style='width: 100%;height: 100%'></div>",
    link: function ($scope, element, attrs) {
      $scope.$on('amap', function (errorType,data) {
        //已获取数据后执行
        if(data=="datacompleted"){
          //地图初始化
          $rootScope.map =  new AMap.Map("map",
            {
              view:new AMap.View2D({
                center:$scope.center,
                resizeEnable: true,
                zoom: 15,
                draggable: true,  //是否可拖动
              }),
              lang:"zh_cn"
            });
          //通知初始化完成
          $rootScope.$broadcast("amap", "mapcompleted");
        }
      });
    }
  };
})
