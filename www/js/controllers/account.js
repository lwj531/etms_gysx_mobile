angular.module('account.ctrl', ['account.srv'])
  .controller('AccountCtrl', function ($scope, $state, accountsrv) {
    $scope.loginData = {};
    //登陆
    $scope.signin = function () {
      var loginmodel ={
        AppId:$scope.loginData.AppId,
        Random:toolkit.getrandomnumbers(),
        TimeStamp:toolkit.gettimeStamp()
      };
      var haspassword = toolkit.SHA256($scope.loginData.Password);
      loginmodel.Signature=toolkit.SHA256(loginmodel.Random+loginmodel.TimeStamp+haspassword);
      accountsrv.signin(loginmodel).then(function (token) {
        console.log(token);
        localStorage.token = token;
        localStorage.appid = loginmodel.AppId;
        $state.go("main.home");
      });
    };
  });
