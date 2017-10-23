// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'route','ngCordova'])

  .run(function ($ionicPlatform, $rootScope, $state, $ionicPopup) {
    $ionicPlatform.ready(function () {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

        // Don't remove this line unless you know what you are doing. It stops the viewport
        // from snapping when text inputs are focused. Ionic handles this internally for
        // a much nicer keyboard experience.
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
      //如果未登录
      $rootScope.$on('userIntercepted', function (errorType,data) {
        if(data=="notLogin"){
          $ionicPopup.alert({
            title: '提示',
            template: '尚未登录'
          }).then(function(res) {
            $state.go("app");
          });
        }
        if(data=="loginfailed"){
          $ionicPopup.alert({
            title: '提示',
            template: '用户名或密码错误'
          });
        }
      });
      //系统错误
      $rootScope.$on('systemerror', function (errorType, data) {
        $ionicPopup.alert({
          title: '提示',
          template: '系统故障'
        });
      });
    });
  })
  .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider
      .state('app', {
        url: '/app',
        templateUrl: "templates/signin.html",
        controller: "AccountCtrl"
      })
      .state('main', {
        url: '/main',
        templateUrl: "templates/main.html",
        controller: "MainCtrl"
      })
      //首页
      .state('main.home', {
        url: '/home',
        templateUrl: "templates/home/home.html",
        controller: "HomeCtrl"
      })
      //消息通知
      .state('main.msgcenter', {
        url: '/msgcenter',
        templateUrl: "templates/home/msgcenter.html",
        controller: "MsgcenterCtrl"
      })
      //日程管理
      .state('main.dailymgt', {
        url: '/dailymgt',
        templateUrl: "templates/dailymgt.html",
        controller: "DailyMgtCtrl"
      })
      //日程管理
      .state('main.schedulemgt', {
        url: '/schedulemgt',
        templateUrl: "templates/schedulemgt/schedulemgt.html",
        controller: "ScheduleMgtCtrl"
      })
      //客户管理
      .state('main.clientmgt', {
        url: '/clientmgt',
        templateUrl: "templates/clientmgt/clientmgt.html",
        controller: "ClientMgtCtrl"
      })
      //机构详情
      .state('main.insdetail', {
        url: '/insdetail/:insId',
        templateUrl: "templates/clientmgt/insdetail.html",
        controller: "InsDetailCtrl"
      })
      //编辑客户
      .state('main.clientedit', {
        url: '/clientedit',
        templateUrl: "templates/clientmgt/clientedit.html",
        controller: "ClientEditCtrl"
      })
      //SKU排序
      .state('main.skusort', {
        url: '/skusort',
        templateUrl: "templates/clientmgt/skusort.html",
        controller: "SKUSortCtrl"
      })
      //拜访向导
      .state('main.callguide', {
        url: '/callguide',
        templateUrl: "templates/callguide.html",
        controller: "CallGuideCtrl"
      })
      //路线设定
      .state('main.routesetting', {
        url: '/routesetting',
        templateUrl: "templates/routesetting/routesetting.html",
        controller: "RouteSettingCtrl"
      })
      .state('carinfo', {
        url: '/carinfo',
        templateUrl: "templates/carinfo.html",
        controller: "CarCtrl"
      });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app');
    $httpProvider.interceptors.push(interceptor);
  });
var interceptor = function ($q, $rootScope) {
  return {
    request: function (config) {
      //设置统一的请求头
      config.headers = config.headers || {};
      var random = toolkit.getrandomnumbers();
      var timeStamp = toolkit.gettimeStamp();
      var str = localStorage.userid + "." + random + "." + timeStamp + "." + toolkit.SHA256(random + timeStamp + localStorage.token);
      config.headers.authorization = "Basic " + toolkit.Base64Encryption(str);
      return config;
    },
    response: function (result) {
      return result;
    },
    responseError: function (rejection) {
      //未经授权
      if (rejection.status == 403) {
        $rootScope.$broadcast("userIntercepted", "notLogin", rejection);
      }
      //登陆失败
      if (rejection.status == 401) {
        $rootScope.$broadcast("userIntercepted", "loginfailed", rejection);
      }
      //500
      if (rejection.status == 500) {
        $rootScope.$broadcast("systemerror", "systemerror", rejection);
      }
      return $q.reject(rejection);
    }
  }
};

