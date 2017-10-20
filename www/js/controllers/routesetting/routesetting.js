angular.module('routesetting.ctrl', ['ionic', 'routesetting.srv'])
  .controller('RouteSettingCtrl', function ($rootScope, $scope, $ionicPopup, $ionicListDelegate, $compile, routesettingsrv) {

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

    //初始化完成后执行
    $scope.$on('amap', function (errorType, data) {
      if (data == "mapcompleted") {
        //点击地图关闭编辑窗口
        $scope.map.clearMap();
        $scope.map.clearInfoWindow();
        $scope.map.on('click', function (e) {
          //通知关闭详细
          $scope.$broadcast("close", "detail");
          $scope.$apply();
        });
        $scope.style = [
          {
            url: "img/list-gradeA-icon.png",
            anchor: new AMap.Pixel(6, 6),
            size: new AMap.Size(28, 28)
          },
          {
            url: "img/list-gradeB-icon.png",
            anchor: new AMap.Pixel(6, 6),
            size: new AMap.Size(28, 28)
          },
          {
            url: "img/list-gradeC-icon.png",
            anchor: new AMap.Pixel(6, 6),
            size: new AMap.Size(28, 28)
          },
          //小图
          {
            url: "img/list-gradeA-icon.png",
            anchor: new AMap.Pixel(6, 6),
            size: new AMap.Size(20, 20)
          },
          {
            url: "img/list-gradeB-icon.png",
            anchor: new AMap.Pixel(6, 6),
            size: new AMap.Size(20, 20)
          },
          {
            url: "img/list-gradeC-icon.png",
            anchor: new AMap.Pixel(6, 6),
            size: new AMap.Size(20, 20)
          },
        ];
        $scope.mass = new AMap.MassMarks($scope.insdata, {
          zIndex: 111,
          cursor: 'pointer',
          style: $scope.style,
        });
        $scope.mass.on('click', $scope.showInfoWindow);
        $scope.mass.setMap($scope.map);

      }
    });
    //接收关闭窗口命令
    $scope.$on('close', function (errorType, data) {
      if (data == "detail" && $scope.routeedit==false) {
        $scope.closeroutedetail();
      }
    });
    //当前点击的机构
    $scope.currentins;
    //加入路线图
    $scope.addinline = function () {
      //新增到路线篮子或者编辑的路线中
      //更新
      console.log('skkjkjkjl');
      if ($scope.routeedit) {
        if ($scope.currentRoute.Institutions.indexOf($scope.currentins) == -1) {
          $scope.currentRoute.Institutions.push($scope.currentins);
        } else {
          //提示
          $rootScope.toast("已选择该机构");
        }
      } else {
        if ($scope.route.cart.indexOf($scope.currentins) == -1) {
          $scope.route.cart.push($scope.currentins);
        } else {
          //提示
          $rootScope.toast("已选择该机构");
        }
      }

    };
    $scope.infoWindow = new AMap.InfoWindow({
      offset: new AMap.Pixel(110, -5),
      isCustom: true,
      //closeWhenClickMap:true
    });
    //点击Marker
    $scope.showInfoWindow = function (event) {
      //点击的机构数据
      $scope.currentins = event.data;
      $scope.$apply();
      $scope.infoWindow.setContent($compile($("#infowindow").html())($scope)[0]);
      $scope.infoWindow.open($scope.map, event.data.lnglat);
    };
    //是否为新增状态
    $scope.isnewly = false;
    //新增路线
    $scope.addnewroute = function () {
      $scope.isnewly = true;
      $scope.routedetail = false;
      $scope.routeedit = false;
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
    //保存路线
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
    }

    //显示路线明细
    $scope.routedetail = false;
    $scope.currentRoute = {};
    //显示路线明细
    $scope.showroutedetail = function (model) {
      routesettingsrv.getroutedetail(model.LineID).then(function (data) {
        $scope.currentRoute = data;
        $scope.isnewly = false;
        $scope.routedetail = true;
        $scope.routeedit = false;
        //绘制路线图
        var lineArr = [];
        var markers = $scope.mass.getData();
        for (var k = 0; k < markers.length; k++) {
          if(markers[k].style < 3 ){
            markers[k].style=markers[k].style + 3;
          }
        }
        for (var i = 0; i < $scope.currentRoute.Institutions.length; i++) {
          lineArr.push($scope.currentRoute.Institutions[i].lnglat);
          if (i == $scope.currentRoute.Institutions.length - 1) {
            //删除原来的折线
            if ($scope.polyline != null) {
              $scope.map.remove($scope.polyline);
            }
            $scope.polyline = new AMap.Polyline({
              path: lineArr,          //设置线覆盖物路径
              strokeColor: "#419de7", //线颜色
              strokeOpacity: 1,       //线透明度
              strokeWeight: 2,        //线宽
              strokeStyle: "dashed",   //线样式
              //strokeDasharray: [10, 5] //补充线样式
            });
            $scope.polyline.setMap($scope.map);
          }
          for (var k = 0; k < markers.length; k++) {
            if (markers[k].InstitutionID == $scope.currentRoute.Institutions[i].InstitutionID) {
              markers[k].style=markers[k].InstitutionPriority=="A"?0:(markers[k].InstitutionPriority=="B"?1:2);
            }
          }
        }
      });
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
    $scope.openinsinfo = function (model) {
      $scope.map.clearInfoWindow();
      $scope.currentins = model;
      $scope.infoWindow.setContent($compile($("#infowindow").html())($scope)[0]);
      $scope.infoWindow.open($scope.map, model.lnglat);
    }
  });
