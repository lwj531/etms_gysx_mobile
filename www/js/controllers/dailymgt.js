angular.module('dailymgt.ctrl', [])
  .controller('DailyMgtCtrl', function ($scope) {
    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
      $scope.state = "";
      //开始录音
      $scope.start =function(){
        media = new Media(toolkit.getrandomnumbers()+".mp3", function(){
        }, function(){
        });
        $scope.state="录音中";
        media.startRecord();
      };
      //结束录音
      $scope.end =function(){
        media.stopRecord();
        $scope.state="结束录音";
      };

    }

  });
