angular.module('callguide.ctrl', [])

  .controller('CallGuideCtrl', function($scope) {
    $scope.local={
      longitude:0,
      latitude:0
    };
    //定位地图
    var map = new AMap.Map("map",
      {
        resizeEnable: true,
        zoom: 15
      });
    map.plugin(["AMap.Geolocation", "AMap.Geocoder", "AMap.PlaceSearch"],
      function () {
        geolocation = new AMap.Geolocation({
          enableHighAccuracy: true, //是否使用高精度定位，默认:true
          timeout: 10000, //超过10秒后停止定位，默认：无穷大
          showButton: true,
          buttonOffset: new AMap.Pixel(10, 20),
          zoom: 16,
          zoomToAccuracy: true, //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
          showCircle: false,
          convert: true, //自动偏移坐标，定位更准确
          buttonPosition: "LB"
        });
        map.addControl(geolocation);
        geolocation.getCurrentPosition();
        AMap.event.addListener(geolocation,
          "complete",
          function (data) {
            var currPosition = [data.position.getLng(), data.position.getLat()];
            $scope.local.longitude = currPosition[0];
            $scope.local.latitude = currPosition[1];
            $scope.$apply();
          }); //返回定位信息
        AMap.event.addListener(geolocation,
          "error",
          function (ex) {

          });
      });
  });
