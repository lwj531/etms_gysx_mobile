/*修改门店坐标的控制器*/
angular.module('storemodify.ctrl', ['client.srv'])
  .controller('StoreModifyCtrl', function ($scope, $rootScope, $timeout, $ionicPopup, clientsrv) {
    $rootScope.IsModifyStoreLngLat = false;
    //初始化地图coordinate-map
    $scope.initMap = function () {
      $scope.map = new AMap.Map("coordinate-map",
        {
          center: $scope.currentStore.lnglat,
          resizeEnable: true,
          draggable: true,
        });
      $scope.map.clearMap();
      $scope.map.clearInfoWindow();
      $scope.map.plugin('AMap.Geolocation', function () {
        $scope.geolocation = new AMap.Geolocation({
          enableHighAccuracy: true,//是否使用高精度定位，默认:true
          timeout: 10000,          //超过10秒后停止定位，默认：无穷大
          maximumAge: 0,           //定位结果缓存0毫秒，默认：0
          convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
          showButton: true,        //显示定位按钮，默认：true
          buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
          buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
          showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
          panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
          zoomToAccuracy: true      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        });
        $scope.map.addControl($scope.geolocation);
        $scope.geolocation.getCurrentPosition();
        AMap.event.addListener($scope.geolocation, 'complete', $scope.getlocationComplete);//返回定位信息
        AMap.event.addListener($scope.geolocation, 'error', $scope.getlocationError);      //返回定位出错信息
      });
    };
    //获取定位坐标成功
    $scope.getlocationComplete = function (data) {
      $scope.lnglat = [data.position.getLng(), data.position.getLat()];
      $scope.setInsMarker();
    };
    //获取定位坐标失败
    $scope.getlocationError = function () {
      $scope.lnglat = [];
      $rootScope.toast("获取坐标失败，请重新定位。");
      $scope.setInsMarker();
    };
    //定位至当前机构的坐标
    $scope.setInsMarker = function () {
      if ($scope.insMarker == null) {
        $scope.insMarker = new AMap.Marker({
          icon: $scope.currentStore.InstitutionPriority == "A" ? "img/GradeA-icon.png" : ($scope.currentStore.InstitutionPriority == "B" ? "img/GradeB-icon.png" : "img/GradeC-icon.png"),
          position: $scope.currentStore.lnglat
        });
        $scope.insMarker.setMap($scope.map);
        $scope.map.setCenter($scope.currentStore.lnglat);
      }
      $scope.$apply();
    }
    $scope.initMap();
    $scope.saveBtn ={
      text: '<b>确定</b>',
      type: 'button-clear button-positive title-button-right',
      onTap: function(e) {
        //保存修改坐标的方法
        $scope.saveModifyStoreLngLat();
      }
    };
    //是否确定修改坐标
    $scope.$watch("IsModifyStoreLngLat", function (newValue, oldValue, scope) {
      {
        if ($scope.IsModifyStoreLngLat != null) {
          $scope.map.setCenter($scope.IsModifyStoreLngLat ? $scope.lnglat : $scope.currentStore.lnglat);
          if ($scope.IsModifyStoreLngLat) {
            $scope.buttons.push($scope.saveBtn);
          } else {
            $scope.buttons.splice(1,1);
          }
        }
      }
    });
    //保存坐标修改的方法
    $scope.saveModifyStoreLngLat = function () {
      if ($scope.lnglat != null && $scope.lnglat.length > 1) {
        var model = {
          InstitutionLat: $scope.lnglat[1],
          InstitutionLng: $scope.lnglat[0]
        }
        clientsrv.updateInsLngLat($scope.currentStore.InstitutionID, model).then(function (status) {
          if (status) {
            $rootScope.toast("操作成功");
            $scope.map.clearMap();
          } else {
            $rootScope.toast("操作失败");
          }
        });
      } else {
        $rootScope.toast("获取坐标失败，请重新定位。");
      }
    };
  });
