angular.module('storenearby.ctrl', ['ionic', 'routesetting.srv', 'guide.srv', 'angularMoment'])
  .controller('StorenearbyCtrl', function ($scope, $state, $rootScope, $compile, routesettingsrv, guidesrv, amMoment) {
    //是否获取当前定位成功
    $scope.haslocal = false;
    //无坐标时临时测试----------
    $scope.lnglat = [121.421070,31.256720];
    //----------end------------


    //初始化tab
    $scope.tabs = [
      {name: 'todaysch', title: '今日行程'},
      {name: 'storenearby', title: '附近药店'},
      {name: 'chainstore', title: '下游门店'}
    ];
    $scope.currentTab = $scope.tabs[0];
    //展开底部footer
    $scope.isExpand = false;
    //开启(关闭)底部
    $scope.ToggleFooter = function () {
      $scope.isExpand = !$scope.isExpand;
    };
    //关闭底部
    $scope.closeFooter = function () {
      $scope.isExpand = false;
      $scope.$apply();
    };
    //切换tab
    $scope.switchTab = function (tab) {
      $scope.currentTab = tab;
      $scope.isExpand = true;
    };
    //地图初始化完成后执行
    $scope.$on('amap', function (errorType, data) {
      if (data == "mapcompleted") {
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
        //$scope.map.on('moveend', $scope.getCenter);
        $scope.map.on('click', $scope.closeFooter)

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
    $scope.getlocationError = function (err) {
      console.log(err);
      $rootScope.toast("获取坐标失败，请重新定位。");
      //无法获取坐标时暂时关闭，方便测试
      $scope.lnglat = [];
      $scope.haslocal = false;

    };
    //地图移动时重新获取当前的中心点
    $scope.getCenter = function () {
      if ($scope.haslocal) {
        if ($scope.marker != null && $scope.circle != null) {
          $scope.map.remove([$scope.marker, $scope.circle]);
        }
        var center = $scope.map.getCenter();
        //如果与上次中心点相差500米，清空地图覆盖物
        if (center.distance($scope.lnglat) > 500) {
          $scope.map.clearMap();
        }
        $scope.lnglat = [center.lng, center.lat];
        $scope.marker = new AMap.Marker({
          icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
          map: $scope.map,
          position: $scope.lnglat
        });
        $scope.circle = new AMap.Circle({
          center: $scope.lnglat,// 圆心位置
          radius: 500, //半径
          strokeColor: "#1a51ff", //线颜色
          strokeOpacity: 0.5, //线透明度
          strokeWeight: 1, //线粗细度
          fillColor: "#8fd9ff", //填充颜色
          fillOpacity: 0.35,//填充透明度
          map: $scope.map
        }).on('click', $scope.closeFooter);
        //判断当前范围500米之内的机构
        $scope.calculationNearby();
      }
    };
    //计算附近500米内的机构
    $scope.calculationNearby = function () {
      //判断当前范围500米之内的机构
      $scope.withinIns = [];
      $scope.getnearby($scope.lnglat,function(){
        for (var i = 0; i < $scope.insdata.length; i++) {
          var ins = $scope.insdata[i].InstitutionModel;
          $scope.withinIns.push(ins);
          if (i == $scope.insdata.length - 1) {
            //重新显示门店marker
            $scope.setInsMarker();
          }
        }
      });
    };
    //设置marker点
    $scope.setInsMarker = function () {
      for (var i = 0; i < $scope.withinIns.length; i++) {
        var ins = $scope.withinIns[i];
        new AMap.Marker({
          map: $scope.map,
          position: $scope.withinIns[i].lnglat,
          extData: $scope.withinIns[i],//当前的机构信息
          content: '<div class="uicon-' + (ins.InstitutionPriority == "A" ? "markerA" : (ins.InstitutionPriority == "B" ? "markerB" : "markerC")) + '"></div>'
        }).on('click', $scope.showInfoWindow);
      }
    };
    //点击Marker显示信息窗体
    $scope.showInfoWindow = function (event) {
      $scope.currentins = {
        InstitutionModel: event.target.getExtData(),
        CheckIn: null,
        CheckOut: null
      };
      if ($scope.todaysch.length == 0) {
        $scope.setInfoWindow();
      } else {
        //判断是否允许拜访
        for (var i = 0; i < $scope.todaysch.length; i++) {
          if ($scope.todaysch[i].InstitutionModel.InstitutionID == $scope.currentins.InstitutionModel.InstitutionID) {
            $scope.currentins.CheckIn = $scope.todaysch[i].CheckIn;
            $scope.currentins.CheckOut = $scope.todaysch[i].CheckOut;
          }
          if (i == $scope.todaysch.length - 1) {
            $scope.setInfoWindow();
          }
        }
      }
    };
    $scope.setInfoWindow = function () {
      var content = $compile('<div>' +
        '      <div class="info">' +
        '        <div class="info-top">' +
        '          <div class="inf-top-left txt" ng-click="govisit(currentins)">' +
        '          </div>' +
        '          <div class="inf-top-right">' +
        '            <span ng-bind="currentins.InstitutionModel.InstitutionName"></span>' +
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
      infoWindow.open($scope.map, $scope.currentins.InstitutionModel.lnglat);
    }
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
    $scope.selectIns = function (item) {
      //优先定位置签出
      if (item.CheckOut != null) {
        $scope.map.panTo(item.CheckOut.LngLat);
      } else if (item.CheckIn != null) {
        $scope.map.panTo(item.CheckIn.LngLat);
      } else {
        $scope.map.panTo(item.InstitutionModel.lnglat);
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
    //获取附近药店
    $scope.getnearby = function (lnglat,callback) {
      guidesrv.getNearBy(lnglat).then(function (data) {
        var result = [];
        if (data.length == 0) {
          $scope.insdata = result;
          if (callback != null) {
            callback();
          }
        } else {
          for (var i = 0; i < data.length; i++) {
            var item = {
              InstitutionModel: data[i],
              CheckIn: null,
              CheckOut: null
            };
            if($scope.todaysch.length==0){
              result.push(item);
            }
            //判断是否允许拜访
            for (var j = 0; j < $scope.todaysch.length; j++) {
              if ($scope.todaysch[j].InstitutionModel.InstitutionID == item.InstitutionModel.InstitutionID) {
                item.CheckIn = $scope.todaysch[j].CheckIn;
                item.CheckOut = $scope.todaysch[j].CheckOut;
              }
              if (j == $scope.todaysch.length - 1) {
                result.push(item);
              }
            }
            if (i == data.length - 1) {
              $scope.insdata = result;
              if (callback != null) {
                callback();
              }
            }
          }
        }
      });
    };
    //下游门店搜索参数
    $scope.storeQuery={
      Key:"",//搜索关键字
      Page:1,//当前页码
      RemainingCount:0//剩余页码
    };
    //获取下游门店
    $scope.getChainStores=function(para,callback){
      guidesrv.getChainStores(para).then(function (data) {
        var result = [];
        $scope.storeQuery.Page=data.Page;
        $scope.storeQuery.RemainingCount=data.RemainingCount
        if (data.Institutions.length == 0) {
          $scope.chainStores = result;
          if (callback != null) {
            callback();
          }
        } else {
          for (var i = 0; i < data.Institutions.length; i++) {
            var item = {
              InstitutionModel: data.Institutions[i],
              CheckIn: null,
              CheckOut: null
            };
            if($scope.todaysch.length==0){
              result.push(item);
            }
            //判断是否允许拜访
            for (var j = 0; j < $scope.todaysch.length; j++) {
              if ($scope.todaysch[j].InstitutionModel.InstitutionID == item.InstitutionModel.InstitutionID) {
                item.CheckIn = $scope.todaysch[j].CheckIn;
                item.CheckOut = $scope.todaysch[j].CheckOut;
              }
              if (j == $scope.todaysch.length - 1) {
                result.push(item);
              }
            }
            if (i == data.Institutions.length - 1) {
              $scope.chainStores = result;
              console.log($scope.chainStores);
              if (callback != null) {
                callback();
              }
            }
          }
        }
      });
    };

    //初始化
    $scope.init = function () {
      $scope.getTodaySch(function () {
        $scope.getChainStores($scope.storeQuery,function () {
          $scope.$broadcast("amap", "datacompleted");
        })
      })
    };
    $scope.init();

  });
