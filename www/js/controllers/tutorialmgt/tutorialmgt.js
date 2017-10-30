angular.module('tutorialmgt.ctrl', [])
  .controller('TutorialMgtCtrl', function ($scope,$ionicPopup) {

//签名弹框
    $scope.signBox = function () {
      var signPopup = $ionicPopup.show({
        cssClass: 'sign-alert',
        templateUrl: 'templates/tutorialmgt/signatrue.html',
        title: '',
        scope: $scope
      });
      signPopup.then(function (res) {
        console.log('Tapped Actual!', res);
      });
      $scope.closeSign=function () {
        signPopup.close();
      };
    };
  });
