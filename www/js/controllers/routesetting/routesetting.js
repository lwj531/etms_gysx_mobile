var editor;
var type_1 = new Array();
var type_2 = new Array();
var type_3 = new Array();
var type_4 = new Array();
var type_5 = new Array();
var type_6 = new Array();
var all_marker = new Array();
angular.module('routesetting.ctrl', ['ionic','routesetting.srv'])

  .controller('RouteSettingCtrl', function($scope,$ionicPopup,routesettingsrv) {
    $scope.local={
      longitude:0,
      latitude:0
    };

    //路线顶部显示有几条路线区域
    $scope.routName=[
      {name:'路线01'},
      {name:'路线02'},
      {name:'路线03'},
      {name:'路线04'},
      {name:'路线05'},
      {name:'路线06'},
      {name:'路线07'},
      {name:'路线08'},
      {name:'路线09'},
      {name:'路线10'}
    ];

    // 点击marker出现窗体信息函数
    function createInfoWindow(title, content) {
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
      bottom.style.margin = '0 auto';
      var sharp = document.createElement("img");
      sharp.src = "https://webapi.amap.com/images/sharp.png";
      bottom.appendChild(sharp);
      info.appendChild(bottom);
      return info;
    }

    var data1 = [
      { "InstitutionName": "国药控股大药房永新连锁店", "LocationAddress": "南京路221号", "InstitutionLat": "31.258215", "InstitutionLng": "121.418921" ,"Priority":"A","Linename":"01"},
      { "InstitutionName": "老百姓大药房", "LocationAddress": "上海市静安区成都北路165号", "InstitutionLat": "31.258857", "InstitutionLng": "121.421496","Priority":"B","Linename":"02" },
      { "InstitutionName": "星巴克", "LocationAddress": "人民大道211号222铺", "InstitutionLat": "31.256124", "InstitutionLng": "121.41995","Priority":"B","Linename":"02" },
      { "InstitutionName": "复星黄河大药房", "LocationAddress": "上海市黄浦区凤阳路250号", "InstitutionLat": "31.256307", "InstitutionLng": "121.417591" ,"Priority":"A","Linename":"02"},
      { "InstitutionName": "百姓缘大药房", "LocationAddress": "普陀区凤阳路250号", "InstitutionLat": "31.25981", "InstitutionLng": "121.41875","Priority":"C" ,"Linename":"01"},
      { "InstitutionName": "广善缘大药房", "LocationAddress": "普陀区凤阳路250号", "InstitutionLat": "31.258875", "InstitutionLng": "121.417097" ,"Priority":"B","Linename":""},
      { "InstitutionName": "国大药房", "LocationAddress": "普陀区凤阳路250号", "InstitutionLat": "31.257261", "InstitutionLng": "121.422676","Priority":"B" ,"Linename":"01"},
      { "InstitutionName": "广济大药房", "LocationAddress": "普陀区凤阳路250号", "InstitutionLat": "31.254821", "InstitutionLng": "121.421174","Priority":"B","Linename":"03" },
      { "InstitutionName": "国胜大药房", "LocationAddress": "普陀区凤阳路250号", "InstitutionLat": "31.255427", "InstitutionLng": "121.419994","Priority":"C","Linename":"03" },
      { "InstitutionName": "为民大药房", "LocationAddress": "普陀区凤阳路250号", "InstitutionLat": "31.258105", "InstitutionLng": "121.422912","Priority":"B" ,"Linename":""},
      { "InstitutionName": "同济大药房", "LocationAddress": "普陀区凤阳路250号", "InstitutionLat": "31.257628", "InstitutionLng": "121.417033" ,"Priority":"A","Linename":"03"},
      { "InstitutionName": "益安堂大药房", "LocationAddress": "普陀区凤阳路250号", "InstitutionLat": "31.255078", "InstitutionLng": "121.417484","Priority":"C" ,"Linename":"01"},
      { "InstitutionName": "长寿大药房", "LocationAddress": "普陀区凤阳路250号", "InstitutionLat": "31.258031", "InstitutionLng": "121.418557","Priority":"B" ,"Linename":"03"}
    ];
    var json1 = eval(data1);
    var data2 = [
      { "InstitutionName": "普陀区医院", "LocationAddress": "南京西路216号大光明电影院二楼", "InstitutionLat": "31.258215", "InstitutionLng": "121.418921","Priority":"C","Linename":"02" },
      { "InstitutionName": "老百姓大药房", "LocationAddress": "上海市静安区成都北路165号", "InstitutionLat": "31.258857", "InstitutionLng": "121.421496" ,"Priority":"B","Linename":"02"},
      { "InstitutionName": "星巴克", "LocationAddress": "人民大道211号222铺", "InstitutionLat": "31.256124", "InstitutionLng": "121.41995","Priority":"B","Linename":"02" },
      { "InstitutionName": "复星黄河大药房", "LocationAddress": "上海市黄浦区凤阳路250号", "InstitutionLat": "31.256307", "InstitutionLng": "121.417591","Priority":"A","Linename":"02" }
    ];
    var json2 = eval(data2);

    position = new AMap.LngLat(json1[0].InstitutionLng, json1[0].InstitutionLat);

    //实例地图
    var map = new AMap.Map("routemap",
      {
        view:new AMap.View2D({
          center:position,
          resizeEnable: true,
          zoom: 15
        }),
        lang:"zh_cn"
      });

    //加载Marker
    for (var i = 0; i < json1.length; i++) {
      position = new AMap.LngLat(json1[i].InstitutionLng, json1[i].InstitutionLat);
      if(json1[i].Priority == "A"){
        marker = new AMap.Marker({
          icon: new AMap.Icon({
            image: "/img/GradeA-icon.png",
            size: new AMap.Size(26, 30)
          }),
          extData: { address: json1[i].LocationAddress, name: json1[i].InstitutionName },
          position: position //图标定位
        });
        marker.setMap(map);
        AMap.event.addListener(marker,'click',_onClick);
        type_1.push(marker);
      }
      if(json1[i].Priority == "B"){
        marker = new AMap.Marker({
          icon: new AMap.Icon({
            image: "/img/GradeB-icon.png",
            size: new AMap.Size(26, 30)
          }),
          extData: { address: json1[i].LocationAddress, name: json1[i].InstitutionName },
          position: position //图标定位
        });
        marker.setMap(map);
        AMap.event.addListener(marker,'click',_onClick);
        type_2.push(marker);
      }
      if(json1[i].Priority == "C"){
        marker = new AMap.Marker({
          icon: new AMap.Icon({
            image: "/img/GradeC-icon.png",
            size: new AMap.Size(26, 30)
          }),
          extData: { address: json1[i].LocationAddress, name: json1[i].InstitutionName },
          position: position //图标定位
        });
        marker.setMap(map);
        AMap.event.addListener(marker,'click',_onClick);
        type_3.push(marker);
      }
      all_marker.push(marker);

      function _onClick(e) {

      }



      marker.on("click", function (e) {
        //debugger;
        //这里写了一个用来做已经存在于几个路线中的店铺的加入提示信息
        if (e.target.G.extData.name == "长寿大药房") {
          var title2 = '<div style="width:40px;background-color:#0076FF;text-align:center;height:45px;border-radius:5px 0 0 5px;"><img src="img/store-icon.png" style="display:inline-block;height:45px;color:white;position:absolute;left:-2px;"/></div><div style="display:inline-block;width:190px;height:45px;"><span style="position:absolute;top:10px;left:48px;">' + e.target.G.extData.name + '</span></div>', content2 = [];
          $(".warnremind").show();
        }
        else {
          var title2 = '<div style="width:40px;background-color:#0076FF;text-align:center;height:45px;border-radius:5px 0 0 5px;"><img src="img/store-icon.png" style="display:inline-block;height:45px;color:white;position:absolute;left:-2px;"/></div><div style="display:inline-block;width:190px;height:45px;"><span style="position:absolute;top:10px;left:48px;">' + e.target.G.extData.name + '</span></div>', content2 = [];
        }

        var hs = e.target.G.extData;
        var marker_window = new AMap.InfoWindow({
          isCustom: true,
          content:createInfoWindow(title2,content2),
          autoMove: true,
          closeWhenClickMap: true,
          offset: new AMap.Pixel(110, -24)
        });
        marker_window.open(map, e.target.getPosition());
      });
    }
   /* for (var i = 0; i < json2.length; i++) {
      position = new AMap.LngLat(json2[i].InstitutionLng, json2[i].InstitutionLat);
      marker = new AMap.Marker({
        icon: "/img/mendianfeiquanzhong-icon.png",
        size: new AMap.Size(15, 15),
        extData: { address: json2[i].LocationAddress, name: json2[i].InstitutionName },
        position: position //图标定位
      });
      marker.setMap(map);

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

        var title3 = '<div style="width:40px;background-color:#0076FF;text-align:center;height:45px;border-radius:5px 0 0 5px;"><img src="img/store-icon.png" style="display:inline-block;height:45px;color:white;position:absolute;left:-2px;"/></div><div style="display:inline-block;width:190px;height:45px;"><span style="position:absolute;top:10px;left:48px;">' + e.target.G.extData.name + '</span></div>', content3 = [];

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
    }*/

   //新增路线
    $scope.addnewroute = function(){
      $(".addnewroutediv").fadeIn(300);
      $(".lineinfodiv").hide();
      $(".searchstorediv").fadeOut(300);
      $(".nolatlng-storediv").fadeOut(300);

      map.clearMap();
      var data1 = [
        { "InstitutionName": "国药控股大药房永新连锁店", "LocationAddress": "南京路221号", "InstitutionLat": "31.258215", "InstitutionLng": "121.418921" ,"Priority":"A","Linename":"01"},
        { "InstitutionName": "老百姓大药房", "LocationAddress": "上海市静安区成都北路165号", "InstitutionLat": "31.258857", "InstitutionLng": "121.421496","Priority":"B","Linename":"02" },
        { "InstitutionName": "星巴克", "LocationAddress": "人民大道211号222铺", "InstitutionLat": "31.256124", "InstitutionLng": "121.41995","Priority":"B","Linename":"02" },
        { "InstitutionName": "复星黄河大药房", "LocationAddress": "上海市黄浦区凤阳路250号", "InstitutionLat": "31.256307", "InstitutionLng": "121.417591" ,"Priority":"A","Linename":"02"},
        { "InstitutionName": "百姓缘大药房", "LocationAddress": "普陀区凤阳路250号", "InstitutionLat": "31.25981", "InstitutionLng": "121.41875","Priority":"C" ,"Linename":"01"},
        { "InstitutionName": "广善缘大药房", "LocationAddress": "普陀区凤阳路250号", "InstitutionLat": "31.258875", "InstitutionLng": "121.417097" ,"Priority":"B","Linename":""},
        { "InstitutionName": "国大药房", "LocationAddress": "普陀区凤阳路250号", "InstitutionLat": "31.257261", "InstitutionLng": "121.422676","Priority":"B" ,"Linename":"01"},
        { "InstitutionName": "广济大药房", "LocationAddress": "普陀区凤阳路250号", "InstitutionLat": "31.254821", "InstitutionLng": "121.421174","Priority":"B","Linename":"03" },
        { "InstitutionName": "国胜大药房", "LocationAddress": "普陀区凤阳路250号", "InstitutionLat": "31.255427", "InstitutionLng": "121.419994","Priority":"C","Linename":"03" },
        { "InstitutionName": "为民大药房", "LocationAddress": "普陀区凤阳路250号", "InstitutionLat": "31.258105", "InstitutionLng": "121.422912","Priority":"B" ,"Linename":""},
        { "InstitutionName": "同济大药房", "LocationAddress": "普陀区凤阳路250号", "InstitutionLat": "31.257628", "InstitutionLng": "121.417033" ,"Priority":"A","Linename":"03"},
        { "InstitutionName": "益安堂大药房", "LocationAddress": "普陀区凤阳路250号", "InstitutionLat": "31.255078", "InstitutionLng": "121.417484","Priority":"C" ,"Linename":"01"},
        { "InstitutionName": "长寿大药房", "LocationAddress": "普陀区凤阳路250号", "InstitutionLat": "31.258031", "InstitutionLng": "121.418557","Priority":"B" ,"Linename":"03"}
      ];
      var json1 = eval(data1);
      var data2 = [
        { "InstitutionName": "普陀区医院", "LocationAddress": "南京西路216号大光明电影院二楼", "InstitutionLat": "31.258215", "InstitutionLng": "121.418921","Priority":"C","Linename":"02" },
        { "InstitutionName": "老百姓大药房", "LocationAddress": "上海市静安区成都北路165号", "InstitutionLat": "31.258857", "InstitutionLng": "121.421496" ,"Priority":"B","Linename":"02"},
        { "InstitutionName": "星巴克", "LocationAddress": "人民大道211号222铺", "InstitutionLat": "31.256124", "InstitutionLng": "121.41995","Priority":"B","Linename":"02" },
        { "InstitutionName": "复星黄河大药房", "LocationAddress": "上海市黄浦区凤阳路250号", "InstitutionLat": "31.256307", "InstitutionLng": "121.417591","Priority":"A","Linename":"02" }
      ];
      var json2 = eval(data2);
      //加载Marker
      for (var i = 0; i < json1.length; i++) {
        position = new AMap.LngLat(json1[i].InstitutionLng, json1[i].InstitutionLat);
        if(json1[i].Priority == "A"){
          marker = new AMap.Marker({
            icon: new AMap.Icon({
              image: "/img/GradeA-icon.png",
              size: new AMap.Size(26, 30)
            }),
            extData: { address: json1[i].LocationAddress, name: json1[i].InstitutionName },
            position: position //图标定位
          });
          marker.setMap(map);
          AMap.event.addListener(marker,'click',_onClick);
          type_1.push(marker);
        }
        if(json1[i].Priority == "B"){
          marker = new AMap.Marker({
            icon: new AMap.Icon({
              image: "/img/GradeB-icon.png",
              size: new AMap.Size(26, 30)
            }),
            extData: { address: json1[i].LocationAddress, name: json1[i].InstitutionName },
            position: position //图标定位
          });
          marker.setMap(map);
          AMap.event.addListener(marker,'click',_onClick);
          type_2.push(marker);
        }
        if(json1[i].Priority == "C"){
          marker = new AMap.Marker({
            icon: new AMap.Icon({
              image: "/img/GradeC-icon.png",
              size: new AMap.Size(26, 30)
            }),
            extData: { address: json1[i].LocationAddress, name: json1[i].InstitutionName },
            position: position //图标定位
          });
          marker.setMap(map);
          AMap.event.addListener(marker,'click',_onClick);
          type_3.push(marker);
        }
        all_marker.push(marker);

        function _onClick(e) {

        }

        marker.on("click", function (e) {
          //debugger;
          //这里写了一个用来做已经存在于几个路线中的店铺的加入提示信息
          if (e.target.G.extData.name == "长寿大药房") {
            var title2 = '<div style="width:40px;background-color:#4DCC89;text-align:center;height:45px;border-radius:5px 0 0 5px;"><span style="display:inline-block;width:30px;height:45px;color:white;position:absolute;top:5px;left:6px;">加入路线</span></div><div style="display:inline-block;width:190px;height:45px;"><span style="position:absolute;top:10px;left:48px;">' + e.target.G.extData.name + '</span></div>', content2 = [];
            $(".warnremind").show();
          }
          else {
            var title2 = '<div style="width:40px;background-color:#4DCC89;text-align:center;height:45px;border-radius:5px 0 0 5px;"><span style="display:inline-block;width:30px;height:45px;color:white;position:absolute;top:5px;left:6px;">加入路线</span></div><div style="display:inline-block;width:190px;height:45px;"><span style="position:absolute;top:10px;left:48px;">' + e.target.G.extData.name + '</span></div>', content2 = [];
          }

          var hs = e.target.G.extData;
          var marker_window = new AMap.InfoWindow({
            isCustom: true,
            content:createInfoWindow(title2,content2),
            autoMove: true,
            closeWhenClickMap: true,
            offset: new AMap.Pixel(110, -24)
          });
          marker_window.open(map, e.target.getPosition());
        });
      }

    };
    $scope.closeaddroute = function(){
      $(".addnewroutediv").fadeOut(300);
    };


    //此处的items里面的数据是每条路线里的数据
    $scope.items = [
      {name:'国药控股大药房永新连锁店',address:'上海石泉路546号',grade:'A'},
      {name:'吉林大药房卫星路连锁店',address:'上海石泉路546号',grade:'B'},
      {name:'华氏大药房石泉二店',address:'上海石泉路546号',grade:'C'}
    ];

      var selected=$scope.selected;
      //点击路线之后，出现路线的详情弹窗
      $scope.selectLine=function (index) {
        $scope.selected =index;
       /* console.log(index);
        console.log($scope.selected);*/
        $(".lineinfodiv").fadeIn(300);
        $(".addnewroutediv").fadeOut(300);
        $(".searchstorediv").fadeOut(300);
        $(".nolatlng-storediv").fadeOut(300);

        map.clearMap();
        var data1 = [
          { "InstitutionName": "国药控股大药房永新连锁店", "LocationAddress": "南京路221号", "InstitutionLat": "31.258215", "InstitutionLng": "121.418921" ,"Priority":"A","Linename":"01"},
          { "InstitutionName": "老百姓大药房", "LocationAddress": "上海市静安区成都北路165号", "InstitutionLat": "31.258857", "InstitutionLng": "121.421496","Priority":"B","Linename":"02" },
          { "InstitutionName": "星巴克", "LocationAddress": "人民大道211号222铺", "InstitutionLat": "31.256124", "InstitutionLng": "121.41995","Priority":"B","Linename":"02" },
          { "InstitutionName": "复星黄河大药房", "LocationAddress": "上海市黄浦区凤阳路250号", "InstitutionLat": "31.256307", "InstitutionLng": "121.417591" ,"Priority":"A","Linename":"02"},
          { "InstitutionName": "百姓缘大药房", "LocationAddress": "普陀区凤阳路250号", "InstitutionLat": "31.25981", "InstitutionLng": "121.41875","Priority":"C" ,"Linename":"01"},
          { "InstitutionName": "广善缘大药房", "LocationAddress": "普陀区凤阳路250号", "InstitutionLat": "31.258875", "InstitutionLng": "121.417097" ,"Priority":"B","Linename":""},
          { "InstitutionName": "国大药房", "LocationAddress": "普陀区凤阳路250号", "InstitutionLat": "31.257261", "InstitutionLng": "121.422676","Priority":"B" ,"Linename":"01"},
          { "InstitutionName": "广济大药房", "LocationAddress": "普陀区凤阳路250号", "InstitutionLat": "31.254821", "InstitutionLng": "121.421174","Priority":"B","Linename":"03" },
          { "InstitutionName": "国胜大药房", "LocationAddress": "普陀区凤阳路250号", "InstitutionLat": "31.255427", "InstitutionLng": "121.419994","Priority":"C","Linename":"03" },
          { "InstitutionName": "为民大药房", "LocationAddress": "普陀区凤阳路250号", "InstitutionLat": "31.258105", "InstitutionLng": "121.422912","Priority":"B" ,"Linename":""},
          { "InstitutionName": "同济大药房", "LocationAddress": "普陀区凤阳路250号", "InstitutionLat": "31.257628", "InstitutionLng": "121.417033" ,"Priority":"A","Linename":"03"},
          { "InstitutionName": "益安堂大药房", "LocationAddress": "普陀区凤阳路250号", "InstitutionLat": "31.255078", "InstitutionLng": "121.417484","Priority":"C" ,"Linename":"01"},
          { "InstitutionName": "长寿大药房", "LocationAddress": "普陀区凤阳路250号", "InstitutionLat": "31.258031", "InstitutionLng": "121.418557","Priority":"B" ,"Linename":"03"}
        ];
        var json1 = eval(data1);
        var data2 = [
          { "InstitutionName": "普陀区医院", "LocationAddress": "南京西路216号大光明电影院二楼", "InstitutionLat": "31.258215", "InstitutionLng": "121.418921","Priority":"C","Linename":"02" },
          { "InstitutionName": "老百姓大药房", "LocationAddress": "上海市静安区成都北路165号", "InstitutionLat": "31.258857", "InstitutionLng": "121.421496" ,"Priority":"B","Linename":"02"},
          { "InstitutionName": "星巴克", "LocationAddress": "人民大道211号222铺", "InstitutionLat": "31.256124", "InstitutionLng": "121.41995","Priority":"B","Linename":"02" },
          { "InstitutionName": "复星黄河大药房", "LocationAddress": "上海市黄浦区凤阳路250号", "InstitutionLat": "31.256307", "InstitutionLng": "121.417591","Priority":"A","Linename":"02" }
        ];
        var json2 = eval(data2);
        lineArr = [
          [121.418921, 31.258215], [121.421496, 31.258857], [121.41995, 31.256124], [121.417591, 31.256307]
        ];
        //加载Marker
        for (var i = 0; i < json1.length; i++) {
          position = new AMap.LngLat(json1[i].InstitutionLng, json1[i].InstitutionLat);
          if(json1[i].Priority == "A"){
            marker = new AMap.Marker({
              icon: new AMap.Icon({
                image: "/img/GradeA-icon.png",
                size: new AMap.Size(26, 30)
              }),
              extData: { address: json1[i].LocationAddress, name: json1[i].InstitutionName },
              position: position //图标定位
            });
            marker.setMap(map);
            AMap.event.addListener(marker,'click',_onClick);
            type_1.push(marker);
          }
          if(json1[i].Priority == "B"){
            marker = new AMap.Marker({
              icon: new AMap.Icon({
                image: "/img/GradeB-icon.png",
                size: new AMap.Size(26, 30)
              }),
              extData: { address: json1[i].LocationAddress, name: json1[i].InstitutionName },
              position: position //图标定位
            });
            marker.setMap(map);
            AMap.event.addListener(marker,'click',_onClick);
            type_2.push(marker);
          }
          if(json1[i].Priority == "C"){
            marker = new AMap.Marker({
              icon: new AMap.Icon({
                image: "/img/GradeC-icon.png",
                size: new AMap.Size(26, 30)
              }),
              extData: { address: json1[i].LocationAddress, name: json1[i].InstitutionName },
              position: position //图标定位
            });
            marker.setMap(map);
            AMap.event.addListener(marker,'click',_onClick);
            type_3.push(marker);
          }
          all_marker.push(marker);

          marker.on("click", function (e) {

            var title3 = '<div style="width:40px;background-color:#4DCC89;text-align:center;height:45px;border-radius:5px 0 0 5px;"><span style="display:inline-block;width:30px;height:45px;color:white;position:absolute;top:5px;left:6px;">加入路线</span></div><div style="display:inline-block;width:190px;height:45px;"><span style="position:absolute;top:10px;left:48px;">' + e.target.G.extData.name + '</span></div>', content3 = [];

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
           if(json1[i].Priority == "A"){
             marker = new AMap.Marker({
               icon: new AMap.Icon({
                 image: "/img/GradeA-inline-icon.png",
                 size: new AMap.Size(26, 30)
               }),
               extData: { address: json1[i].LocationAddress, name: json1[i].InstitutionName },
               position: position //图标定位
             });
             marker.setMap(map);
             AMap.event.addListener(marker,'click',_onClick);
             type_1.push(marker);
           }
           if(json1[i].Priority == "B"){
             marker = new AMap.Marker({
               icon: new AMap.Icon({
                 image: "/img/GradeB-inline-icon.png",
                 size: new AMap.Size(26, 30)
               }),
               extData: { address: json1[i].LocationAddress, name: json1[i].InstitutionName },
               position: position //图标定位
             });
             marker.setMap(map);
             AMap.event.addListener(marker,'click',_onClick);
             type_2.push(marker);
           }
           if(json1[i].Priority == "C"){
             marker = new AMap.Marker({
               icon: new AMap.Icon({
                 image: "/img/GardeC-inline-icon.png",
                 size: new AMap.Size(26, 30)
               }),
               extData: { address: json1[i].LocationAddress, name: json1[i].InstitutionName },
               position: position //图标定位
             });
             marker.setMap(map);
             AMap.event.addListener(marker,'click',_onClick);
             type_3.push(marker);
           }
           all_marker.push(marker);
           marker.setLabel({
             offset:new AMap.Pixel(6,3),
             content:parseInt( i+1 )
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

                var title3 = '<div style="width:40px;background-color:#0076FF;text-align:center;height:45px;border-radius:5px 0 0 5px;"><img src="img/store-icon.png" style="display:inline-block;height:45px;color:white;position:absolute;left:-2px;"/></div><div style="display:inline-block;width:190px;height:45px;"><span style="position:absolute;top:10px;left:48px;">' + e.target.G.extData.name + '</span></div>', content3 = [];

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
    $scope.data = {showDelete:false};
    $scope.moveItem = function(item,fromIndex,toIndex){
      $scope.items.splice(fromIndex, 1);
      $scope.items.splice(toIndex, 0, item);
    };
    $scope.onItemDelete = function(item) {
      $scope.items.splice($scope.items.indexOf(item), 1);
    };

    $("#editlinebtn").click(function(){
      $(".editlinediv").hide();
      $("._editlinediv").show();
    });

    //编辑路线之后保存
    $scope.saveeditlineinfo = function(){
      alert(1);
    };

    //删除路线
    $scope.deleteline = function(){
    /* var confirmPopup = $ionicPopup.confirm({
       title:'',
       template:'确认删除路线?'
     });
     confirmPopup.then(function(res){
       if(res){
         console.log("1");
       }else{
         console.log("0");
       }
     });*/

    //用了自定义弹窗
      var warnPopup = $ionicPopup.show({
        template:'',
        title:'确认删除路线?',
        scope:$scope,
        buttons:[
          {text:'取消'},
          {
            text:'删除',
            type:'button-assertive',
            onTap:function(e){
              alert(1);
            }
          }
        ]
      })
    };


    /////////////这些是打开/关闭一些弹窗的函数////////////
    $scope.closeeditdiv = function(){
      $("._editlinediv").fadeOut(300);
      $(".editlinediv").show();
    };
    $scope.searchstore = function(){
       $(".searchstorediv").fadeIn(300);
      $(".lineinfodiv").fadeIn(300);
      $(".addnewroutediv").fadeOut(300);
      $(".nolatlng-storediv").fadeOut(300);
    };
    $scope.search_nopositionstore = function(){
      $(".nolatlng-storediv").fadeIn(300);
      $(".lineinfodiv").fadeIn(300);
      $(".addnewroutediv").fadeOut(300);
      $(".searchstorediv").fadeOut(300);
      routesettingsrv.nocoordinatestoreinfo().then(function(info){
        console.log(info);
      })


      routesettingsrv.nocoordinatestoreinfo().then(function (data) {
        console.log(data);
      });


    };
    $scope.close_nolatlngstorediv = function(){
      $(".nolatlng-storediv").fadeOut(300);
    };
    $scope.closesearchstorediv = function(){
      $(".searchstorediv").fadeOut(300);
    };
    //////////////////////////////////////////////////////////

  });
