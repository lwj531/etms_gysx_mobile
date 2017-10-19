angular.module('skusort.ctrl', [])
  .controller('SKUSortCtrl', function ($scope, $ionicListDelegate) {
    // $ionicListDelegate.$getByHandle('my-handle').showReorder(true);
    $scope.data = {
      showReorder: true
    };
    $scope.items = [];
    for(var i=0;i<100;i++){
      $scope.items.push({id:i});
    }
    $scope.moveItem = function(item, fromIndex, toIndex) {
      $scope.items.splice(fromIndex, 1);
      $scope.items.splice(toIndex, 0, item);
    };

  });
