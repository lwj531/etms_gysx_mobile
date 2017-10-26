angular.module('insdetail.ctrl', ['client.srv'])
  .controller('InsDetailCtrl', function ($scope, $ionicBackdrop,$ionicPopup, $ionicModal, $stateParams, $rootScope, clientsrv, $timeout) {
    //tabs
    $scope.tabs=[{Name:'基本信息',Code:'baseInfo'},{Name:'人员信息',Code:'personInfo'},{Name:'终端信息',Code:'clientInfo'}];
    $scope.currentTab =$scope.tabs[0];
    //切换tab
    $scope.switchTab = function(tab){
      $scope.currentTab =tab;
      if($scope.currentTab.Code=='clientInfo'){
        //搜索下游门店
        $scope.getStores();
      }
    }
    //门店人员
    $scope.memberList = [];
    //是否显示终端信息
    $scope.showstore = false;
    //获取机构下的人员
    $scope.getclients = function () {
      //获取该机构下的人员
      clientsrv.getclients($scope.currentIns.InstitutionID).then(function (clients) {
        $scope.memberList = clients;
      });
    };
    //初始化
    clientsrv.getcurrentstaff().then(function (staff) {
      //当前人员的信息
      $scope.staff = staff;
      $scope.showstore = !(staff.Roles.indexOf('CCR_REP') != -1);
      //根据传来的insId获取机构信息
      clientsrv.getins($stateParams.insId).then(function (data) {
        $scope.currentIns = data;
        //机构左侧图标
        switch ($scope.currentIns.InstitutionPriority){
          case "A":
            $scope.inslevelflag = "uicon-blankmarkerA";
            break;
          case "B":
            $scope.inslevelflag = "uicon-blankmarkerB";
            break;
          case "C":
            $scope.inslevelflag = "uicon-blankmarkerC";
            break;
          default:
            $scope.inslevelflag = "uicon-blankmarkerA";
        }
        //通知地图数据已获取
        $scope.$broadcast("amap", "datacompleted");
        $scope.getclients();
      });
    });
    //地图初始化之后
    $scope.$on('amap', function (errorType, data) {
      if (data == "mapcompleted") {
        $scope.map.clearMap();
        $scope.map.clearInfoWindow();
        $scope.map.plugin('AMap.Geolocation', function () {
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
            zoomToAccuracy:true      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
          });
          $scope.map.addControl($scope.geolocation);
          $scope.geolocation.getCurrentPosition();
          AMap.event.addListener($scope.geolocation, 'complete', $scope.getlocationComplete);//返回定位信息
          AMap.event.addListener($scope.geolocation, 'error', $scope.getlocationError);      //返回定位出错信息
        });

      }
    });
    //获取定位坐标成功
    $scope.getlocationComplete = function (data) {
      $scope.lnglat = [data.position.getLng(), data.position.getLat()];
      $scope.setInsMarker();
    };
    //获取定位坐标失败
    $scope.getlocationError = function () {
      $scope.lnglat = [];
      $rootScope.toast("获取坐标失败，请重新定位。");
      $scope.setInsMarker();
    };
    //修改坐标
    $scope.saveLngLat = function () {
      if($scope.lnglat.length>1){
        $scope.map.setCenter($scope.lnglat);
        $timeout(function(){
          $ionicPopup.confirm({
            title: '提示',
            template: '是否确认修改坐标到当前位置'
          }).then(function (res) {
            if (res) {
              var model ={
                InstitutionLat:$scope.lnglat[1],
                InstitutionLng:$scope.lnglat[0]
              }
              clientsrv.updateInsLngLat($scope.currentIns.InstitutionID,model).then(function (status) {
                if (status) {
                  $rootScope.toast("操作成功");
                  $scope.currentIns.lnglat= $scope.lnglat;
                  $scope.map.clearMap();
                  $scope.insMarker.setPosition($scope.lnglat);
                  $scope.insMarker.setMap($scope.map);
                } else {
                  $rootScope.toast("操作失败");
                }
              });
            }else{
              $scope.map.setCenter($scope.currentIns.lnglat);
            }
          });
        },500);
      }else{
        $rootScope.toast("获取坐标失败，请重新定位。");
      }

    }
    //定位至当前机构的坐标
    $scope.setInsMarker = function () {
      if($scope.insMarker==null){
        $scope.insMarker = new AMap.Marker({
          icon: $scope.currentIns.InstitutionPriority=="A"?"img/GradeA-icon.png":($scope.currentIns.InstitutionPriority=="B"?"img/GradeB-icon.png":"img/GradeC-icon.png"),
          position: $scope.currentIns.lnglat
        });
        $scope.insMarker.setMap($scope.map);
        $scope.map.setCenter($scope.currentIns.lnglat);
      }
    }
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
      $scope.client = {
        Gender: '',
        Status: 'ACTIVE'
      };
      $scope.addClientModal.show();
    };
    //关闭新增modal
    $scope.closeAddClientModal = function () {
      $scope.getclients();
      $scope.addClientModal.hide();
    }
    //查看客户信息（查看、编辑）
    $scope.viewClient = function (client) {
      //信息编辑状态
      $scope.infoedit = false;
      $scope.clientInfoModal.show();
      $scope.client = client;
    };
    //点击编辑用户信息
    $scope.clickinfoedit=function () {
      $scope.infoedit = true;
    };
    //关闭查看客户信息窗体
    $scope.closeClientInfoModal = function () {
      $scope.getclients();
      $scope.clientInfoModal.hide();
    };

    $scope.client = {
      Gender: '',
      StatusEnum: 0
    };
    //性别选项
    $scope.Genders = [{Code: 'M', Name: '男', Class: 'male'}, {Code: 'F', Name: '女', Class: 'female'}];
    $scope.Status = [{Code: 0, Name: '解除冻结'}, {Code: 1, Name: '冻结客户'}];
    //头像class
    $scope.avatarClass = "";
    //计算头像class
    $scope.getAvatarClass = function (client) {
      var className = "";
      if (client.Gender == "") {
        className = "client-gender";
      }
      else if (client.Gender == "M") {
        className = client.StatusEnum == 1 ? "client-gender-malelocked" : "client-gender-male";
      }
      else if (client.Gender == "F") {
        className = client.StatusEnum == 1 ? "client-gender-femalelocked" : "client-gender-female";
      }
      return className;
    };
    $scope.$watch("client.Gender + client.StatusEnum", function (newValue, oldValue, scope) {
      {
        $scope.avatarClass = $scope.getAvatarClass($scope.client);
      }
    });
    //选择性别
    $scope.changeGender = function (gender) {
      $scope.client.Gender = gender.Code;
    }
    //冻结客户
    $scope.lockClient = function (status) {
      $scope.client.StatusEnum = status.Code;
    };
    //保存新增客户
    $scope.saveCreateClient = function () {
      if ($scope.client.Gender == "") {
        $rootScope.toast("请选择性别");
      } else if ($scope.client.ClientName == "" || $scope.client.ClientName == null) {
        $rootScope.toast("请输入姓名");
      } else {
        $scope.client.Institution = $scope.currentIns;
        clientsrv.saveclient($scope.client).then(function (status) {
          if (status) {
            $rootScope.popup("操作成功", function () {
              $scope.closeAddClientModal();
            });
          } else {
            $rootScope.popup("操作失败");
          }
        });
      }
    };
    //保存更新客户
    $scope.saveClient = function () {
      if ($scope.client.Gender == "") {
        $rootScope.toast("请选择性别");
      } else if ($scope.client.ClientName == "" || $scope.client.ClientName == null) {
        $rootScope.toast("请输入姓名");
      } else {
        $scope.client.Institution = $scope.currentIns;
        clientsrv.saveclient($scope.client).then(function (status) {
          if (status) {
            $rootScope.popup("操作成功", function () {
              $scope.closeClientInfoModal();
            });
          } else {
            $rootScope.popup("操作失败");
          }
        });
      }
    };
    //获取连锁门店列表
    $scope.stores ={
      Page:1,
      RemainingCount:0,
      TotalCount:0,
      Institutions:[]
    };
    //搜索参数
    $scope.storePara ={
      InstitutionID:$stateParams.insId,
      Key:"",
      Page:1
    };
    $scope.getStores = function(){
      clientsrv.getStores($scope.storePara).then(function (data) {
        $scope.stores = data;
      });
    };



    /* $scope.showPopup = function () {
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
         map.plugin('AMap.Geolocation', function () {
           geolocation = new AMap.Geolocation({
             enableHighAccuracy: true,//是否使用高精度定位，默认:true
             timeout: 10000,          //超过10秒后停止定位，默认：无穷大
             buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
             zoomToAccuracy: true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
             buttonPosition: 'RB'
           });
           map.addControl(geolocation);
           geolocation.getCurrentPosition();
           AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
           AMap.event.addListener(geolocation, 'error', onError);      //返回定位出错信息
         });

         //解析定位结果
         function onComplete(data) {
           var str = ['定位成功'];
           str.push('经度：' + data.position.getLng());
           str.push('纬度：' + data.position.getLat());
           if (data.accuracy) {
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
     };*/
  });
