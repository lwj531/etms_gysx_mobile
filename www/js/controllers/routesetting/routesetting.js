angular.module('routesetting.ctrl', ['ionic', 'routesetting.srv'])
  .controller('RouteSettingCtrl', function ($rootScope, $scope, $ionicPopup, $ionicListDelegate, $compile, $timeout, routesettingsrv) {
    $scope.route = {
      name: "",
      //路线篮子
      cart: []
    }
    //获取路线图
    $scope.getroutes = function () {
      routesettingsrv.getroutes().then(function (data) {
        $scope.routes = data;
      });
    };
    //获取用户所有机构
    $scope.getins = function () {
      routesettingsrv.getins().then(function (data) {
        $scope.insdata = data;
        //设置原点
        $scope.center = new AMap.LngLat(data[0].InstitutionLng, data[0].InstitutionLat);
        //通知数据已获取
        $scope.$broadcast("amap", "datacompleted");
      });
    };
    //初始化
    $scope.init = function () {
      $scope.getroutes();
      $scope.getins();
    };
    $scope.init();

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
      }
    });
    //获取定位坐标成功
    $scope.getlocationComplete = function (data) {
      $rootScope.toast("获取坐标成功。");
      $scope.haslocal = true;
      $scope.lnglat = [data.position.getLng(), data.position.getLat()];
      $scope.setInsMarker();
    };
    //获取定位坐标失败
    $scope.getlocationError = function () {
      $rootScope.toast("获取坐标失败，请重新定位。");
      $scope.lnglat = [];
      $scope.haslocal = true;
      $scope.setInsMarker();
    };
    //设置marker点
    $scope.setInsMarker = function () {
      for (var i = 0; i < $scope.insdata.length; i++) {
        var ins = $scope.insdata[i];
        new AMap.Marker({
          map: $scope.map,
          position: ins.lnglat,
          extData: ins,//当前的机构信息
          content: '<div class="uicon-' + (ins.InstitutionPriority == "A" ? "markerA" : (ins.InstitutionPriority == "B" ? "markerB" : "markerC")) + '"></div>'
        }).on('click', $scope.showInfoWindow);
      }
    };
    //接收关闭窗口命令
    $scope.$on('close', function (errorType, data) {
      if (data == "detail" && $scope.routeedit == false) {
        $scope.closeroutedetail();
      }
    });
    //当前点击的机构
    $scope.currentins;
    //加入路线图
    $scope.addinline = function () {
      //新增到路线篮子或者编辑的路线中
      if ($scope.routeedit) {
        if ($scope.currentRoute.Institutions.indexOf($scope.currentins) == -1) {
          $scope.currentRoute.Institutions.push($scope.currentins);
          $rootScope.toast("添加成功");
        } else {
          //提示
          $rootScope.toast("已选择该机构");
        }
      } else {
        if ($scope.route.cart.indexOf($scope.currentins) == -1) {
          $scope.route.cart.push($scope.currentins);
          $rootScope.toast("添加成功");
        } else {
          //提示
          $rootScope.toast("已选择该机构");
        }
      }
    };
    //关闭信息窗体
    $scope.closeInfoWindow = function () {
      $scope.map.clearInfoWindow();
    };
    $scope.infoWindow = new AMap.InfoWindow({
      offset: new AMap.Pixel(-5, 0),
      isCustom: true,
      closeWhenClickMap: true,
      autoMove: true
    });
    //点击Marker
    $scope.showInfoWindow = function (event) {
      //点击的机构数据
      $scope.currentins = event.target.getExtData();
      $scope.openinsinfo();
    };
    //是否为新增状态
    $scope.isnewly = false;
    //新增路线
    $scope.addnewroute = function () {
      $scope.isnewly = true;
      $scope.routedetail = false;
      $scope.routeedit = false;
      //关闭搜索框
      $scope.closesearchmodal();
      //关闭无坐标机构窗体
      $scope.closenolatlngmodal();
    };
    //拖动排序的回调函数
    $scope.moveRoute = function (arr, item, fromIndex, toIndex) {
      arr.splice(fromIndex, 1);
      arr.splice(toIndex, 0, item);
    };
    //关闭新增路线
    $scope.closeaddroute = function () {
      $scope.isnewly = false;
      $scope.route.cart = [];
      $scope.route.name = "";
    };
    //保存路线到服务器
    $scope.saveroute = function () {
      if ($scope.route.name == "") {
        $rootScope.toast("请输入路线名");
      } else if ($scope.route.cart.length <= 0) {
        $rootScope.toast("请选择机构");
      } else {
        var model = {
          LineName: $scope.route.name,
          Institutions: $scope.route.cart
        };
        routesettingsrv.saveroute(model).then(function (state) {
          if (state) {
            $rootScope.toast("保存成功");
            $scope.closeaddroute();
            $scope.getroutes();

          } else {
            $rootScope.toast("保存失败");
          }
        });
      }
    };
    //显示路线明细
    $scope.routedetail = false;
    $scope.currentRoute = {};
    //显示路线明细
    $scope.showroutedetail = function (model) {
      if($scope.lnglat!=null){
        routesettingsrv.getroutedetail(model.LineID).then(function (data) {
          $scope.currentRoute = data;
          $scope.isnewly = false;
          $scope.routedetail = true;
          $scope.routeedit = false;
          //关闭搜索框
          $scope.closesearchmodal();
          //关闭无坐标机构窗体
          $scope.closenolatlngmodal();
          //绘制路线图
          var lineArr = [];
          for (var i = 0; i < $scope.currentRoute.Institutions.length; i++) {
            lineArr.push($scope.currentRoute.Institutions[i].lnglat);
            if (i == $scope.currentRoute.Institutions.length - 1) {
              new AMap.Polyline({
                path: lineArr,          //设置线覆盖物路径
                strokeColor: "#419de7", //线颜色
                strokeOpacity: 1,       //线透明度
                strokeWeight: 2,        //线宽
                strokeStyle:'solid',   //线样式
                //strokeDasharray: [10, 5] //补充线样式
              }).setMap($scope.map);
              $scope.map.panTo(lineArr[0]);
            }
          }
        });
      }
    };
    //编辑线路模式
    $scope.showrouteedit = function () {
      $scope.routeedit = true;
      $scope.isnewly = false;
      $scope.routedetail = true;
    };
    //退出编辑线路模式
    $scope.closerouteedit = function () {
      $scope.routeedit = false;
    };
    //删除路线
    $scope.deleteroute = function () {
      $ionicPopup.confirm({
        title: '提示',
        template: '是否确认删除'
      }).then(function (res) {
        if (res) {
          routesettingsrv.deteteroute($scope.currentRoute.LineID).then(function (state) {
            if (state) {
              $rootScope.toast("操作成功");
              $scope.routeedit = false;
              $scope.routedetail = false;
              //刷新
              $scope.getroutes();
            } else {
              $rootScope.toast("操作失败");
            }
          });
        }
      });
    }
    //更新路线保存
    $scope.updateroute = function () {
      if ($scope.currentRoute.LineName == "") {
        $rootScope.toast("请输入路线名");
      } else if ($scope.currentRoute.Institutions.length <= 0) {
        $rootScope.toast("请选择机构");
      } else {
        routesettingsrv.saveroute($scope.currentRoute).then(function (state) {
          if (state) {
            $rootScope.toast("保存成功");
            $scope.routeedit = false;
            $scope.routedetail = false;
            //刷新
            $scope.getroutes();

          } else {
            $rootScope.toast("保存失败");
          }
        });
      }
    }
    //关闭明细框
    $scope.closeroutedetail = function () {
      $scope.routeedit = false;
      $scope.routedetail = false;
    };
    //点击明细中的机构
    $scope.insroutesinfo = "";//点击机构提示所在线路
    $scope.routetoast = false;
    $scope.showinsinfo = function (model) {
      $scope.currentins = model;
      $scope.openinsinfo();
    }
    $scope.openinsinfo = function () {
      var model = $scope.currentins;
      $scope.map.clearInfoWindow();
      var content = $compile($("#infowindow").html())($scope)[0];
      var infoWindow = new AMap.InfoWindow({
        offset: new AMap.Pixel(-10, -40),
        isCustom: true,
        closeWhenClickMap: true,
        autoMove: true,
        content: content
      });
      infoWindow.open($scope.map, model.lnglat);
      //机构提示存在线路
      routesettingsrv.getRoutelinesByInstitution(model.InstitutionID).then(function (data) {
        if (data.length > 0) {
          $scope.routetoast = true;
          var str = [];
          for (var i = 0; i < data.length; i++) {
            str.push(data[i].LineName);
            if (i == data.length - 1) {
              $scope.insroutesinfo = "此机构存在 " + str.join(",") + "中";
              $timeout(function () {
                $scope.insroutesinfo = "";
                $scope.routetoast = false;
              }, 2000);
            }
          }
        }
      });
    }
    //点击显示搜索窗体
    $scope.searchmodal = false;
    $scope.searchmodel = {
      Key: "InstitutionName",
      Value: ""
    };
    $scope.searchresult = [];
    //打开搜索窗体
    $scope.showsearchmodal = function () {
      $scope.closenolatlngmodal();
      //清空当前搜索结果
      $scope.searchmodal = true;
      $scope.searchresult = [];
    }
    //关闭搜索窗体
    $scope.closesearchmodal = function () {
      $scope.searchmodal = false;
      $scope.searchresult = [];
    }
    //搜索门店
    $scope.searchstorebykeyword = function () {
      var model = [$scope.searchmodel];
      routesettingsrv.searchins(model).then(function (data) {
        $scope.searchresult = data;
      });
    }
    //无坐标机构
    $scope.nolatlngmodal = false;
    $scope.nolatlngresult = [];
    $scope.shownolatlngmodal = function () {
      routesettingsrv.getnolatlngins().then(function (data) {
        $scope.nolatlngresult = data;
        $scope.nolatlngmodal = true;
      });
    }
    //关闭无坐标机构窗体
    $scope.closenolatlngmodal = function () {
      $scope.nolatlngmodal = false;
      $scope.nolatlngresult = [];
    }
  });
