angular.module('skusort.ctrl', [])
  .controller('SKUSortCtrl', function ($scope, $ionicListDelegate) {
    $ionicListDelegate.$getByHandle('my-handle').showReorder(true);

  });
