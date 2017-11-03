angular.module('aecheckout.ctrl', [])

  .controller('aeCheckoutCtrl', function($scope,$compile) {
    $scope.local={
      longitude:0,
      latitude:0
    };
    //定位地图
    var map = new AMap.Map("checkoutmapcontainer",
      {
        view:new AMap.View2D({
          resizeEnable: true,
          zoom: 15
        }),
        lang:"zh_cn"
      });
    map.plugin(["AMap.Geolocation", "AMap.PlaceSearch"],
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

        //完成定位 返回定位信息
        AMap.event.addListener(geolocation,
          "complete",
          function (data) {
            var currPosition = [data.position.getLng(), data.position.getLat()];
            $scope.local.longitude = currPosition[0];
            $scope.local.latitude = currPosition[1];
            $scope.$apply();
            var circle = new AMap.Circle({
              //center: [data.position.getLng(), data.position.getLat()],// 圆心位置
              center:currPosition,
              radius: 500, //半径
              strokeColor: "#73b5f5", //线颜色
              strokeOpacity: 0.2, //线透明度
              strokeWeight: 3, //线粗细度
              fillColor: "#bfe8f5", //填充颜色
              fillOpacity: 0.35//填充透明度
            });
            circle.setMap(map);
            //这里的storedata 到时候实际用用户所负责的机构
            var storedata = [
              {"InstitutionName": "复方药店", "Address": "岚皋路121号", "InstitutionLat": "31.256124", "InstitutionLng": "121.41995","InstitutionPriority":"A"}
            ];
            //加载marker
            for (var i = 0; i < storedata.length; i++) {
              var position = new AMap.LngLat(storedata[i].InstitutionLng, storedata[i].InstitutionLat);
              marker = new AMap.Marker({
                icon: new AMap.Icon({
                  image:storedata[i].InstitutionPriority=="A"? "/img/GradeA-icon.png":(storedata[i].InstitutionPriority=="B"? "/img/GradeB-icon.png":"/img/GradeC-icon.png"),
                  size: new AMap.Size(26, 30)
                }),
                extData: { address: storedata[i].Address, name: storedata[i].InstitutionName,priority: storedata[i].InstitutionPriority },
                position: position //图标定位
              });
              marker.setMap(map);
            }
          });

        //解析定位错误信息
        AMap.event.addListener(geolocation,
          "error",
          function (data) {
            switch (data.info) {
              case 'PERMISSION_DENIED':
                myApp.alert('浏览器阻止了定位操作!', '错误');
                break;
              case 'POSITION_UNAVAILBLE':
                myApp.alert('无法获得当前位置!', '错误');
                break;
              case 'TIMEOUT':
                myApp.alert('定位超时!', '错误');
                break;
              default:
                myApp.alert('定位失败,请检查网络或系统设置!', '错误');
                break;
            }
          });
      });

  });
