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
    $scope.viewActive = 'dayView';
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
        console.log("周计划:");
        console.log(palnlist);
        if (callback != null) {
          callback();
        }
      });
    };
    //获取一周实际
    $scope.getWeekActualList = function (callback) {
      dailysrv.getWeekActualList($scope.weekSatrtDate.format("YYYY-MM-DD"), $scope.weekEndDate.format("YYYY-MM-DD")).then(function (actuallist) {
        $scope.weekActualList = actuallist;
        if (callback != null) {
          callback();
        }
      });
    };
    //绑定已填写计划、已填写实际与本周数组的关系
    $scope.bindPlanList = function () {
      if ($scope.staff != null) {
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
              if ($scope.weekPlanList._Citys != null) {
                for (var k = 0; k < $scope.weekPlanList._Citys.length; k++) {
                  if (moment($scope.weekDays[j]).date() == moment($scope.weekPlanList._Citys[k].ActivityDate).date()) {
                    $scope.weekDays[j].route = $scope.weekPlanList._Citys[k];
                  }
                }
              }
            }
            //赋值半天事务
            for (var k = 0; k < $scope.weekPlanList.HalfdayModels.length; k++) {
              //上午半天事务
              if (moment($scope.weekDays[j]).date() == moment($scope.weekPlanList.HalfdayModels[k].ActivityDate).date() && $scope.weekPlanList.HalfdayModels[k].AMPM == 'AM') {
                $scope.weekDays[j].halfDayAM = $scope.weekPlanList.HalfdayModels[k];
              }
              //下午半天事务
              if (moment($scope.weekDays[j]).date() == moment($scope.weekPlanList.HalfdayModels[k].ActivityDate).date() && $scope.weekPlanList.HalfdayModels[k].AMPM == 'PM') {
                $scope.weekDays[j].halfDayPM = $scope.weekPlanList.HalfdayModels[k];
              }
            }
          }
        });
        $scope.getWeekActualList(function () {
          for (var j = 0; j < $scope.weekDays.length; j++) {
            //如果角色是ccr的话
            if ($scope.staff.IsCCR) {
              //赋值路线
              for (var k = 0; k < $scope.weekActualList.PlanRoutelines.length; k++) {
                if (moment($scope.weekDays[j]).date() == moment($scope.weekActualList.PlanRoutelines[k].ActivityDate).date()) {
                  $scope.weekDays[j].routeActual = $scope.weekActualList.PlanRoutelines[k];
                }
              }
            } else {
              //赋值城市
              if ($scope.weekActualList._Citys != null) {
                for (var k = 0; k < $scope.weekActualList._Citys.length; k++) {
                  if (moment($scope.weekDays[j]).date() == moment($scope.weekActualList._Citys[k].ActivityDate).date()) {
                    $scope.weekDays[j].routeActual = $scope.weekActualList._Citys[k];
                  }
                }
              }
            }
            //赋值半天事务
            for (var k = 0; k < $scope.weekActualList.HalfdayModels.length; k++) {
              //上午半天事务
              if (moment($scope.weekDays[j]).date() == moment($scope.weekActualList.HalfdayModels[k].ActivityDate).date() && $scope.weekActualList.HalfdayModels[k].AMPM == 'AM') {
                $scope.weekDays[j].halfDayActualAM = $scope.weekActualList.HalfdayModels[k];
              }
              //下午半天事务
              if (moment($scope.weekDays[j]).date() == moment($scope.weekActualList.HalfdayModels[k].ActivityDate).date() && $scope.weekActualList.HalfdayModels[k].AMPM == 'PM') {
                $scope.weekDays[j].halfDayActualPM = $scope.weekActualList.HalfdayModels[k];
              }
            }
          }
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
            $scope.selectedDate = $scope.weekDays[0];
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
    //刷新日视图
    $scope.bindDateView = function () {
      $scope.TotalNumberOfPlansHasCheckOut = 0;//计划内有签出的机构总数;
      $scope.TotalNumberOfPlans = 0;//计划内机构总数
      if ($scope.staff != null) {
        guidesrv.getPlanScheduleList($scope.selectedDate.format('YYYY-MM-DD')).then(function (data) {
          //当天的线路
          $scope.currentDaily = data;
          $scope.currentOriginalDaily = angular.copy(data);//拷贝一份原始的日程计划给日地图用
          $scope.currentDaily.Citys = $scope.currentDaily._Citys;
          //如果当前视图是日地图时,同时刷新绑定题图
          if ($scope.dayInfoTab == 'map') {
            $scope.setInsMarker();
          }
          if ($scope.staff.IsCCR) {
            if ($scope.currentDaily.PlanRouteline.Institutions.length == 0 && $scope.currentDaily.Checkins.length > 0) {
              $scope.currentDaily.PlanRouteline.Institutions = [];
            }
            //添加计划外的签到
            for (var i = 0; i < $scope.currentDaily.Checkins.length; i++) {
              var inCheckin = false;//是否在签到内的机构
              //数组为空时
              if ($scope.currentDaily.PlanRouteline.Institutions.length == 0) {
                $scope.currentDaily.PlanRouteline.Institutions.push({
                  InstitutionID: $scope.currentDaily.Checkins[i].InstitutionID,
                  InstitutionName: $scope.currentDaily.Checkins[i].InstitutionName,
                  Address: $scope.currentDaily.Checkins[i].InstitutionAddress,
                  InstitutionPriority: $scope.currentDaily.Checkins[i].InstitutionPriority,
                  CheckModel: $scope.currentDaily.Checkins[i]
                });
              } else {
                for (var j = 0; j < $scope.currentDaily.PlanRouteline.Institutions.length; j++) {
                  if ($scope.currentDaily.PlanRouteline.Institutions[j].InstitutionID == $scope.currentDaily.Checkins[i].InstitutionID) {
                    $scope.currentDaily.PlanRouteline.Institutions[j].CheckModel = $scope.currentDaily.Checkins[i];
                    inCheckin = true;
                    $scope.TotalNumberOfPlans++;
                    if ($scope.currentDaily.Checkins[i].InOut == "OUT") {
                      $scope.TotalNumberOfPlansHasCheckOut++;
                    }
                  }
                  if (j == $scope.currentDaily.PlanRouteline.Institutions.length - 1 && inCheckin == false) {
                    $scope.currentDaily.PlanRouteline.Institutions.push({
                      InstitutionID: $scope.currentDaily.Checkins[i].InstitutionID,
                      InstitutionName: $scope.currentDaily.Checkins[i].InstitutionName,
                      Address: $scope.currentDaily.Checkins[i].InstitutionAddress,
                      InstitutionPriority: $scope.currentDaily.Checkins[i].InstitutionPriority,
                      CheckModel: $scope.currentDaily.Checkins[i]
                    })
                  }
                }
              }
            }
          } else if ($scope.staff.IsAE) {
            if ($scope.currentDaily.Citys.length == 0 && $scope.currentDaily.Checkins.length > 0) {
              $scope.currentDaily.Citys = [{Institutions: []}];
            }
            for (var i = 0; i < $scope.currentDaily.Checkins.length; i++) {
              var inCheckin = false;//是否在签到内的机构
              if ($scope.currentDaily.Citys.length == 0) {
                $scope.currentDaily.Citys = [];
                $scope.currentDaily.Citys[0].Institutions = [];
                $scope.currentDaily.Citys[0].Institutions.push({
                  InstitutionID: $scope.currentDaily.Checkins[i].InstitutionID,
                  InstitutionName: $scope.currentDaily.Checkins[i].InstitutionName,
                  Address: $scope.currentDaily.Checkins[i].InstitutionAddress,
                  InstitutionPriority: $scope.currentDaily.Checkins[i].InstitutionPriority,
                  CheckModel: $scope.currentDaily.Checkins[i]
                })
              }
              for (var j = 0; j < $scope.currentDaily.Citys.length; j++) {
                for (var k = 0; k < $scope.currentDaily.Citys[j].Institutions.length; k++) {
                  if ($scope.currentDaily.Citys[j].Institutions[k].InstitutionID == $scope.currentDaily.Checkins[i].InstitutionID) {
                    $scope.currentDaily.Citys[j].Institutions[k].CheckModel = $scope.currentDaily.Checkins[i];
                    inCheckin = true;
                  }
                  ;
                  //遍历结束
                  if (k == $scope.currentDaily.Citys[j].Institutions.length - 1 && inCheckin == false) {
                    $scope.currentDaily.Citys[j].Institutions.push({
                      InstitutionID: $scope.currentDaily.Checkins[i].InstitutionID,
                      InstitutionName: $scope.currentDaily.Checkins[i].InstitutionName,
                      Address: $scope.currentDaily.Checkins[i].InstitutionAddress,
                      InstitutionPriority: $scope.currentDaily.Checkins[i].InstitutionPriority,
                      CheckModel: $scope.currentDaily.Checkins[i]
                    })
                  }
                }
              }
            }
          }
        });
      }
    };
    //日视图日期发生变换时
    $scope.$watch("selectedDate + staff + viewActive", function (newValue, oldValue, scope) {
      //如果是日试图，刷新数据
      if ($scope.viewActive == "dayView") {
        $scope.bindDateView();
      }
    });
    //切换map tab
    $scope.switchmaptab = function (type) {
      $scope.dayInfoTab=type;
      if ($scope.dayInfoTab == 'map') {
        $scope.$broadcast("amap", "datacompleted");
      }
    }

    //初始化半天事务tab
    $scope.footerTab = 'route';
    //半天事务和路线图tab
    $scope.changeFooterTab = function (tabTitle) {
      $scope.footerTab = tabTitle;
    };
    //点半天事务弹出底部框//CCR的
    $scope.showHalfFooter = function (tabtype, date) {
      $scope.currentRoute = null;
      $scope.selectedMorningHalfType = {};
      $scope.selectedAfternoonHalfType = {};
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
      if (ampm == "AM") {
        $scope.selectedMorningHalfType.type = item;
      } else {
        $scope.selectedAfternoonHalfType.type = item;
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
      var models = [];
      if ($scope.selectedAfternoonHalfType.type != null) {
        $scope.selectedAfternoonHalfType.type.ActivityDate = $scope.selectedDate.format("YYYY-MM-DD");
        $scope.selectedAfternoonHalfType.type.AMPM = "PM";
        models.push($scope.selectedAfternoonHalfType.type);
      }
      if ($scope.selectedMorningHalfType.type != null) {
        $scope.selectedMorningHalfType.type.ActivityDate = $scope.selectedDate.format("YYYY-MM-DD");
        $scope.selectedMorningHalfType.type.AMPM = "AM";
        models.push($scope.selectedMorningHalfType.type);
      }
      if (models.length > 0) {
        dailysrv.saveHalfdayPlans(models).then(function () {
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
      if ($scope.selectedAfternoonHalfType.type == null && $scope.selectedMorningHalfType.type == null && $scope.currentRoute == null) {
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
    $scope.showActualCCR = function (data) {
      $scope.currentActualRoute = data;
      var showActual = $ionicPopup.show({
        cssClass: 'actual-alert',
        templateUrl: 'templates/schedulemgt/actualAlertCCR.html',
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
    $scope.showActualAE = function (data) {
      $scope.currentActualRoute = data;
      console.log(data);
      if(data.routeActual!=null){
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
      }
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
    //点击日期时触发
    $scope.clickDate = function (date) {
      $scope.selectedDate = date;
    };
    //地图初始化完成后执行
    $scope.$on('amap', function (errorType, data) {
      if (data == "mapcompleted") {
        $scope.setInsMarker();
      }
    });
    $scope.mapSwitchTab = 'actual';
    //切换地图上实际路线和计划路线
    $scope.switchPlanActualInMap = function (type) {
      $scope.mapSwitchTab = type;
      $scope.setInsMarker();
    };
    //根据地图上的实际、计划按钮绘制地图点
    $scope.setInsMarker = function () {
      $scope.map.clearMap();
      //$scope.currentDaily.PlanRouteline 计划线路
      //$scope.currentDaily.Checkins 实际签到
      var institutions = [];
      if ($scope.mapSwitchTab == 'plan') {
        for (var i = 0; i < $scope.currentOriginalDaily.PlanRouteline.Institutions.length; i++) {
          var ins = $scope.currentOriginalDaily.PlanRouteline.Institutions[i];
          institutions.push({
            Name: ins.InstitutionName,
            Id: ins.InstitutionID,
            LngLat: ins.lnglat,
            Priority: ins.InstitutionPriority
          });
          if (i == $scope.currentOriginalDaily.PlanRouteline.Institutions.length - 1) {
            $scope.setInsMarkerHandle(institutions);
          }
        }
      } else if ($scope.mapSwitchTab == 'actual') {
        for (var i = 0; i < $scope.currentOriginalDaily.Checkins.length; i++) {
          var checkIn = $scope.currentOriginalDaily.Checkins[i];
          institutions.push({
            Name: checkIn.InstitutionName,
            Id: checkIn.InstitutionID,
            LngLat: [checkIn.CheckinLocation.Lng, checkIn.CheckinLocation.Lat],
            Priority: checkIn.InstitutionPriority
          });
          if (i == $scope.currentOriginalDaily.Checkins.length - 1) {
            $scope.setInsMarkerHandle(institutions);
          }
        }
      }

    }
    $scope.setInsMarkerHandle = function (institutions) {
      var isPlan = $scope.mapSwitchTab == 'plan';
      var lineArr=[];
      for (var i = 0; i < institutions.length; i++) {
        var ins = institutions[i];
        new AMap.Marker({
          map: $scope.map,
          position: ins.LngLat,
          content: '<div class="marker-route '+(ins.Priority == "A" ? "markerA" : (ins.Priority == "B" ? "markerA" : "markerC"))+'">'+(i+1)+'</div>'
        });
        lineArr.push(ins.LngLat);
        if(i==institutions.length-1){
          new AMap.Polyline({
            path: lineArr,          //设置线覆盖物路径
            strokeColor: isPlan?"#419de7":"#48d38e", //线颜色
            strokeOpacity: 1,       //线透明度
            strokeWeight: 2,        //线宽
            strokeStyle: isPlan?'dashed':'solid',   //线样式
            //strokeDasharray: [10, 5] //补充线样式
          }).setMap($scope.map);
          $scope.map.setFitView();//使地图自适应显示到合适的范围
        }
      }
    }
  });
