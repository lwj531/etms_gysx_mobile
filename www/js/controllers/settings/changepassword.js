angular.module('changepassword.ctrl', [])
  .controller('ChangePasswordCtrl', function ($scope, $timeout) {
    $scope.warningMsg = '两次输入密码不一致';
    $scope.identifyingCode = '';
    $scope.password = '';
    $scope.reenter = '';
    $scope.buttonMessage = '发送验证码';
    $scope.entireSecond = 60;
    $scope.second = $scope.entireSecond;
    $scope.setTime = function () {
      if ($scope.second > 0) {
        $scope.buttonMessage = $scope.second + '秒后重新发送';
        $scope.second--;
        $timeout(function () {
          $scope.setTime();
        }, 1000);
      }
      else if ($scope.second == 0) {
        $scope.second = $scope.entireSecond;
        $scope.buttonMessage = '发送验证码';
      }
    }
  });
