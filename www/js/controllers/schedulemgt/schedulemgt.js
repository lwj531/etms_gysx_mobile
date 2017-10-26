angular.module('schedulemgt.ctrl', [])
  .controller('ScheduleMgtCtrl', function ($scope) {
   //进度条百分比
    $scope.progressNum = 40+'%';
    $scope.progress = {"width":$scope.progressNum};

    //日程管理初始化tab 打开日视图  (dayView | weekView)
    $scope.viewActive='weekView';
    //日视图里切列表和地图 dayInfoTab：(list | map )
    $scope.dayInfoTab='list';
    //周视图内的实际和计划tab初始化 (actual | plan)
    $scope.statusTab='plan';

    $scope.halfAffair=false;
    $scope.planReport=false;
    //点半天事务弹出底部框
    $scope.showHalfFooter = function() {
      $scope.halfAffair=true;
    };
    //点取消关闭底部计划框
    $scope.cancelPlanFooter=function(){
      $scope.halfAffair=false;
    };
    //点确定关闭底部计划框
    $scope.confirmPlanFooter=function(){
      $scope.halfAffair=false;
    };

    //点计划报告弹出底部框
    $scope.showPlanAlert = function() {
      $scope.planReport=true;
    };
    //点弹框关闭按钮
    $scope.hidePlanAlert = function() {
      $scope.planReport=false;
    };

    //点弹框保存按钮
    $scope.confirmPlanAlert = function() {
      $scope.planReport=false;
    };


    //日历的原生js写法--------------/
    var cells = document.getElementById('weekDay').getElementsByTagName('li');
    var clen = cells.length;
    var currentFirstDate;
    var myDate = new Date();
    var etDate = new Date();
    var today = myDate.getDate();
    var formatDate = function (date) {
      var year = date.getFullYear() + '年';
      var month = (date.getMonth() + 1) + '月';
      var day = date.getDate();
      return day;
    };
    var addDate = function (date, n) {
      date.setDate(date.getDate() + n);
      return date;
    };
    var setDate = function (date) {
      var week = date.getDay();
      date = addDate(date, week * -1);
      currentFirstDate = new Date(date);
      var currM = currentFirstDate.getMonth();
      var todayM = myDate.getMonth();
      //document.getElementById('currYM').innerHTML = currentFirstDate.getFullYear() + '-' + (1 + currentFirstDate.getMonth() < 10 ? '0' + parseInt(1 + currentFirstDate.getMonth()) : 1 + currentFirstDate.getMonth());
      myDate.setDate(myDate.getDate() - myDate.getDay());
      for (var i = 0; i < clen; i++) {
        cells[i].innerHTML = formatDate(i == 0 ? date : addDate(date, 1));
        if (cells[i].innerHTML == today && currentFirstDate.getMonth() == myDate.getMonth() && currentFirstDate.getFullYear() == myDate.getFullYear()) {
          cells[i].className = 'today';
          //document.getElementById('currYM').innerHTML = myDate.getFullYear() + '-' + (1 + etDate.getMonth() < 10 ? '0' + parseInt(1 + etDate.getMonth()) : 1 + etDate.getMonth());
        }
        else {
          cells[i].className = '';
        }
      }
    };
    setDate(new Date());
    //日历的原生js写法==============/


    //日历的angular写法--------------/
    $scope.week = [];
    $scope.weekChange = [];
    $scope.today = new Date();
    $scope.changeDay = new Date();
    $scope.weekStartDay = new Date($scope.changeDay.setDate($scope.today.getDate() - $scope.today.getDay()));
    $scope.weekEndDay = new Date($scope.changeDay.setDate($scope.today.getDate() + 7 - $scope.today.getDay()));
    for (var i = 0; i < 7; i++) {
      $scope.week.push(i == 0 ? new Date($scope.weekStartDay.setDate($scope.weekStartDay.getDate() + 0)) : new Date($scope.weekStartDay.setDate($scope.weekStartDay.getDate() + 1)));
      $scope.weekChange[i] = $scope.week[i].getDate();
    }
    //日历的angular写法==============/

    $scope.NextWeek = function () {
      for (var n = 0; n < 7; n++) {
        $scope.weekChange[n] = new Date($scope.week[n].setDate($scope.week[n].getDate() + 7)).getDate();
      }
      //js写法调用切周
      //setDate(addDate(currentFirstDate, 7));
    }
    $scope.PrevWeek = function () {
      for (var m = 0; m < 7; m++) {
        $scope.weekChange[m] = new Date($scope.week[m].setDate($scope.week[m].getDate() - 7)).getDate();
      }
      //js写法调用切周
      //setDate(addDate(currentFirstDate, -7));
    }

  });
