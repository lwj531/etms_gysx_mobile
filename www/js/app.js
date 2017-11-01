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
            template: '尚未登陆'
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
      //日程管理
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
      //客户管理
      .state('main.clientmgt', {
        url: '/clientmgt',
        templateUrl: "templates/clientmgt/clientmgt.html",
        controller: "ClientMgtCtrl"
      })
      //拜访向导
      .state('main.callguide', {
        url: '/callguide',
        templateUrl: "templates/callguide/callguide.html",
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
      })
      //(拜访)签入
      .state('main.checkin', {
          url: '/checkin',
          templateUrl: "templates/callguide/checkin.html",
          controller: "CheckinCtrl"
        })
      //(拜访)签入机构后的拜访向导
      .state('main.calldetails', {
          url: '/calldetails',
          templateUrl: "templates/callguide/calldetails.html",
          controller: "CalldetailsCtrl"
        })
      //进销存检查
      .state('main.purchasesellstockcheck', {
          url: '/purchasesellstockcheck',
          templateUrl: "templates/callguide/purchasesellstockcheck.html",
          controller: "PurchasesellstockcheckCtrl"
        })
      //生意回顾
      .state('main.businessreview', {
          url: '/businessreview',
          templateUrl: "templates/callguide/businessreview.html",
          controller: "BusinessreviewCtrl"
        })
      //checklist
      .state('main.checklist', {
          url: '/checklist',
          templateUrl: "templates/callguide/checklist.html",
          controller: "ChecklistCtrl"
        })
      //疾病知识教育
      .state('main.diseaseknwoledgeeducate', {
          url: '/diseaseknwoledgeeducate',
          templateUrl: "templates/callguide/diseaseknwoledgeeducate.html",
          controller: "DiseaseknwoledgeeducateCtrl"
        })
      //培训记录
      .state('main.trainingrecord', {
          url: '/trainingrecord',
          templateUrl: "templates/callguide/trainingrecord.html",
          controller: "TrainingrecordCtrl"
        })
      //待办事项
      .state('main.todolist', {
          url: '/todolist',
          templateUrl: "templates/callguide/todolist.html",
          controller: "TodolistCtrl"
        })
      //生动化教育(做题)
      .state('main.vivideducate', {
        url: '/vivideducate',
        templateUrl: "templates/callguide/vivideducate.html",
        controller: "VivideducateCtrl"
      })
      //拜访概览
      .state('main.calloverview', {
        url: '/calloverview',
        templateUrl: "templates/callguide/calloverview.html",
        controller: "CalloverviewCtrl"
      })
      //(拜访)签出
      .state('main.checkout', {
        url: '/checkout',
        templateUrl: "templates/callguide/checkout.html",
        controller: "CheckoutCtrl"
      })
      //查看某一个产品的所有资料
      .state('main.allmaterialbysku', {
        url: '/allmaterialbysku',
        templateUrl: "templates/callguide/allmaterialbysku.html",
        controller: "AllmaterialbyskuCtrl"
      })
      //附近药店
      .state('main.storenearby', {
        url: '/storenearby',
        templateUrl: "templates/storenearby/storenearby.html",
        controller: "StorenearbyCtrl"
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
      return $q.reject(rejection);
    }
  }
};

