angular.module('skusort.ctrl', ['client.srv'])
  .controller('SKUSortCtrl', function ($scope,$rootScope, $stateParams,clientsrv) {
    $scope.skuModels = [];
    //获取门店的SKUS
    clientsrv.getskus($stateParams.insId).then(function (data) {
      $scope.skuModels = data;
    });
    //拖动排序的回调函数
    $scope.moveRoute = function (arr, item, fromIndex, toIndex) {
      arr.splice(fromIndex, 1);
      arr.splice(toIndex, 0, item);
    };
    //保存
    $scope.save=function(){
      var model ={
        InstitutionID:$stateParams.insId,
        Skus:$scope.skuModels
      }
      clientsrv.saveSkuSort(model).then(function (status) {
        if (status) {
          $rootScope.popup("操作成功");
        } else {
          $rootScope.popup("操作失败");
        }
      });
    }


  });
