angular.module('dailymgt.ctrl', [])
  .controller('DailyMgtCtrl', function ($scope) {
    /*var map = new AMap.Map('testmap', {
      mapStyle: 'amap://styles/32a5b7b6f1d01ee025207844301cacae'//样式URL
    });*/


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

    };

    // 下拉刷新
    $scope.doRefresh= function(){
      $scope.$broadcast('scroll.refreshComplete');
    }

  });
