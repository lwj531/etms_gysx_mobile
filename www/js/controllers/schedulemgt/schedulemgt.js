angular.module('schedulemgt.ctrl', [])
  .controller('ScheduleMgtCtrl', function ($scope,$ionicPopup) {

    //切角色
    $scope.CCR = true;
    $scope.AE = !$scope.CCR;

    //日程管理初始化tab 打开日视图  (dayView | weekView)
    $scope.viewActive='weekView';
    //日视图里切列表和地图 dayInfoTab：(list | map )
    $scope.dayInfoTab='list';
    //周视图内的实际和计划tab初始化 (actual | plan)
    $scope.statusTab='actual';

    //初始化半天事务框不显示
    $scope.halfAffair=false;
    //遮罩不显示
    $scope.showMask=false;
    //进度条百分比
    $scope.progressNum = 40+'%';
    $scope.progress = {"width":$scope.progressNum};

    //改计划实际tab
    $scope.changePA=function (pa) {
      $scope.statusTab=pa;
    }

    //初始化半天事务tab
    $scope.footerTab='route';
    //半天事务和路线图tab
    $scope.changeFooterTab=function (tabTitle) {
      $scope.footerTab=tabTitle;
      console.log(tabTitle);
    }

    //点半天事务弹出底部框
    $scope.showHalfFooter = function(tabTitle) {
     $scope.showMask=true;
      $scope.footerTab=tabTitle;

      $scope.halfAffair=true;
    };
    //点取消关闭底部计划框
    $scope.cancelPlanFooter=function(){
      $scope.halfAffair=false;
      $scope.showMask=false;
    };
    //点确定关闭底部计划框
    $scope.confirmPlanFooter=function(){
      $scope.halfAffair=false;
      $scope.showMask=false;
    };

    //checkbox的选中事件
    $scope.toggleSelected=function (item) {
      item.selected=!item.selected;
    };
    $scope.childListShow=false;

    //CCR计划弹框
    $scope.showPlanPopup=function () {

      $scope.planStoreList = [
        {name: 'xx大药房xx大药房xx大药房xx大',address:'xx区xx路xx号xx弄',city:'北京市',activities:2,selected:false},
        {name: 'xx大药房xx大药房xx大药房xx大药房xx大药房xx大药房',address:'xx区xx路xx号xx弄',city:'上海市',activities:3,selected:false}
      ];
      var showPlanHalf = $ionicPopup.show({
        cssClass: 'plan-alert',
        templateUrl: 'templates/schedulemgt/planalert.html',
        title: '',
        scope: $scope

      });
      showPlanHalf.then(function (res) {
        console.log('Tapped!', res);
      });

      $scope.closePlanList=function () {
        showPlanHalf.close();
      };
      //点击连锁总部列表，切至计划项
      $scope.slideToChild=function () {
        $scope.childListShow=true;
      };
      //点击连返回，回到parent list
      $scope.backToParent=function () {
        $scope.childListShow=false;
      };


    };

    //CCR实际弹框
    $scope.showActualCCR=function () {

      $scope.actualStoreList = [
        {name: 'xx大药房xx大药房xx大药房xx大',address:'xx区xx路xx号xx弄',city:'北京市',activities:2,selected:false},
        {name: 'xx大药房xx大药房xx大药房xx大药房xx大药房xx大药房',address:'xx区xx路xx号xx弄',city:'上海市',activities:3,selected:false}
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

      $scope.closeActualCCR=function () {
        showActual.close();
      };
    };
    //AE实际弹框
    $scope.showActualAE=function () {

      $scope.actualStoreList = [
        {name: 'xx大药房xx大药房xx大药房xx大',address:'xx区xx路xx号xx弄',city:'北京市',activities:2,selected:false},
        {name: 'xx大药房xx大药房xx大药房xx大药房xx大药房xx大药房',address:'xx区xx路xx号xx弄',city:'上海市',activities:3,selected:false}
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

      $scope.closeActualAE=function () {
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
    $scope.clickDate=function(date){
      console.log(date);
    }

  });
