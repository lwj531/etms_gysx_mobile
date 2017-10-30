angular.module('account.ctrl', ['account.srv'])
  .controller('AccountCtrl', function ($scope, $state, $ionicModal,$timeout, accountsrv) {
    //已存放的手势密码
    if (localStorage.cipher == null) {
      $scope.cipherinfo = "请设置手势密码";
    } else {
      $scope.cipherinfo = "手势密码登录";
    }
    //设置手势密码
    $scope.settingcipher = function (str) {
      //判断当前临时密码位数
      if (str == null || str.length < 4) {
        $scope.cipherinfo = "密码位数至少4位数";
        $scope.lock.error();
        $timeout(function(){  $scope.lock.reset();},1000);
      } else {
        ////如果已经设置了密码判断是否可以正常登录
        if (localStorage.cipher != null) {
          if (localStorage.cipher == str) {
            //通过验证关闭modal
            $scope.cipherinfo = "手势密码登录";
            $scope.modal.hide();
            $scope.modal.remove();
            $state.go("main.home");
          } else {
            $scope.cipherinfo = "密码错误";
            $scope.lock.error();
            $timeout(function(){  $scope.lock.reset();},1000);
          }
        } else {
          //临时存放的手势
          if ($scope.currentcipher == null) {
            $scope.currentcipher = str;
            $scope.cipherinfo = "请再次绘制密码";
            $scope.lock.reset();
          } else {
            if (str == $scope.currentcipher) {
              localStorage.cipher = str;
              //通过验证关闭modal
              $scope.cipherinfo = "手势密码登录";
              $scope.modal.hide();
              $scope.modal.remove();
              $state.go("main.home");
            } else {
              //两次密码不正确
              $scope.cipherinfo = "两次密码不正确";
              $scope.currentcipher=null;
              $scope.lock.error();
              $timeout(function(){  $scope.lock.reset();},1000);
            }
          }
        }
      }
      $scope.$apply();
    }
    //手势密码Model
    $ionicModal.fromTemplateUrl('templates/modal/gesture.html', {
      scope: $scope,
      animation: 'slide-in-up',
      hardwareBackButtonClose: false
    }).then(function (modal) {
      $scope.modal = modal;
      //如果包含手势密码，直接显示手势密码
      if (localStorage.cipher != null) {
        $scope.showcipher();
      }
    });
    //测试登陆用
    $scope.roules =[
      {Name:'AE',UserId:18521734092,Password:123456},
      {Name:'CCR',UserId:18521734007,Password:123456}
      ];
    //测试登陆用
    $scope.selectroute =function(item){
      $scope.loginData = item;
    };
    $scope.loginData = {
      UserId:"",
      Password:""
    };
    //显示手势密码
    $scope.showcipher = function () {
      $scope.modal.show();
      $scope.lock = new PatternLock('#patternHolder', {
        onDraw: function (pattern) {
          $scope.settingcipher(pattern);
        },
        lineOnMove: false
      });
    };
    //登陆
    $scope.signin = function () {
      var loginmodel = {
        UserId: $scope.loginData.UserId,
        Random: toolkit.getrandomnumbers(),
        TimeStamp: toolkit.gettimeStamp(),
        LoginType: "Ionic"
      };
      var haspassword = toolkit.SHA256("Softium_" + $scope.loginData.Password).toUpperCase();
      loginmodel.Signature = toolkit.SHA256(loginmodel.Random + loginmodel.TimeStamp + haspassword);
      accountsrv.signin(loginmodel, true).then(function (token) {
        console.log(token);
        localStorage.token = token;
        localStorage.userid = loginmodel.UserId;
        //如果没有设置手势密码，弹出设置框
        if (localStorage.cipher == null) {
          $scope.showcipher();
        }
      });
    };
    //清空缓存
    $scope.clear=function(){
      localStorage.clear();
      alert("clear")
    }

  });
