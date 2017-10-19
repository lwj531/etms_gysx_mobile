angular.module('routesetting.ctrl', ['ionic', 'routesetting.srv'])
  .controller('RouteSettingCtrl', function ($rootScope,$scope, $ionicPopup,$ionicListDelegate,$compile, routesettingsrv) {

    $scope.route ={
      name:"",
      //路线篮子
      cart:[]
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
        //加载Marker
        for (var i = 0; i < $scope.insdata.length; i++) {
          var ins = $scope.insdata[i];
          var position = new AMap.LngLat(ins.InstitutionLng, ins.InstitutionLat);
          var marker = new AMap.Marker({
            icon: new AMap.Icon({
              image: ins.InstitutionPriority == "A" ? "img/GradeA-icon.png" : (ins.InstitutionPriority == "B" ? "img/GradeB-icon.png" : "img/GradeC-icon.png"),
              size: new AMap.Size(26, 30)
            }),
            extData: ins,
            position: position //图标定位
          });
          marker.setMap($scope.map);
          AMap.event.addListener(marker, 'click', $scope.showInfoWindow);
        }
      }
    });
    //当前点击的机构
    $scope.currentins;
    //加入路线图
    $scope.addinline = function () {
      if( $scope.route.cart.indexOf($scope.currentins)==-1){
        $scope.route.cart.push($scope.currentins);
      }else{
        //提示
        $rootScope.toast("已选择该机构");
      }
    };
    //点击Marker
    $scope.showInfoWindow = function (event) {
      //点击的机构数据
      $scope.currentins = event.target.getExtData();
      var center = new AMap.LngLat($scope.currentins.InstitutionLng, $scope.currentins.InstitutionLat);
      $scope.map.panTo(center);
      $scope.map.panBy(0, 100);
      $scope.$apply();
      var infowindow = new AMap.InfoWindow({
        isCustom: true,
        content: $compile($("#infowindow").html())($scope)[0],
        autoMove: true,
        closeWhenClickMap: true,
        offset: new AMap.Pixel(110, -22)
      });
      infowindow.open($scope.map, center);
    };
    //是否为新增状态
    $scope.isnewly = false;
    //新增路线
    $scope.addnewroute = function () {
      $scope.isnewly = true;
    };
    //拖动排序的回调函数
    $scope.moveRoute = function(item, fromIndex, toIndex){
      $scope.route.cart.splice(fromIndex, 1);
      $scope.route.cart.splice(toIndex, 0, item);
    };
    //关闭新增路线
    $scope.closeaddroute = function () {
      $scope.isnewly = false;
      $scope.route.cart=[];
      $scope.route.name="";
    };
    //保存路线
    $scope.saveroute = function () {
      if($scope.route.name==""){
        $rootScope.toast("请输入路线名");
      }else if($scope.route.cart.length<=0){
        $rootScope.toast("请选择机构");
      }else{
        var model ={
          LineName:$scope.route.name,
          Institutions:$scope.route.cart
        };
        routesettingsrv.saveroute(model).then(function (state) {
          if(state){
            $rootScope.toast("保存成功");
            $scope.closeaddroute();
            $scope.getroutes();

          }else{
            $rootScope.toast("保存失败");
          }
        });
      }
    }

/*

    //此处的items里面的数据是每条路线里的数据
    $scope.items = [
      {name: '国药控股大药房永新连锁店', address: '上海石泉路546号', grade: 'A'},
      {name: '吉林大药房卫星路连锁店', address: '上海石泉路546号', grade: 'B'},
      {name: '华氏大药房石泉二店', address: '上海石泉路546号', grade: 'C'}
    ];

    var selected = $scope.selected;
    //点击路线之后，出现路线的详情弹窗
    $scope.selectLine = function (index) {
      $scope.selected = index;
      /!* console.log(index);
       console.log($scope.selected);*!/
      $(".lineinfodiv").fadeIn(300);
      $(".addnewroutediv").fadeOut(300);
      $(".searchstorediv").fadeOut(300);
      $(".nolatlng-storediv").fadeOut(300);

      map.clearMap();
      var data1 = [
        {
          "InstitutionName": "国药控股大药房永新连锁店",
          "LocationAddress": "南京路221号",
          "InstitutionLat": "31.258215",
          "InstitutionLng": "121.418921",
          "Priority": "A",
          "Linename": "01"
        },
        {
          "InstitutionName": "老百姓大药房",
          "LocationAddress": "上海市静安区成都北路165号",
          "InstitutionLat": "31.258857",
          "InstitutionLng": "121.421496",
          "Priority": "B",
          "Linename": "02"
        },
        {
          "InstitutionName": "星巴克",
          "LocationAddress": "人民大道211号222铺",
          "InstitutionLat": "31.256124",
          "InstitutionLng": "121.41995",
          "Priority": "B",
          "Linename": "02"
        },
        {
          "InstitutionName": "复星黄河大药房",
          "LocationAddress": "上海市黄浦区凤阳路250号",
          "InstitutionLat": "31.256307",
          "InstitutionLng": "121.417591",
          "Priority": "A",
          "Linename": "02"
        },
        {
          "InstitutionName": "百姓缘大药房",
          "LocationAddress": "普陀区凤阳路250号",
          "InstitutionLat": "31.25981",
          "InstitutionLng": "121.41875",
          "Priority": "C",
          "Linename": "01"
        },
        {
          "InstitutionName": "广善缘大药房",
          "LocationAddress": "普陀区凤阳路250号",
          "InstitutionLat": "31.258875",
          "InstitutionLng": "121.417097",
          "Priority": "B",
          "Linename": ""
        },
        {
          "InstitutionName": "国大药房",
          "LocationAddress": "普陀区凤阳路250号",
          "InstitutionLat": "31.257261",
          "InstitutionLng": "121.422676",
          "Priority": "B",
          "Linename": "01"
        },
        {
          "InstitutionName": "广济大药房",
          "LocationAddress": "普陀区凤阳路250号",
          "InstitutionLat": "31.254821",
          "InstitutionLng": "121.421174",
          "Priority": "B",
          "Linename": "03"
        },
        {
          "InstitutionName": "国胜大药房",
          "LocationAddress": "普陀区凤阳路250号",
          "InstitutionLat": "31.255427",
          "InstitutionLng": "121.419994",
          "Priority": "C",
          "Linename": "03"
        },
        {
          "InstitutionName": "为民大药房",
          "LocationAddress": "普陀区凤阳路250号",
          "InstitutionLat": "31.258105",
          "InstitutionLng": "121.422912",
          "Priority": "B",
          "Linename": ""
        },
        {
          "InstitutionName": "同济大药房",
          "LocationAddress": "普陀区凤阳路250号",
          "InstitutionLat": "31.257628",
          "InstitutionLng": "121.417033",
          "Priority": "A",
          "Linename": "03"
        },
        {
          "InstitutionName": "益安堂大药房",
          "LocationAddress": "普陀区凤阳路250号",
          "InstitutionLat": "31.255078",
          "InstitutionLng": "121.417484",
          "Priority": "C",
          "Linename": "01"
        },
        {
          "InstitutionName": "长寿大药房",
          "LocationAddress": "普陀区凤阳路250号",
          "InstitutionLat": "31.258031",
          "InstitutionLng": "121.418557",
          "Priority": "B",
          "Linename": "03"
        }
      ];
      var json1 = eval(data1);
      var data2 = [
        {
          "InstitutionName": "普陀区医院",
          "LocationAddress": "南京西路216号大光明电影院二楼",
          "InstitutionLat": "31.258215",
          "InstitutionLng": "121.418921",
          "Priority": "C",
          "Linename": "02"
        },
        {
          "InstitutionName": "老百姓大药房",
          "LocationAddress": "上海市静安区成都北路165号",
          "InstitutionLat": "31.258857",
          "InstitutionLng": "121.421496",
          "Priority": "B",
          "Linename": "02"
        },
        {
          "InstitutionName": "星巴克",
          "LocationAddress": "人民大道211号222铺",
          "InstitutionLat": "31.256124",
          "InstitutionLng": "121.41995",
          "Priority": "B",
          "Linename": "02"
        },
        {
          "InstitutionName": "复星黄河大药房",
          "LocationAddress": "上海市黄浦区凤阳路250号",
          "InstitutionLat": "31.256307",
          "InstitutionLng": "121.417591",
          "Priority": "A",
          "Linename": "02"
        }
      ];
      var json2 = eval(data2);
      lineArr = [
        [121.418921, 31.258215], [121.421496, 31.258857], [121.41995, 31.256124], [121.417591, 31.256307]
      ];
      //加载Marker
      for (var i = 0; i < json1.length; i++) {
        position = new AMap.LngLat(json1[i].InstitutionLng, json1[i].InstitutionLat);
        if (json1[i].Priority == "A") {
          marker = new AMap.Marker({
            icon: new AMap.Icon({
              image: "/img/GradeA-icon.png",
              size: new AMap.Size(26, 30)
            }),
            extData: {address: json1[i].LocationAddress, name: json1[i].InstitutionName},
            position: position //图标定位
          });
          marker.setMap(map);
          AMap.event.addListener(marker, 'click', _onClick);
          type_1.push(marker);
        }
        if (json1[i].Priority == "B") {
          marker = new AMap.Marker({
            icon: new AMap.Icon({
              image: "/img/GradeB-icon.png",
              size: new AMap.Size(26, 30)
            }),
            extData: {address: json1[i].LocationAddress, name: json1[i].InstitutionName},
            position: position //图标定位
          });
          marker.setMap(map);
          AMap.event.addListener(marker, 'click', _onClick);
          type_2.push(marker);
        }
        if (json1[i].Priority == "C") {
          marker = new AMap.Marker({
            icon: new AMap.Icon({
              image: "/img/GradeC-icon.png",
              size: new AMap.Size(26, 30)
            }),
            extData: {address: json1[i].LocationAddress, name: json1[i].InstitutionName},
            position: position //图标定位
          });
          marker.setMap(map);
          AMap.event.addListener(marker, 'click', _onClick);
          type_3.push(marker);
        }
        all_marker.push(marker);

        marker.on("click", function (e) {

          var title3 = '<div style="width:40px;background-color:#4DCC89;text-align:center;height:45px;border-radius:5px 0 0 5px;"><span style="display:inline-block;width:30px;height:45px;color:white;position:absolute;top:5px;left:6px;">加入路线</span></div><div style="display:inline-block;width:190px;height:45px;"><span style="position:absolute;top:10px;left:48px;">' + e.target.G.extData.name + '</span></div>',
            content3 = [];

          var hs = e.target.G.extData;
          var marker_window = new AMap.InfoWindow({
            isCustom: true,
            content: createInfoWindow(title3, content3),
            autoMove: true,
            closeWhenClickMap: true,
            offset: new AMap.Pixel(110, -24)
          });
          marker_window.open(map, e.target.getPosition());
        });

      }
      for (var i = 0; i < json2.length; i++) {
        position = new AMap.LngLat(json2[i].InstitutionLng, json2[i].InstitutionLat);
        if (json1[i].Priority == "A") {
          marker = new AMap.Marker({
            icon: new AMap.Icon({
              image: "/img/GradeA-inline-icon.png",
              size: new AMap.Size(26, 30)
            }),
            extData: {address: json1[i].LocationAddress, name: json1[i].InstitutionName},
            position: position //图标定位
          });
          marker.setMap(map);
          AMap.event.addListener(marker, 'click', _onClick);
          type_1.push(marker);
        }
        if (json1[i].Priority == "B") {
          marker = new AMap.Marker({
            icon: new AMap.Icon({
              image: "/img/GradeB-inline-icon.png",
              size: new AMap.Size(26, 30)
            }),
            extData: {address: json1[i].LocationAddress, name: json1[i].InstitutionName},
            position: position //图标定位
          });
          marker.setMap(map);
          AMap.event.addListener(marker, 'click', _onClick);
          type_2.push(marker);
        }
        if (json1[i].Priority == "C") {
          marker = new AMap.Marker({
            icon: new AMap.Icon({
              image: "/img/GardeC-inline-icon.png",
              size: new AMap.Size(26, 30)
            }),
            extData: {address: json1[i].LocationAddress, name: json1[i].InstitutionName},
            position: position //图标定位
          });
          marker.setMap(map);
          AMap.event.addListener(marker, 'click', _onClick);
          type_3.push(marker);
        }
        all_marker.push(marker);
        marker.setLabel({
          offset: new AMap.Pixel(6, 3),
          content: parseInt(i + 1)
        });

        polyline = new AMap.Polyline({
          path: lineArr,            // 设置线覆盖物路径
          strokeColor: "green",   // 线颜色
          strokeOpacity: 1,         // 线透明度
          strokeWeight: 2,          // 线宽
          strokeStyle: 'dashed',     // 线样式
          strokeDasharray: [10, 5], // 补充线样式
          geodesic: true            // 绘制大地线
        });

        polyline.setMap(map);

        marker.on("click", function (e) {

          var title3 = '<div style="width:40px;background-color:#0076FF;text-align:center;height:45px;border-radius:5px 0 0 5px;"><img src="img/store-icon.png" style="display:inline-block;height:45px;color:white;position:absolute;left:-2px;"/></div><div style="display:inline-block;width:190px;height:45px;"><span style="position:absolute;top:10px;left:48px;">' + e.target.G.extData.name + '</span></div>',
            content3 = [];

          var hs = e.target.G.extData;
          var marker_window = new AMap.InfoWindow({
            isCustom: true,
            content: createInfoWindow(title3, content3),
            autoMove: true,
            closeWhenClickMap: true,
            offset: new AMap.Pixel(110, -24)
          });
          marker_window.open(map, e.target.getPosition());
        });
      }


    };


    //路线编辑状态中 删除某个店和上下移动顺序的方法函数
    $scope.data = {showDelete: false};
    $scope.moveItem = function (item, fromIndex, toIndex) {
      $scope.items.splice(fromIndex, 1);
      $scope.items.splice(toIndex, 0, item);
    };
    $scope.onItemDelete = function (item) {
      $scope.items.splice($scope.items.indexOf(item), 1);
    };

    $("#editlinebtn").click(function () {
      $(".editlinediv").hide();
      $("._editlinediv").show();
    });

    //编辑路线之后保存
    $scope.saveeditlineinfo = function () {
      alert(1);
      routesettingsrv.keywordsearchstore().then(function (data) {
        console.log(data);
      });
    };

    //删除路线
    $scope.deleteline = function () {
      /!* var confirmPopup = $ionicPopup.confirm({
         title:'',
         template:'确认删除路线?'
       });
       confirmPopup.then(function(res){
         if(res){
           console.log("1");
         }else{
           console.log("0");
         }
       });*!/

      //用了自定义弹窗
      var warnPopup = $ionicPopup.show({
        template: '',
        title: '确认删除路线?',
        scope: $scope,
        buttons: [
          {text: '取消'},
          {
            text: '删除',
            type: 'button-assertive',
            onTap: function (e) {
              alert(1);
              routesettingsrv.deleterouteline().then(function (data) {
                console.log(data);
              });
            }
          }
        ]
      })
    };


    /////////////这些是打开/关闭一些弹窗的函数////////////
    $scope.closeeditdiv = function () {
      $("._editlinediv").fadeOut(300);
      $(".editlinediv").show();
    };

    $scope.searchstore = function () {
      $(".searchstorediv").fadeIn(300);
      $(".lineinfodiv").fadeIn(300);
      $(".addnewroutediv").fadeOut(300);
      $(".nolatlng-storediv").fadeOut(300);
    };

    //关键字搜索机构函数
    $scope.searchstorebykeyword = function () {
      // debugger;
      var namekeyword = $("#KeyWordOfStoreName").val();
      routesettingsrv.keywordsearchstore().then(function (data) {
        console.log(data);
      });
    };
    //请求无坐标机构数据函数
    $scope.search_nopositionstore = function () {
      $(".nolatlng-storediv").fadeIn(300);
      $(".lineinfodiv").fadeIn(300);
      $(".addnewroutediv").fadeOut(300);
      $(".searchstorediv").fadeOut(300);
      routesettingsrv.nocoordinatestoreinfo().then(function (data) {
        console.log(data);
      });


    };
    $scope.close_nolatlngstorediv = function () {
      $(".nolatlng-storediv").fadeOut(300);
    };
    $scope.closesearchstorediv = function () {
      $(".searchstorediv").fadeOut(300);
    };
    //////////////////////////////////////////////////////////
*/

  });
