angular.module('schedulemgt.ctrl', [])
  .controller('ScheduleMgtCtrl', function ($scope,$ionicPopup) {

    //切角色
    $scope.CCR = false;
    $scope.AE = !$scope.CCR;

    //初始化半天事务框不显示
    $scope.halfAffair=false;

    //日程管理初始化tab 打开日视图  (dayView | weekView)
    $scope.viewActive='weekView';
    //日视图里切列表和地图 dayInfoTab：(list | map )
    $scope.dayInfoTab='list';
    //周视图内的实际和计划tab初始化 (actual | plan)
    $scope.statusTab='plan';

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

    //
    $scope.addSelected=function (idx) {
      $scope.planIndex=idx;
    };

    $scope.showPlanPopup=function () {

      $scope.planStoreList = [
        {name: 'xx大药房xx大药房xx大药房xx大',address:'xx区xx路xx号xx弄',city:'北京市',activities:2},
        {name: 'xx大药房xx大药房xx大药房xx大药房xx大药房xx大药房',address:'xx区xx路xx号xx弄',city:'上海市',activities:3}
      ]
      var showPlanHalf = $ionicPopup.show({
        cssClass: 'plan-alert',
        templateUrl: 'templates/schedulemgt/planalert.html',
        title: '计划<span class="color-blue"> (' + $scope.planStoreList.length + ')</span>',
        scope: $scope,
        buttons: [
          {text: '关闭',
            type: 'button-clear button-positive title-button-left',
            onTap: function (e) {

            }
          },
          {
            text: '<b>保存</b>',
            type: 'button-clear button-positive title-button-right',
            onTap: function (e) {

            }
          },
        ]
      });
      showPlanHalf.then(function (res) {
        console.log('Tapped!', res);
      });
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
