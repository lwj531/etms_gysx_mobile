angular.module('calloverview.ctrl', ['guide.srv'])
  .controller('CalloverviewCtrl', function($scope,$stateParams,guidesrv) {

    console.log($stateParams.insId);
    console.log($stateParams.staffId);

    //获取当天填写进销存
    guidesrv.getdailyinventorys($stateParams.insId).then(function (dailySKU) {
      $scope.SKUList = dailySKU;

    });



  });
