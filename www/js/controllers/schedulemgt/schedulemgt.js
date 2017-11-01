angular.module('schedulemgt.ctrl', ['routesetting.srv', 'daily.srv', 'angularMoment'])
  .controller('ScheduleMgtCtrl', function ($scope, $rootScope, $ionicPopup, routesettingsrv, dailysrv, amMoment) {

    //切角色
    $scope.CCR = true;
    $scope.AE = !$scope.CCR;

    //日程管理初始化tab 打开日视图  (dayView | weekView)
    $scope.viewActive = 'weekView';
    //日视图里切列表和地图 dayInfoTab：(list | map )
    $scope.dayInfoTab = 'list';
    //周视图内的实际和计划tab初始化 (actual | plan)
    $scope.statusTab = 'actual';

    //初始化计划半天事务框不显示
    $scope.halfAffair = false;
    //初始化实际半天事务框不显示
    $scope.actualHalf = false;
    //遮罩不显示
    $scope.showMask = false;
    //进度条百分比
    $scope.progressNum = 40 + '%';
    $scope.progress = {"width": $scope.progressNum};

    //当前日期
    $scope.currentDate = new Date();
    //今天本周的第几天
    $scope.nowDayOfWeek = $scope.currentDate.getDay() == 0 ? 6 : ($scope.currentDate.getDay() - 1);//今天本周的第几天
    //当前周的开始日期
    $scope.weekSatrtDate = new Date($scope.currentDate.getFullYear(), $scope.currentDate.getMonth(), $scope.currentDate.getDate() - $scope.nowDayOfWeek);
    //当前周的结束日期
    $scope.weekEndDate = new Date($scope.currentDate.getFullYear(), $scope.currentDate.getMonth(), $scope.currentDate.getDate() + (6 - $scope.nowDayOfWeek));

    //获取一周已填写的计划
    $scope.getWeekPlanList = function (callback) {
      dailysrv.getWeekPlanList(moment($scope.weekSatrtDate).format("YYYY-MM-DD"), moment($scope.weekEndDate).format("YYYY-MM-DD")).then(function (palnlist) {
        $scope.weekPlanList = palnlist;
        console.log(palnlist);
        if (callback != null) {
          callback();
        }
      });
    };

    //当前周的开始日期实际用
    $scope.actualSatrtDate = new Date($scope.currentDate.getFullYear(), $scope.currentDate.getMonth(), $scope.currentDate.getDate() - $scope.nowDayOfWeek);
    //当前周的结束日期实际用
    $scope.actualEndDate = new Date($scope.currentDate.getFullYear(), $scope.currentDate.getMonth(), $scope.currentDate.getDate() + (6 - $scope.nowDayOfWeek));

    //获取一周实际
    $scope.getWeekActualList = function (callback) {
      dailysrv.getWeekActualList(moment($scope.actualSatrtDate).format("YYYY-MM-DD"), moment($scope.actualEndDate).format("YYYY-MM-DD")).then(function (actuallist) {
        $scope.weekActualList = actuallist;
        console.log(actuallist);
        if (callback != null) {
          callback();
        }
      });
    };
    $scope.getWeekActualList();

    //获取本周的日期数组
    $scope.$watch("weekSatrtDate", function (newValue, oldValue, scope) {
      {
        $scope.weekDays = [];
        $scope.actualWeekDays = [];
        //获取一周计划
        var dateDiff = parseInt(Math.abs($scope.weekSatrtDate - $scope.weekEndDate) / 1000 / 60 / 60 / 24);//日期差天数
        for (var i = 0; i <= dateDiff; i++) {
          $scope.weekDays.push(moment($scope.weekSatrtDate).add(i, 'days'));
          $scope.actualWeekDays.push(moment($scope.weekSatrtDate).add(i, 'days'));
          if (i == dateDiff) {
            $scope.getWeekPlanList(function () {
              for (var j = 0; j < $scope.weekDays.length; j++) {
                for (var k = 0; k < $scope.weekPlanList.PlanRoutelines.length; k++) {
                  if (moment($scope.weekDays[j]).format("YYYY-MM-DD") == moment($scope.weekPlanList.PlanRoutelines[k].ActivityDate).format("YYYY-MM-DD")) {
                    $scope.weekDays[j].route = $scope.weekPlanList.PlanRoutelines[k];
                  }
                }
              }
            });
            $scope.getWeekActualList(function () {
              $scope.checkinTimes = [];
              $scope.checkoutTimes = [];
              for (var j = 0; j < $scope.actualWeekDays.length; j++) {
                for (var k = 0; k < $scope.weekActualList.PlanRoutelines.length; k++) {
                  if (moment($scope.actualWeekDays[j]).format("YYYY-MM-DD") == moment($scope.weekActualList.PlanRoutelines[k].ActivityDate).format("YYYY-MM-DD")) {
                    $scope.actualWeekDays[j].route = $scope.weekActualList.PlanRoutelines[k];
                  }
                }

                for (var l = 0; l < $scope.weekActualList.Checkins.length; l++) {
                  if (moment($scope.actualWeekDays[j]).format("YYYY-MM-DD") == moment($scope.weekActualList.PlanRoutelines[k].ActivityDate).format("YYYY-MM-DD")) {
                    $scope.actualWeekDays[j].CheckinTimes = $scope.weekActualList.Checkins[l];
                    if ($scope.weekActualList.Checkins[l].InOut == 'In') {
                      $scope.checkinTimes.push($scope.weekActualList.Checkins[l].CheckinTime);
                    }
                    else if ($scope.weekActualList.Checkins[l].InOut == 'Out') {
                      $scope.checkoutTimes.push($scope.weekActualList.Checkins[l].CheckinTime);
                    }
                    else {
                      alert('不是In Out');
                    }
                  }
                }

              }
            });


          }
        }

      }
    });
    //下一周
    $scope.nextWeek = function () {
      $scope.currentDate.setDate($scope.currentDate.getDate() + 7);
      $scope.weekSatrtDate = new Date($scope.currentDate.getFullYear(), $scope.currentDate.getMonth(), $scope.currentDate.getDate() - $scope.nowDayOfWeek);
      $scope.weekEndDate = new Date($scope.currentDate.getFullYear(), $scope.currentDate.getMonth(), $scope.currentDate.getDate() + (6 - $scope.nowDayOfWeek));
    };
    //上一周
    $scope.prevWeek = function () {
      $scope.currentDate.setDate($scope.currentDate.getDate() - 7);
      $scope.weekSatrtDate = new Date($scope.currentDate.getFullYear(), $scope.currentDate.getMonth(), $scope.currentDate.getDate() - $scope.nowDayOfWeek);
      $scope.weekEndDate = new Date($scope.currentDate.getFullYear(), $scope.currentDate.getMonth(), $scope.currentDate.getDate() + (6 - $scope.nowDayOfWeek));
    };

    //改计划实际tab
    $scope.changePA = function (pa) {
      $scope.statusTab = pa;
    };

    //初始化半天事务tab
    $scope.footerTab = 'route';
    //半天事务和路线图tab
    $scope.changeFooterTab = function (tabTitle) {
      $scope.footerTab = tabTitle;
      console.log(tabTitle);
    };
    //计划点半天事务弹出底部框
    $scope.showHalfFooter = function (tabTitle, date) {
      $scope.getRoutes(function () {
        $scope.selectedDate = date;//选中的日期
        //console.log($scope.selectedDate);
        console.log(date);
        $scope.showMask = true;
        $scope.footerTab = tabTitle;
        $scope.halfAffair = true;
      });
    };
    //实际点半天事务弹出底部框
    $scope.showActualHalfFooter = function (tabTitle, date) {
      $scope.getRoutes(function () {
        $scope.selectedDate = date;//选中的日期
        //console.log($scope.selectedDate);
        console.log(date);
        $scope.showMask = true;
        $scope.footerTab = tabTitle;
        $scope.actualHalf = true;
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
            $scope.currentRoute.ActivityDate = $scope.selectedDate.format("YYYY-MM-DD");
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
    //实际点取消关闭底部计划框
    $scope.cancelActualFooter = function (callback) {
      $scope.actualHalf = false;
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
