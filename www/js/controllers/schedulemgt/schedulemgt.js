angular.module('schedulemgt.ctrl', [])
  .controller('ScheduleMgtCtrl', function ($scope) {
    $scope.week = [];
    //当前周
    var cells = document.getElementById('week-day').getElementsByTagName('li');
    //周长度
    var clen = cells.length;
    console.log(clen);
    //当前周的第一天
    var currentFirstDate;
    //new两个当天
    var myDate = new Date();
    var etDate = new Date();
    //当前天的日期的日
    today = myDate.getDate();
    console.log(today);
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


    $scope.weekChange = [];
    $scope.today = new Date();
    $scope.changeDay = new Date();
    $scope.weekStartDay = new Date($scope.changeDay.setDate($scope.today.getDate() - $scope.today.getDay()));
    $scope.weekEndDay = new Date($scope.changeDay.setDate($scope.today.getDate() + 7 - $scope.today.getDay()));
    console.log($scope.today.getDay() + '==today');
    console.log($scope.weekStartDay + '==weekStart');
    console.log(new Date($scope.weekEndDay) + '==weekEnd');
    for (var i = 0; i < 7; i++) {
      $scope.week.push(new Date($scope.weekStartDay.setDate($scope.weekStartDay.getDate() + 1)));
      console.log($scope.week);
    }


    $scope.NextWeek = function () {
      for (var n = 0; n < 7; n++) {
        $scope.weekChange[n] = new Date($scope.week[n].setDate($scope.week[n].getDate() + 7));
      }
      setDate(addDate(currentFirstDate, 7));
      console.log('NextWeek');
      console.log($scope.weekChange);
    }
    $scope.PrevWeek = function () {
      for (var m = 0; m < 7; m++) {
        $scope.weekChange[m] = new Date($scope.week[m].setDate($scope.week[m].getDate() - 7));
      }
      setDate(addDate(currentFirstDate, -7));
      console.log('PrevWeek');
      console.log($scope.weekChange);
    }

  });
