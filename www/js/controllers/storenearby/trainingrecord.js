angular.module('aetrainingrecord.ctrl', ['ionic','trainingrecord.srv'])

  .controller('aeTrainingrecordCtrl', function($scope,trainingrecordsrv) {
    //获取培训对象
   /* $scope.gettrainobjects = function () {
      trainingrecordsrv.gettrainobjects().then(function (data) {
        $scope.trainobjects = data;
      });
    };*/

    //初始化
    $scope.init = function () {
     // $scope.gettrainobjects();
    };
    $scope.init();
  });
