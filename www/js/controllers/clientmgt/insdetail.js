angular.module('insdetail.ctrl', ['client.srv'])
  .controller('InsDetailCtrl', function ($scope, $ionicBackdrop, $ionicModal,$stateParams,clientsrv) {
    $scope.terminalList = [];
    //门店人员
    $scope.memberList = [];
    //是否显示终端信息
    $scope.showstore=false;
    //初始化
    clientsrv.getcurrentstaff().then(function (staff) {
      //当前人员的信息
      $scope.staff = staff;
      $scope.showstore =!(staff.Roles.indexOf('CCR_REP')!=-1);
      //根据传来的insId获取机构信息
      clientsrv.getins($stateParams.insid).then(function (data) {
        $scope.currentIns = data;
         //获取该机构下的人员
        clientsrv.getclients($stateParams.insid).then(function (clients) {
          $scope.memberList = clients;

        });
      });
    });
    //新增客户窗体
    $ionicModal.fromTemplateUrl('templates/modal/createclient.html', {
      scope: $scope,
      animation: 'slide-in-up',
      hardwareBackButtonClose: false
    }).then(function (modal) {
      $scope.addClientModal = modal;
    });
    //查看、编辑客户信息窗体
    $ionicModal.fromTemplateUrl('templates/modal/clientinfo.html', {
      scope: $scope,
      animation: 'slide-in-up',
      hardwareBackButtonClose: false
    }).then(function (modal) {
      $scope.clientInfoModal = modal;
    });
    //打开新增客户窗体
    $scope.addClient = function () {
      $scope.addClientModal.show();
    };
    //查看客户信息（查看、编辑）
    $scope.viewClient =function(){
      $scope.clientInfoModal.show();
    };


    $scope.client={
      Gender:'',
      Status:'ACTIVE'
    };
    $scope.Genders=[{Code:'M',Name:'男',Class:'male'},{Code:'F',Name:'女',Class:'female'}];
    $scope.Status=[{Code:'ACTIVE',Name:'解除冻结'},{Code:'INACTIVE',Name:'冻结客户'}];
    //头像class
    $scope.avatarClass ="";
    //计算头像class
    $scope.getAvatarClass = function (client) {
      var className ="";
      if(client.Gender==""){
        className ="client-gender";
      }
      else if(client.Gender=="M"){
        className =client.Status=="INACTIVE"?"client-gender-malelocked":"client-gender-male";
      }
      else if(client.Gender=="F"){
        className =client.Status=="INACTIVE"?"client-gender-femalelocked":"client-gender-female";
      }
      return className;
    };
    $scope.$watch("client.Gender + client.Status",function(newValue,oldValue, scope){{
      $scope.avatarClass = $scope.getAvatarClass($scope.client);

    }});
    //选择性别
    $scope.changeGender=function (gender) {
      $scope.client.Gender=gender.Code;
    }
    //冻结客户
    $scope.lockClient =function(status){
      $scope.client.Status=status.Code;
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
