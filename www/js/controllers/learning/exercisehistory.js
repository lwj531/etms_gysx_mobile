angular.module('exercisehistory.ctrl', [])
  .controller('ExerciseHistoryCtrl', function ($scope) {

    //中文周数组
    $scope.ChineseWeek = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    //假装有答题数据
    $scope.examination = ['has-correct', 'has-wrong', 'has-correct', 'has-correct', 'has-wrong', ' ', ' '];

    //日历的angular写法--------------/
    $scope.week = [];
    $scope.weekChange = [];
    $scope.today = new Date();
    $scope.changeDay = new Date();
    $scope.weekStartDay = new Date($scope.changeDay.setDate($scope.today.getDate() + 1 - $scope.today.getDay()));
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
