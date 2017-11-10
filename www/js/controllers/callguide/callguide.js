angular.module('callguide.ctrl', ['ionic', 'routesetting.srv', 'guide.srv', 'angularMoment'])
  .controller('CallGuideCtrl', function ($scope, $state, $rootScope, $compile, routesettingsrv, guidesrv, amMoment) {
    //是否获取当前定位成功
    $scope.haslocal = false;
    //初始化tab
    $scope.tabs = [
      {name: 'todaysch', title: '今日行程'},
      {name: 'plansch', title: '已计划行程'},
      {name: 'myins', title: '我负责的机构'}
    ];
    $scope.currentTab = $scope.tabs[0];
    //展开底部footer
    $scope.isExpand = false;
    $scope.ToggleFooter = function () {
      $scope.isExpand = !$scope.isExpand;
      $scope.searchmodal = false;
      $scope.nolatlngmodal = false;
    };
    //切换tab
    $scope.switchTab = function (tab) {
      $scope.currentTab = tab;
      $scope.isExpand = true;
    };
    //地图初始化完成后执行
    $scope.$on('amap', function (errorType, data) {
      if (data == "mapcompleted") {
        console.log("mapcompleted");
        $scope.map.clearMap();
        $scope.map.clearInfoWindow();
        $scope.map.plugin(['AMap.Geolocation', 'AMap.ToolBar'], function () {
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
          AMap.event.addListener($scope.geolocation, 'complete', $scope.getlocationComplete);//返回定位信息
          AMap.event.addListener($scope.geolocation, 'error', $scope.getlocationError);      //返回定位出错信息
          $scope.map.addControl($scope.geolocation);
          //测试添加工具条
          $scope.map.addControl(new AMap.ToolBar({
            visible: true,
            position: 'LT'
          }));
          $scope.geolocation.getCurrentPosition();
        });
        $scope.map.on('moveend', $scope.getCenter);

      }
    });
    //获取定位坐标成功
    $scope.getlocationComplete = function (data) {
      $rootScope.toast("获取坐标成功。");
      $scope.haslocal = true;
      $scope.lnglat = [data.position.getLng(), data.position.getLat()];
      $scope.getCenter();
    };
    //获取定位坐标失败
    $scope.getlocationError = function () {
      $rootScope.toast("获取坐标失败，请重新定位。");
      $scope.lnglat = [];
      $scope.haslocal = true;
    };
    //地图移动时重新获取当前的中心点
    $scope.getCenter = function () {
      if ($scope.haslocal) {
        $scope.map.clearMap();
        var center = $scope.map.getCenter();
        $scope.lnglat = [center.lng, center.lat];
        new AMap.Marker({
          icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
          map: $scope.map,
          position: $scope.lnglat
        });
        new AMap.Circle({
          center: new AMap.LngLat($scope.lnglat[0], $scope.lnglat[1]),// 圆心位置
          radius: 500, //半径
          strokeColor: "#1a51ff", //线颜色
          strokeOpacity: 0.5, //线透明度
          strokeWeight: 1, //线粗细度
          fillColor: "#8fd9ff", //填充颜色
          fillOpacity: 0.35,//填充透明度
          map: $scope.map
        });
        //判断当前范围500米之内的机构
        $scope.calculationNearby();
      }
    };
    //计算附近500米内的机构
    $scope.calculationNearby = function () {
      //判断当前范围500米之内的机构
      $scope.withinIns = [];
      var lnglat = new AMap.LngLat($scope.lnglat[0], $scope.lnglat[1]);//当前位置坐标
      for (var i = 0; i < $scope.insdata.length; i++) {
        var ins = $scope.insdata[i];
        if (lnglat.distance(ins.lnglat) <= 500) {
          $scope.withinIns.push(ins);
        }
        if (i == $scope.insdata.length - 1) {
          //重新显示门店marker
          $scope.setInsMarker();
        }
      }
    };
    //设置marker点
    $scope.setInsMarker = function () {
      for (var i = 0; i < $scope.withinIns.length; i++) {
        var ins = $scope.withinIns[i];
        new AMap.Marker({
          map: $scope.map,
          position: ins.lnglat,
          extData: ins,//当前的机构信息
          content: '<div class="uicon-' + (ins.Priority == "A" ? "markerA" : (ins.Priority == "B" ? "markerA" : "markerC")) + '"></div>'
        }).on('click', $scope.showInfoWindow);
      }
    };
    //点击Marker显示信息窗体
    $scope.showInfoWindow = function (event) {
      $scope.currentins = event.target.getExtData();
      $scope.currentins.allowVisit = false;//是否允许拜访
      //判断是否允许拜访
      for (var i = 0; i < $scope.todaysch.length; i++) {
        if ($scope.todaysch[i].CheckOut != null && $scope.todaysch[i].InstitutionModel.InstitutionID == $scope.currentins.InstitutionID) {
          $scope.currentins.allowVisit = true;
        }
        if (i == $scope.todaysch.length - 1) {
          var content = $compile('<div>' +
            '      <div class="info">' +
            '        <div class="info-top">' +
            '          <div class="inf-top-left txt">' +
            '          </div>' +
            '          <div class="inf-top-right">' +
            '            <span ng-bind="currentins.InstitutionName"></span>' +
            '          </div>' +
            '        </div>' +
            '        <div class="info-bottom">' +
            '          <span></span>' +
            '        </div>' +
            '      </div>' +
            '    </div>')($scope)[0];
          $scope.$apply();
          $scope.map.clearInfoWindow();
          var infoWindow = new AMap.InfoWindow({
            offset: new AMap.Pixel(-10, -40),
            isCustom: true,
            closeWhenClickMap: true,
            autoMove: true,
            content: content
          });
          infoWindow.open($scope.map, $scope.currentins.lnglat);
        }
      }

    };
    //今日行程拜访或者查看
    $scope.govisit = function (item) {
      if (item.CheckOut == null && item.CheckIn != null) {
        $state.go("main.calldetails", {insId: item.InstitutionModel.InstitutionID});
      } else if (item.CheckOut != null && item.CheckIn != null) {

        $state.go("main.calloverview", {insId: item.InstitutionModel.InstitutionID});
      } else {
        $state.go("main.checkin", {insId: item.InstitutionModel.InstitutionID});
      }
    };
    //今日行程列表选中机构
    $scope.todayRouteSelectIns = function (item) {
      //优先定位置签出
      if (item.CheckOut != null) {
        $scope.map.panTo(item.CheckOut.LngLat);
      } else {
        $scope.map.panTo(item.CheckIn.LngLat);
      }

    };

    $scope.dateToday = moment();
    //获取今日行程
    $scope.getTodaySch = function (callback) {
      guidesrv.getTodayScheduleList($scope.dateToday.format('YYYY-MM-DD')).then(function (data) {
        $scope.todaysch = data;
        if (callback != null) {
          callback();
        }
      });
    };
    //获取已计划行程
    $scope.getPlanSch = function (callback) {
      guidesrv.getPlanScheduleList($scope.dateToday.format('YYYY-MM-DD')).then(function (data) {
        $scope.plansch = data;
        if (callback != null) {
          callback();
        }
      });
    };
    //获取用户所有机构
    $scope.getmyins = function (callback) {
      routesettingsrv.getins().then(function (data) {
        $scope.insdata = data;
        if (callback != null) {
          callback();
        }
      });
    };
    //初始化
    $scope.init = function () {
      $scope.getmyins(function () {
        $scope.getTodaySch(function () {
          $scope.getPlanSch(function () {
            //通知地图数据准备完毕
            $scope.$broadcast("amap", "datacompleted");
          });
        });
      });
    };
    $scope.init();
  });
