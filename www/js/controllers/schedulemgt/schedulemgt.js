angular.module('schedulemgt.ctrl', ['routesetting.srv', 'daily.srv', 'angularMoment', 'client.srv', 'guide.srv'])
  .controller('ScheduleMgtCtrl', function ($scope, $rootScope, $ionicPopup, $ionicModal, routesettingsrv, dailysrv, amMoment, clientsrv, guidesrv) {
    //判断当前角色
    clientsrv.getcurrentstaff().then(function (staff) {
      $scope.staff = staff;
      $scope.staff.IsAE = staff.Roles.indexOf('AE_REP') != -1;
      $scope.staff.IsCCR = !$scope.staff.IsAE;
      console.log($scope.staff);
    });
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
    //默认当前选中的日期
    $scope.selectedDate = moment();
    //当前周的开始日期
    $scope.weekSatrtDate = moment().weekday(0);
    //当前周的结束日期
    $scope.weekEndDate = moment().weekday(6);
    //获取一周已填写的计划
    $scope.getWeekPlanList = function (callback) {
      dailysrv.getWeekPlanList($scope.weekSatrtDate.format("YYYY-MM-DD"), $scope.weekEndDate.format("YYYY-MM-DD")).then(function (palnlist) {
        $scope.weekPlanList = palnlist;
        // console.log(palnlist);
        if (callback != null) {
          callback();
        }
      });
    };
    //获取一周实际
    $scope.getWeekActualList = function (callback) {
      dailysrv.getWeekActualList($scope.weekSatrtDate.format("YYYY-MM-DD"), $scope.weekEndDate.format("YYYY-MM-DD")).then(function (actuallist) {
        $scope.weekActualList = actuallist;
        console.log(actuallist);
        if (callback != null) {
          callback();
        }
      });
    };
    //绑定已填写计划与本周数组的关系
    $scope.bindPlanList = function () {
      if($scope.staff!=null){
        $scope.getWeekPlanList(function () {
          for (var j = 0; j < $scope.weekDays.length; j++) {
            //如果角色是ccr的话
            if ($scope.staff.IsCCR) {
              //赋值路线
              for (var k = 0; k < $scope.weekPlanList.PlanRoutelines.length; k++) {
                if (moment($scope.weekDays[j]).date() == moment($scope.weekPlanList.PlanRoutelines[k].ActivityDate).date()) {
                  $scope.weekDays[j].route = $scope.weekPlanList.PlanRoutelines[k];
                }
              }
            } else {
              //赋值城市
              for (var k = 0; k < $scope.weekPlanList.Citys.length; k++) {
                if (moment($scope.weekDays[j]).date() == moment($scope.weekPlanList.Citys[k].ActivityDate).date()) {
                  $scope.weekDays[j].route = $scope.weekPlanList.Citys[k];
                }
              }
            }

            //赋值半天事务
            for (var k = 0; k < $scope.weekPlanList.HalfdayModels.length; k++) {
              //上午半天事务
              if (moment($scope.weekDays[j]).date() == moment($scope.weekPlanList.HalfdayModels[k].ActivityDate).date() && $scope.weekPlanList.HalfdayModels[k].AMPM == 'AM') {
                $scope.weekDays[j].halfDayAM = $scope.weekPlanList.HalfdayModels[k];
                //console.log($scope.weekDays[j].halfDayAM);
              }
              //下午半天事务
              if (moment($scope.weekDays[j]).date() == moment($scope.weekPlanList.HalfdayModels[k].ActivityDate).date() && $scope.weekPlanList.HalfdayModels[k].AMPM == 'PM') {
                $scope.weekDays[j].halfDayPM = $scope.weekPlanList.HalfdayModels[k];
                //console.log($scope.weekDays[j].halfDayPM);
              }
            }
          }
        });
        $scope.getWeekActualList(function () {
          // //获取周实际
          // $scope.getWeekActualList(function () {
          //   $scope.checkinTimes = [];
          //   $scope.checkoutTimes = [];
          //   for (var j = 0; j < $scope.actualWeekDays.length; j++) {
          //     for (var k = 0; k < $scope.weekActualList.PlanRoutelines.length; k++) {
          //       if (moment($scope.actualWeekDays[j]).format("YYYY-MM-DD") == moment($scope.weekActualList.PlanRoutelines[k].ActivityDate).format("YYYY-MM-DD")) {
          //         $scope.actualWeekDays[j].route = $scope.weekActualList.PlanRoutelines[k];
          //         $scope.actualWeekDays[j].progress = {"width": $scope.weekActualList.Rates};
          //         $scope.actualWeekDays[j].halfday = $scope.weekActualList.HalfdayModels;
          //
          //         for (var p=0;p<$scope.weekActualList.Checkins.length;p++){
          //           if($scope.weekActualList.Checkins[p].InOut=="IN" && $scope.actualWeekDays[j].route.CheckIn ==null && $scope.weekActualList.Checkins[p].CheckinDate == moment($scope.actualWeekDays[j].route.ActivityDate).format('YYYY-MM-DD')){
          //             $scope.actualWeekDays[j].route.CheckIn = $scope.weekActualList.Checkins[p];
          //           }
          //         }
          //
          //         for (var p = $scope.weekActualList.Checkins.length-1;p>=0;p--){
          //           if($scope.weekActualList.Checkins[p].InOut=="OUT" && $scope.actualWeekDays[j].route.CheckOut ==null && $scope.weekActualList.Checkins[p].CheckinDate == moment($scope.actualWeekDays[j].route.ActivityDate).format('YYYY-MM-DD')){
          //             $scope.actualWeekDays[j].route.CheckOut = $scope.weekActualList.Checkins[p];
          //           }
          //         }
          //       }
          //     }
          //
          //     // for (var l = 0; l < $scope.weekActualList.Checkins.length; l++) {
          //     //   if (moment($scope.actualWeekDays[j]).format("YYYY-MM-DD") == moment($scope.weekActualList.PlanRoutelines[k].ActivityDate).format("YYYY-MM-DD")) {
          //     //     $scope.actualWeekDays[j].CheckinTime = $scope.weekActualList.Checkins[l];
          //     //     if ($scope.weekActualList.Checkins[l].InOut == 'In') {
          //     //       $scope.checkinTimes.push($scope.weekActualList.Checkins[l].CheckinTime);
          //     //     }
          //     //     else if ($scope.weekActualList.Checkins[l].InOut == 'Out') {
          //     //       $scope.checkoutTimes.push($scope.weekActualList.Checkins[l].CheckinTime);
          //     //     }
          //     //     else {
          //     //       alert('不是In Out');
          //     //     }
          //     //   }
          //     // }
          //
          //   }
          // });
          console.log('adudhas-----============-=-=-=-=u');
        });
      }
    };

    //获取本周的日期数组
    $scope.$watch("weekSatrtDate + staff", function (newValue, oldValue, scope) {
      {
        $scope.weekDays = [];
        //获取一周计划
        var dateDiff = moment().endOf('week').diff(moment().startOf('week'), 'days');//日期差天数
        for (var i = 0; i <= dateDiff; i++) {
          $scope.weekDays.push(moment($scope.weekSatrtDate).add(i, 'days'));
          //循环结束
          if (i == dateDiff) {
            $scope.bindPlanList();
            $scope.selectedDate =  $scope.weekDays[0];
          }
        }
      }
    });
    //下一周
    $scope.nextWeek = function () {
      $scope.weekSatrtDate = moment($scope.weekSatrtDate).add(1, 'w');
      $scope.weekEndDate = moment($scope.weekEndDate).add(1, 'w');
    };
    //上一周
    $scope.prevWeek = function () {
      $scope.weekSatrtDate = moment($scope.weekSatrtDate).add(-1, 'w');
      $scope.weekEndDate = moment($scope.weekEndDate).add(-1, 'w');
    };

    //改计划实际tab
    $scope.changePA = function (pa) {
      $scope.statusTab = pa;
    };
    //日视图日期发生变换时
    $scope.$watch("selectedDate + staff", function (newValue, oldValue, scope) {
      {
        $scope.TotalNumberOfPlansHasCheckOut=0;//计划内有签出的机构总数;
        $scope.TotalNumberOfPlans =0;//计划内机构总数
        if ($scope.staff != null) {
          guidesrv.getPlanScheduleList($scope.selectedDate.format('YYYY-MM-DD')).then(function (data) {
            $scope.currentDaily = data;
            console.log(data);
            if($scope.staff.IsCCR){
              if($scope.currentDaily.PlanRouteline.Institutions.length==0 && $scope.currentDaily.Checkins.length>0){
                $scope.currentDaily.PlanRouteline.Institutions =[];
              }
              //添加计划外的签到
              for (var i = 0; i < $scope.currentDaily.Checkins.length; i++) {
                var inCheckin =false;//是否在签到内的机构
                //数组为空时
                if($scope.currentDaily.PlanRouteline.Institutions.length==0){
                  $scope.currentDaily.PlanRouteline.Institutions.push({
                    InstitutionID:$scope.currentDaily.Checkins[i].InstitutionID,
                    InstitutionName:$scope.currentDaily.Checkins[i].InstitutionName,
                    Address:$scope.currentDaily.Checkins[i].InstitutionAddress,
                    InstitutionPriority:$scope.currentDaily.Checkins[i].InstitutionPriority,
                    CheckModel : $scope.currentDaily.Checkins[i]
                  });
                }else{
                  for (var j = 0; j < $scope.currentDaily.PlanRouteline.Institutions.length; j++) {
                    if ($scope.currentDaily.PlanRouteline.Institutions[j].InstitutionID == $scope.currentDaily.Checkins[i].InstitutionID) {
                      $scope.currentDaily.PlanRouteline.Institutions[j].CheckModel =  $scope.currentDaily.Checkins[i];
                      inCheckin=true;
                      $scope.TotalNumberOfPlans++;
                      if($scope.currentDaily.Checkins[i].InOut=="OUT"){
                        $scope.TotalNumberOfPlansHasCheckOut++;
                      }
                    }
                    if(j==$scope.currentDaily.PlanRouteline.Institutions.length-1 && inCheckin==false){
                      $scope.currentDaily.PlanRouteline.Institutions.push({
                        InstitutionID:$scope.currentDaily.Checkins[i].InstitutionID,
                        InstitutionName:$scope.currentDaily.Checkins[i].InstitutionName,
                        Address:$scope.currentDaily.Checkins[i].InstitutionAddress,
                        InstitutionPriority:$scope.currentDaily.Checkins[i].InstitutionPriority,
                        CheckModel : $scope.currentDaily.Checkins[i]
                      })
                    }
                  }
                }
              }
            }else if($scope.staff.IsAE){
              if($scope.currentDaily.Citys.length==0 && $scope.currentDaily.Checkins.length>0){
                $scope.currentDaily.Citys=[{Institutions:[]}];
              }
              for (var i = 0; i < $scope.currentDaily.Checkins.length; i++) {
                var inCheckin =false;//是否在签到内的机构
                if($scope.currentDaily.Citys.length==0){
                  $scope.currentDaily.Citys=[];
                  $scope.currentDaily.Citys[0].Institutions=[];
                  $scope.currentDaily.Citys[0].Institutions.push({
                    InstitutionID:$scope.currentDaily.Checkins[i].InstitutionID,
                    InstitutionName:$scope.currentDaily.Checkins[i].InstitutionName,
                    Address:$scope.currentDaily.Checkins[i].InstitutionAddress,
                    InstitutionPriority:$scope.currentDaily.Checkins[i].InstitutionPriority,
                    CheckModel : $scope.currentDaily.Checkins[i]
                  })
                }
                for(var j=0;j<$scope.currentDaily.Citys.length;j++){
                  for (var k=0;k<$scope.currentDaily.Citys[j].Institutions.length;k++){
                    if ($scope.currentDaily.Citys[j].Institutions[k].InstitutionID == $scope.currentDaily.Checkins[i].InstitutionID) {
                      $scope.currentDaily.Citys[j].Institutions[k].CheckModel =  $scope.currentDaily.Checkins[i];
                      inCheckin=true;
                    };
                    //遍历结束
                    if(k==$scope.currentDaily.Citys[j].Institutions.length-1 && inCheckin==false){
                      $scope.currentDaily.Citys[j].Institutions.push({
                        InstitutionID:$scope.currentDaily.Checkins[i].InstitutionID,
                        InstitutionName:$scope.currentDaily.Checkins[i].InstitutionName,
                        Address:$scope.currentDaily.Checkins[i].InstitutionAddress,
                        InstitutionPriority:$scope.currentDaily.Checkins[i].InstitutionPriority,
                        CheckModel : $scope.currentDaily.Checkins[i]
                      })
                    }
                  }
                }
              }
            }
          });
        }
      }
    });

    //初始化半天事务tab
    $scope.footerTab = 'route';
    //半天事务和路线图tab
    $scope.changeFooterTab = function (tabTitle) {
      $scope.footerTab = tabTitle;
    };
    //点半天事务弹出底部框//CCR的
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
    //总部选中
    $scope.headQuarterSelected = function (item) {
      $scope.selectedHeadQuarter = item;
      item.selected = !item.selected;
      item.checkList = [];
      angular.forEach($scope.AECheckList, function (value, key) {
        value.selected = false;
      });
      $scope.childListShow = item.selected;
    };
    //checklist选中
    $scope.checkListSelected = function (item) {
      item.selected = !item.selected;
      if (item.selected) {
        $scope.selectedHeadQuarter.checkList.push(item);
      } else {
        $scope.selectedHeadQuarter.checkList.splice($scope.selectedHeadQuarter.checkList.indexOf(item), 1);
      }
    };
    //获取线路
    $scope.getRoutes = function (callback) {
      routesettingsrv.getroutes().then(function (data) {
        $scope.planStoreList = data;
        if (callback != null) {
          callback();
        }
      });
    };
    //获取AE的总部列表
    $scope.getHeadQuarters = function (callback) {
      routesettingsrv.getins().then(function (data) {
        $scope.headQuarters = data;
        if (callback != null) {
          callback();
        }
      })
    };
    //获取AE CheckList选项
    $scope.getCheckList = function (callback) {
      dailysrv.getCheckList().then(function (data) {
        $scope.AECheckList = data;
        if (callback != null) {
          callback();
        }
      })
    };
    //关闭计划窗体
    $scope.closePlanList = function () {
      $scope.planModal.close();
    };
    //点击连返回，回到parent list
    $scope.backToParent = function () {
      $scope.childListShow = false;
    };
    //计划弹框
    $scope.showPlanPopup = function (date) {
      console.log(date);
      $scope.selectedDate = date;//选中的日期
      $scope.getHeadQuarters(function () {
        $scope.getCheckList(function () {
          $scope.planModal = $ionicPopup.show({
            cssClass: 'plan-alert',
            templateUrl: 'templates/schedulemgt/planalert.html',
            scope: $scope
          });
        });
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
        //console.log('Tapped Actual!', res);
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
        //console.log('Tapped Actual!', res);
      });

      $scope.closeActualAE = function () {
        showActual.close();
      };
    };
    //保存AE计划
    $scope.saveAEPlan = function () {
      //连锁总部
      var headQuarterModels = [];
      for (var i = 0; i < $scope.headQuarters.length; i++) {
        if ($scope.headQuarters[i].selected) {
          headQuarterModels.push({
            InstitutionID: $scope.headQuarters[i].InstitutionID,
            InstitutionName: $scope.headQuarters[i].InstitutionName,
            Kaitems: $scope.headQuarters[i].checkList
          });
        }
        if (i == $scope.headQuarters.length - 1) {
          if (headQuarterModels.length > 0) {
            //保存总部到数据库
            dailysrv.savePlanKaInstitution($scope.selectedDate.format('YYYY-MM-DD'), headQuarterModels).then(function () {
              $scope.closePlanList();
              $scope.toast("保存成功");
              $scope.bindPlanList();
            });
          } else {
            $scope.toast("请选择连锁总部");
          }

        }
      }
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
      $scope.selectedDate = date;
    }
  });
