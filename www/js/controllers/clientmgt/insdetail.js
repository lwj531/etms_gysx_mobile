angular.module('insdetail.ctrl', ['routesetting.srv'])
  .controller('InsDetailCtrl', function ($scope, $ionicBackdrop, $ionicPopup,$stateParams,routesettingsrv) {
    $scope.terminalList = [];
    $scope.memberList = [];
    console.log($stateParams.insId);



    for (var i = 0; i < 20; i++) {
      $scope.terminalList.push({name: 'xxxxxxxxxxxxxx大药房', icon: 'A', address: 'xx路xx街12号'}, {
        name: 'xxxxxxx大药房',
        icon: 'B',
        address: 'xxxxx路xxx街12号'
      }, {name: 'xxxxxxxxxxxxx大药房', icon: 'C', address: 'xx路xx街12号'});
      $scope.memberList.push({name: '王思聪', gender: 'm', job: '职务', tel: '13234940596', lock: true}, {
        name: '王思聪',
        gender: 'm',
        job: '职务',
        tel: '13234940596',
        lock: false
      }, {name: '王思聪', gender: 'f', job: '职务', tel: '13234940596', lock: false}, {
        name: '王思聪',
        gender: 'f',
        job: '职务',
        tel: '13234940596',
        lock: true
      });
    }

    $scope.showPopup = function () {
      var coordinatePopup = $ionicPopup.show({
        cssClass: 'coordinate-alert',
        templateUrl: 'templates/clientmgt/changecoordinate.html',
        title: '修改坐标',
        scope: $scope,
        buttons: [
          {
            text: '<b>取消</b>',
            type: 'button-clear button-positive title-button-left',
            onTap: function (e) {
              //不允许用户关闭
              //e.preventDefault();
            }
          },
          {
            text: '<b>确定</b>',
            type: 'button-clear button-positive title-button-right',
            onTap: function (e) {
              //不允许用户关闭
              //e.preventDefault();
            }
          }
        ]
      });

      //解析定位错误信息
      function onError(data) {
        console.log(str);
      }

      coordinatePopup.then(function (res) {
        var map, geolocation;
        //加载地图，调用浏览器定位服务
        map = new AMap.Map('coordinate-map', {
          resizeEnable: true
        });
        map.plugin('AMap.Geolocation', function() {
          geolocation = new AMap.Geolocation({
            enableHighAccuracy: true,//是否使用高精度定位，默认:true
            timeout: 10000,          //超过10秒后停止定位，默认：无穷大
            buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            zoomToAccuracy: true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            buttonPosition:'RB'
          });
          map.addControl(geolocation);
          geolocation.getCurrentPosition();
          AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
          AMap.event.addListener(geolocation, 'error', onError);      //返回定位出错信息
        });
        //解析定位结果
        function onComplete(data) {
          var str=['定位成功'];
          str.push('经度：' + data.position.getLng());
          str.push('纬度：' + data.position.getLat());
          if(data.accuracy){
            str.push('精度：' + data.accuracy + ' 米');
          }//如为IP精确定位结果则没有精度信息
          str.push('是否经过偏移：' + (data.isConverted ? '是' : '否'));
          console.log(str);
        }
        console.log('Tapped!', res);
      });
      // $timeout(function() {
      //   myPopup.close(); //close the popup after 3 seconds for some reason
      // }, 3000);
    };
  });
