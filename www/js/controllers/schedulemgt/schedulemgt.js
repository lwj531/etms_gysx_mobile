angular.module('schedulemgt.ctrl', ['routesetting.srv', 'daily.srv', 'angularMoment'])
  .controller('ScheduleMgtCtrl', function ($scope, $rootScope, $ionicPopup, routesettingsrv, dailysrv, amMoment) {

    //切角色
    $scope.CCR = false;
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

    //默认当前选中的日期
    $scope.selectedDate = moment();
    //当前周的开始日期
    $scope.weekSatrtDate = moment().weekday(0);
    //当前周的结束日期
    $scope.weekEndDate = moment().weekday(6)
    //获取一周已填写的计划
    $scope.getWeekPlanList = function (callback) {
      dailysrv.getWeekPlanList($scope.weekSatrtDate.format("YYYY-MM-DD"), $scope.weekEndDate.format("YYYY-MM-DD")).then(function (palnlist) {
        $scope.weekPlanList = palnlist;
        if (callback != null) {
          callback();
        }
      });
    };
    //绑定已填写计划与本周数组的关系
    $scope.bindPlanList = function () {
      $scope.getWeekPlanList(function () {
        for (var j = 0; j < $scope.weekDays.length; j++) {
          //赋值路线
          for (var k = 0; k < $scope.weekPlanList.PlanRoutelines.length; k++) {
            if (moment($scope.weekDays[j]).date() == moment($scope.weekPlanList.PlanRoutelines[k].ActivityDate).date()) {
              $scope.weekDays[j].route = $scope.weekPlanList.PlanRoutelines[k];
            }
          }
          //赋值半天事务
          for (var k = 0; k < $scope.weekPlanList.HalfdayModels.length; k++) {
            //上午半天事务
            if (moment($scope.weekDays[j]).date()== moment($scope.weekPlanList.HalfdayModels[k].ActivityDate).date() && $scope.weekPlanList.HalfdayModels[k].AMPM == 'AM') {
              $scope.weekDays[j].halfDayAM = $scope.weekPlanList.HalfdayModels[k];
              console.log($scope.weekDays[j].halfDayAM);
            }
            //下午半天事务
            if (moment($scope.weekDays[j]).date() == moment($scope.weekPlanList.HalfdayModels[k].ActivityDate).date() && $scope.weekPlanList.HalfdayModels[k].AMPM == 'PM') {
              $scope.weekDays[j].halfDayPM = $scope.weekPlanList.HalfdayModels[k];
              console.log($scope.weekDays[j].halfDayPM);
            }
          }
        }
      });
    };

    //获取本周的日期数组
    $scope.$watch("weekSatrtDate", function (newValue, oldValue, scope) {
      {
        $scope.weekDays = [];
        //获取一周计划
        var dateDiff = moment().endOf('week').diff(moment().startOf('week'), 'days');//日期差天数
        for (var i = 0; i <= dateDiff; i++) {
          $scope.weekDays.push(moment($scope.weekSatrtDate).add(i, 'days'));
          if (i == dateDiff) {
            $scope.bindPlanList();
          }
        }
      }
    });
    //下一周
    $scope.nextWeek = function () {
      $scope.weekSatrtDate = moment($scope.weekSatrtDate).add(1,'w');
      $scope.weekEndDate = moment($scope.weekEndDate).add(1,'w');
    };
    //上一周
    $scope.prevWeek = function () {
      $scope.weekSatrtDate = moment($scope.weekSatrtDate).add(-1,'w');
      $scope.weekEndDate = moment($scope.weekEndDate).add(-1,'w');
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
    //点半天事务弹出底部框
    $scope.showHalfFooter = function (tabtype, date) {
      $scope.currentRoute = null;
      $scope.selectedHalfType = {};
      $scope.selectedDate = date;//选中的日期
      $scope.getRoutes(function () {
        dailysrv.getHalfdayType().then(function (data) {
          $scope.halfdayTypeList = data;
          $scope.showMask = true;
          $scope.footerTab = tabtype;
          $scope.halfAffair = true;
        });
      });
    };
    //选择事务类型
    $scope.chooseHalfType = function (ampm, item) {
      //选中的类型
      $scope.selectedHalfType = {
        ampm: ampm,
        type: item
      }
    };
    //编辑页面中返回,如果状态是reload,关闭footer
    $rootScope.$on('closeFooter', function () {
      $scope.cancelPlanFooter();
      $scope.bindPlanList();
    });

    //选中路线
    $scope.selectRoute = function (route) {
      $scope.currentRoute = route;
    };
    //保存计划路线
    $scope.saveRoutePlan = function (callback) {
      //获取路线明细
      if ($scope.currentRoute == null) {
        if (callback != null) {
          callback();
        }
      } else {
        routesettingsrv.getroutedetail($scope.currentRoute.LineID).then(function (data) {
          $scope.currentRoute = data;
          if ($scope.currentRoute.Institutions.length <= 0) {
            $rootScope.toast("请选择机构");
          } else {
            $scope.currentRoute.ActivityDate = $scope.selectedDate.format("YYYY-MM-DD");
            dailysrv.savePlan($scope.currentRoute).then(function (state) {
              if (callback != null) {
                callback();
              }
            });
          }
        });
      }
    };
    //保存计划的半天事务
    $scope.saveHalfPlan = function (callback) {
      if ($scope.selectedHalfType.type != null) {
        $scope.selectedHalfType.type.ActivityDate = $scope.selectedDate.format("YYYY-MM-DD");
        $scope.selectedHalfType.type.AMPM = $scope.selectedHalfType.ampm;
        dailysrv.saveHalfdayPlan($scope.selectedHalfType.type).then(function () {
          if (callback != null) {
            callback();
          }
        });
      } else {
        if (callback != null) {
          callback();
        }
      }
    }
    //保存计划
    $scope.savePlan = function () {
      if ($scope.selectedHalfType.type == null && $scope.currentRoute == null) {
        $rootScope.toast("请选择路线或者半天事务");
      } else {
        $scope.saveRoutePlan(function () {
          $scope.saveHalfPlan(function () {
            $rootScope.toast("保存成功", function () {
              $scope.cancelPlanFooter();
              $scope.bindPlanList();
            });
          })
        })
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
     $scope.selectedDate=date;
    }

  });
