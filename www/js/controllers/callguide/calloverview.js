angular.module('calloverview.ctrl', ['guide.srv'])
  .controller('CalloverviewCtrl', function($scope,$stateParams,guidesrv) {

    console.log($stateParams.insId);

    clientsrv.getcurrentstaff().then(function (staff) {
      //当前人员的信息
      $scope.staff = staff;
      console.log($scope.staff);
    });

    //获取当天填写进销存
    guidesrv.getdailyinventorys($stateParams.insId).then(function (dailySKU) {
      $scope.SKUList = dailySKU;

    });



  });
