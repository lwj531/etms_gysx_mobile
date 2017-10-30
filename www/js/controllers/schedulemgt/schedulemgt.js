angular.module('schedulemgt.ctrl', ['routesetting.srv', 'daily.srv'])
  .controller('ScheduleMgtCtrl', function ($scope, $rootScope, $ionicPopup, routesettingsrv, dailysrv) {

    //切角色
    $scope.CCR = true;
    $scope.AE = !$scope.CCR;

    //日程管理初始化tab 打开日视图  (dayView | weekView)
    $scope.viewActive = 'weekView';
    //日视图里切列表和地图 dayInfoTab：(list | map )
    $scope.dayInfoTab = 'list';
    //周视图内的实际和计划tab初始化 (actual | plan)
    $scope.statusTab = 'plan';

    //初始化半天事务框不显示
    $scope.halfAffair = false;
    //遮罩不显示
    $scope.showMask = false;
    //进度条百分比
    $scope.progressNum = 40 + '%';
    $scope.progress = {"width": $scope.progressNum};

    //当前日期
    $scope.currentDate = new Date();
    //今天本周的第几天
    $scope.nowDayOfWeek =$scope.currentDate.getDay() == 0 ? 6 : ($scope.currentDate.getDay() - 1);//今天本周的第几天
    //当前周的开始日期
    $scope.weekSatrtDate = new Date($scope.currentDate.getFullYear(), $scope.currentDate.getMonth(), $scope.currentDate.getDate() - $scope.nowDayOfWeek);
    //当前周的结束日期
    $scope.weekEndDate = new Date($scope.currentDate.getFullYear(), $scope.currentDate.getMonth(), $scope.currentDate.getDate() + (6 - $scope.nowDayOfWeek));
    /*//获取周日期数组
    $scope.weekDays =[];
    $scope.getWeekDays = function () {
      $scope.weekDays = [];
      var dateDiff = parseInt(Math.abs($scope.weekSatrtDate-$scope.weekEndDate)  /  1000  /  60  /  60  /24);//日期差天数
      for(var i=0;i<dateDiff;i++){
        $scope.weekDays.push($scope.weekSatrtDate.setDate($scope.weekSatrtDate.getDate()+ i));
      };
    };
    $scope.getWeekDays();*/
    //下一周
    $scope.nextWeek = function(){
      $scope.currentDate.setDate($scope.currentDate.getDate()+ 7);
      $scope.weekSatrtDate = new Date($scope.currentDate.getFullYear(), $scope.currentDate.getMonth(), $scope.currentDate.getDate() - $scope.nowDayOfWeek);
      $scope.weekEndDate = new Date($scope.currentDate.getFullYear(), $scope.currentDate.getMonth(), $scope.currentDate.getDate() + (6 - $scope.nowDayOfWeek));
    };
    //上一周
    $scope.prevWeek = function(){
       $scope.currentDate.setDate($scope.currentDate.getDate()- 7);
      $scope.weekSatrtDate = new Date($scope.currentDate.getFullYear(), $scope.currentDate.getMonth(), $scope.currentDate.getDate() - $scope.nowDayOfWeek);
      $scope.weekEndDate = new Date($scope.currentDate.getFullYear(), $scope.currentDate.getMonth(), $scope.currentDate.getDate() + (6 - $scope.nowDayOfWeek));
    };


    //改计划实际tab
    $scope.changePA = function (pa) {
      $scope.statusTab = pa;
    }

    //初始化半天事务tab
    $scope.footerTab = 'route';
    //半天事务和路线图tab
    $scope.changeFooterTab = function (tabTitle) {
      $scope.footerTab = tabTitle;
      console.log(tabTitle);
    };
    //点半天事务弹出底部框
    $scope.showHalfFooter = function (tabTitle) {
      $scope.getRoutes(function () {
        $scope.showMask = true;
        $scope.footerTab = tabTitle;
        $scope.halfAffair = true;
      });
    };
    //编辑页面中返回,如果状态是reload,关闭footer
    $rootScope.$on('closeFooter', function () {
      $scope.cancelPlanFooter();
    });

    //选中路线
    $scope.selectRoute = function (route) {
      $scope.currentRoute = route;
    };
    //保存计划路线
    $scope.savePlan = function () {
      if ($scope.currentRoute == null) {
        $rootScope.toast("请选择路线");
      } else {
        //获取路线明细
        routesettingsrv.getroutedetail($scope.currentRoute.LineID).then(function (data) {
          $scope.currentRoute = data;
          if ($scope.currentRoute.Institutions.length <= 0) {
            $rootScope.toast("请选择机构");
          } else {
            dailysrv.savePlan($scope.currentRoute).then(function (state) {
              if (state) {
                $rootScope.toast("保存成功", function () {
                  $scope.cancelPlanFooter();
                });
              } else {
                $rootScope.toast("保存失败");
              }
            });
          }
        });
      }
    };
    //点取消关闭底部计划框
    $scope.cancelPlanFooter = function (callback) {
      $scope.halfAffair = false;
      $scope.showMask = false;
      if (callback != null) {
        callback();
      }
    };
    //获取周计划


    //checkbox的选中事件
    $scope.toggleSelected = function (item) {
      item.selected = !item.selected;
    };
    $scope.childListShow = false;
    //获取线路
    $scope.getRoutes = function (callback) {
      routesettingsrv.getroutes().then(function (data) {
        $scope.planStoreList = data;
        if (callback != null) {
          callback();
        }
      });
    };
    //计划窗体
    $scope.showPlanHalf = {
      cssClass: 'plan-alert',
      templateUrl: 'templates/schedulemgt/planalert.html',
      title: '',
      scope: $scope,
      close: function () {
        $scope.showPlanHalf.close();
      }
    };
    //关闭计划窗体
    $scope.closePlanList = function () {
      showPlanHalf.close();
    };
    //点击连锁总部列表，切至计划项
    $scope.slideToChild = function () {
      $scope.childListShow = true;
    };
    //点击连返回，回到parent list
    $scope.backToParent = function () {
      $scope.childListShow = false;
    };

    //CCR计划弹框
    $scope.showPlanPopup = function () {
      $scope.getRoutes(function () {
        $ionicPopup.show($scope.showPlanHalf);
      });
    };

    //CCR实际弹框
    $scope.showActualCCR = function () {

      $scope.actualStoreList = [
        {name: 'xx大药房xx大药房xx大药房xx大', address: 'xx区xx路xx号xx弄', city: '北京市', activities: 2, selected: false},
        {name: 'xx大药房xx大药房xx大药房xx大药房xx大药房xx大药房', address: 'xx区xx路xx号xx弄', city: '上海市', activities: 3, selected: false}
      ];
      var showActual = $ionicPopup.show({
        cssClass: 'actual-alert',
        templateUrl: 'templates/schedulemgt/actualAlertCCR.html',
        title: '',
        scope: $scope

      });
      showActual.then(function (res) {
        console.log('Tapped Actual!', res);
      });

      $scope.closeActualCCR = function () {
        showActual.close();
      };
    };
    //AE实际弹框
    $scope.showActualAE = function () {

      $scope.actualStoreList = [
        {name: 'xx大药房xx大药房xx大药房xx大', address: 'xx区xx路xx号xx弄', city: '北京市', activities: 2, selected: false},
        {name: 'xx大药房xx大药房xx大药房xx大药房xx大药房xx大药房', address: 'xx区xx路xx号xx弄', city: '上海市', activities: 3, selected: false}
      ];
      var showActual = $ionicPopup.show({
        cssClass: 'actual-alert',
        templateUrl: 'templates/schedulemgt/actualAlertAE.html',
        title: '',
        scope: $scope

      });
      showActual.then(function (res) {
        console.log('Tapped Actual!', res);
      });

      $scope.closeActualAE = function () {
        showActual.close();
      };
    };


    //日历的angular写法--------------/
    $scope.week = [];
    $scope.weekChange = [];
    $scope.today = new Date();
    $scope.changeDay = new Date();
    $scope.weekStartDay = new Date($scope.changeDay.setDate($scope.today.getDate() - $scope.today.getDay()));
    $scope.weekEndDay = new Date($scope.changeDay.setDate($scope.today.getDate() + 7 - $scope.today.getDay()));

    for (var i = 0; i < 7; i++) {
      $scope.week.push(i == 0 ? new Date($scope.weekStartDay.setDate($scope.weekStartDay.getDate() + 0)) : new Date($scope.weekStartDay.setDate($scope.weekStartDay.getDate() + 1)));
      $scope.weekChange[i] = $scope.week[i];
    }

    $scope.NextWeek = function () {
      for (var n = 0; n < 7; n++) {
        //week会改变，值赋给weekChange，不能只用一个数组
        $scope.weekChange[n] = new Date($scope.week[n].setDate($scope.week[n].getDate() + 7));
      }
    };
    $scope.PrevWeek = function () {
      for (var m = 0; m < 7; m++) {
        //week会改变，值赋给weekChange，不能只用一个数组
        $scope.weekChange[m] = new Date($scope.week[m].setDate($scope.week[m].getDate() - 7));
      }
    };
    //点击日期时触发
    $scope.clickDate = function (date) {
      console.log(date);
    }

  });
