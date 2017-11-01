angular.module('storenearby.ctrl', [])

  .controller('StorenearbyCtrl', function($scope,$compile) {angular.module('storenearby.ctrl', [])

    .controller('StorenearbyCtrl', function($scope,$compile) {
      $scope.local={
        longitude:0,
        latitude:0
      };
      $scope.editor = {};

      //信息窗体函数
      function createInfoWindow(title, content){
        var info = document.createElement("div");
        info.className = "info";

        //可以通过下面的方式修改自定义窗体的宽高
        //info.style.width = "400px";
        // 定义顶部标题
        var top = document.createElement("div");
        top.className = "info-top";
        top.innerHTML = title;
        info.appendChild(top);

        // 定义底部内容
        var bottom = document.createElement("div");
        bottom.className = "info-bottom";
        bottom.style.position = 'relative';
        bottom.style.top = '0px';
        bottom.style.left = '50%';
        bottom.style.margin = '0 auto';
        var sharp = document.createElement("img");
        sharp.src = "https://webapi.amap.com/images/sharp.png";
        bottom.appendChild(sharp);
        info.appendChild(bottom);
        return info;
      }
      //定位地图
      var map = new AMap.Map("storenearbymap",
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
                {"InstitutionName": "复方药店", "Address": "岚皋路121号", "InstitutionLat": "31.256124", "InstitutionLng": "121.41995","InstitutionPriority":"A"},
                {"InstitutionName": "人民大药房", "Address": "新村路211号", "InstitutionLat": "31.265674", "InstitutionLng": "121.422093","InstitutionPriority":"A"}
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
                marker.on("click", function (e) {
                  var title = '<div style="width:40px;height:45px;background-color:#419DE7;text-align:center;border-radius:5px 0 0 5px;"><a ui-sref="main.checkin"  style="display:inline-block;width:30px;height:45px;color:white;position:absolute;top:5px;left:5px;">进入拜访</a></div><div style="display:inline-block;width:190px;height:45px;"><span style="position:absolute;top:5px;left:48px;width: 142px;">' + e.target.G.extData.name + '</span></div>', content = [];
                  var hs = e.target.G.extData;
                  var marker_window = new AMap.InfoWindow({
                    isCustom: true,
                    content: $compile(createInfoWindow(title, content))($scope)[0],
                    autoMove: true,
                    closeWhenClickMap: true,
                    offset: new AMap.Pixel(0, -25)
                    //offset: new AMap.Pixel(16, -45)
                  });
                  marker_window.open(map, e.target.getPosition());
                });
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

      $scope.toggledragup = function(){
        $("#xccontent").slideToggle("slow");
      };

      $scope.showtodayroute = function(){
        $(".xd-li-2").addClass("xd_ul-li-active");
        $(".xd-li-1").removeClass("xd_ul-li-active");
        $(".xd-li-3").removeClass("xd_ul-li-active");
        $(".xd-span-2").addClass("xd_ul-span-active");
        $(".xd-span-1").removeClass("xd_ul-span-active");
        $(".xd-span-3").removeClass("xd_ul-span-active");
        $("#xd_tab_2").show();
        $("#xd_tab_1").hide();
        $("#xd_tab_3").hide();
      };
      $scope.shownearbystore = function(){
        $(".xd-li-1").addClass("xd_ul-li-active");
        $(".xd-li-2").removeClass("xd_ul-li-active");
        $(".xd-li-3").removeClass("xd_ul-li-active");
        $(".xd-span-1").addClass("xd_ul-span-active");
        $(".xd-span-2").removeClass("xd_ul-span-active");
        $(".xd-span-3").removeClass("xd_ul-span-active");
        $("#xd_tab_1").show();
        $("#xd_tab_2").hide();
        $("#xd_tab_3").hide();
      };
      $scope.showareastore = function(){
        $(".xd-li-3").addClass("xd_ul-li-active");
        $(".xd-li-2").removeClass("xd_ul-li-active");
        $(".xd-li-1").removeClass("xd_ul-li-active");
        $(".xd-span-3").addClass("xd_ul-span-active");
        $(".xd-span-2").removeClass("xd_ul-span-active");
        $(".xd-span-1").removeClass("xd_ul-span-active");
        $("#xd_tab_3").show();
        $("#xd_tab_2").hide();
        $("#xd_tab_1").hide();
      };

      //点击右上角搜索机构图标
      $scope.searchstore = function(){
        $(".callguide-searchstorediv").fadeIn(300);
      };
      //关闭搜索机构弹窗
      $scope.closesearchstorediv = function(){
        $(".callguide-searchstorediv").fadeOut(300);
      };
    });

    $scope.local={
      longitude:0,
      latitude:0
    };
    $scope.editor = {};

    //信息窗体函数
    function createInfoWindow(title, content){
      var info = document.createElement("div");
      info.className = "info";

      //可以通过下面的方式修改自定义窗体的宽高
      //info.style.width = "400px";
      // 定义顶部标题
      var top = document.createElement("div");
      top.className = "info-top";
      top.innerHTML = title;
      info.appendChild(top);

      // 定义底部内容
      var bottom = document.createElement("div");
      bottom.className = "info-bottom";
      bottom.style.position = 'relative';
      bottom.style.top = '0px';
      bottom.style.left = '50%';
      bottom.style.margin = '0 auto';
      var sharp = document.createElement("img");
      sharp.src = "https://webapi.amap.com/images/sharp.png";
      bottom.appendChild(sharp);
      info.appendChild(bottom);
      return info;
    }
    //定位地图
    var map = new AMap.Map("storenearbymap",
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
              {"InstitutionName": "复方药店", "Address": "岚皋路121号", "InstitutionLat": "31.256124", "InstitutionLng": "121.41995","InstitutionPriority":"A"},
              {"InstitutionName": "人民大药房", "Address": "新村路211号", "InstitutionLat": "31.265674", "InstitutionLng": "121.422093","InstitutionPriority":"A"}
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
              marker.on("click", function (e) {
                var title = '<div style="width:40px;height:45px;background-color:#419DE7;text-align:center;border-radius:5px 0 0 5px;"><a ui-sref="main.checkin"  style="display:inline-block;width:30px;height:45px;color:white;position:absolute;top:5px;left:5px;">进入拜访</a></div><div style="display:inline-block;width:190px;height:45px;"><span style="position:absolute;top:5px;left:48px;width: 142px;">' + e.target.G.extData.name + '</span></div>', content = [];
                var hs = e.target.G.extData;
                var marker_window = new AMap.InfoWindow({
                  isCustom: true,
                  content: $compile(createInfoWindow(title, content))($scope)[0],
                  autoMove: true,
                  closeWhenClickMap: true,
                  offset: new AMap.Pixel(0, -25)
                  //offset: new AMap.Pixel(16, -45)
                });
                marker_window.open(map, e.target.getPosition());
              });
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

    $scope.toggledragup = function(){
      $("#xccontent").slideToggle("slow");
    };

    $scope.showtodayroute = function(){
      $(".xd-li-2").addClass("xd_ul-li-active");
      $(".xd-li-1").removeClass("xd_ul-li-active");
      $(".xd-li-3").removeClass("xd_ul-li-active");
      $(".xd-span-2").addClass("xd_ul-span-active");
      $(".xd-span-1").removeClass("xd_ul-span-active");
      $(".xd-span-3").removeClass("xd_ul-span-active");
      $("#xd_tab_2").show();
      $("#xd_tab_1").hide();
      $("#xd_tab_3").hide();
    };
    $scope.shownearbystore = function(){
      $(".xd-li-1").addClass("xd_ul-li-active");
      $(".xd-li-2").removeClass("xd_ul-li-active");
      $(".xd-li-3").removeClass("xd_ul-li-active");
      $(".xd-span-1").addClass("xd_ul-span-active");
      $(".xd-span-2").removeClass("xd_ul-span-active");
      $(".xd-span-3").removeClass("xd_ul-span-active");
      $("#xd_tab_1").show();
      $("#xd_tab_2").hide();
      $("#xd_tab_3").hide();
    };
    $scope.showareastore = function(){
      $(".xd-li-3").addClass("xd_ul-li-active");
      $(".xd-li-2").removeClass("xd_ul-li-active");
      $(".xd-li-1").removeClass("xd_ul-li-active");
      $(".xd-span-3").addClass("xd_ul-span-active");
      $(".xd-span-2").removeClass("xd_ul-span-active");
      $(".xd-span-1").removeClass("xd_ul-span-active");
      $("#xd_tab_3").show();
      $("#xd_tab_2").hide();
      $("#xd_tab_1").hide();
    };

    //点击右上角搜索机构图标
    $scope.searchstore = function(){
      $(".callguide-searchstorediv").fadeIn(300);
    };
    //关闭搜索机构弹窗
    $scope.closesearchstorediv = function(){
      $(".callguide-searchstorediv").fadeOut(300);
    };
  });
