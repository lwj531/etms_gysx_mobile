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
      //日程管理(测试)
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
      //日程管理编辑路线
      .state('main.editroute', {
        url: '/editroute/:lineId/:activityDate',
        templateUrl: "templates/schedulemgt/editroute.html",
        controller: "EditRouteCtrl"
      })
      //日程管理计划报告
      .state('main.planreport', {
        url: '/planreport',
        templateUrl: "templates/schedulemgt/planreport.html",
        controller: "PlanReportCtrl"
      })
      //日程管理半天事务审批
      .state('main.halfdayapproval', {
        url: '/halfdayapproval',
        templateUrl: "templates/schedulemgt/halfdayapproval.html",
        controller: "HalfDayApprovalCtrl"
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
        controller: "InsDetailCtrl",
        cache: false
      })
      //SKU排序
      .state('main.skusort', {
        url: '/skusort/:insId',
        templateUrl: "templates/clientmgt/skusort.html",
        controller: "SKUSortCtrl"
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
        controller: "RouteSettingCtrl",
        cache: false
      })
      //知识资料库
      .state('main.learningindex', {
        url: '/learningindex',
        templateUrl: "templates/learning/learningindex.html",
        controller: "LearningIndexCtrl"
      })
      //按产品内容筛选
      .state('main.materialexpand', {
        url: '/materialexpand',
        templateUrl: "templates/learning/materialexpand.html",
        controller: "MaterialExpandCtrl"
      })
      //积分排行
      .state('main.pointsrank', {
        url: '/pointsrank',
        templateUrl: "templates/learning/pointsrank.html",
        controller: "PointsRankCtrl"
      })
      //答题历史
      .state('main.exercisehistory', {
        url: '/exercisehistory',
        templateUrl: "templates/learning/exercisehistory.html",
        controller: "ExerciseHistoryCtrl"
      })
      //疾病知识教育
      .state('main.diseaseknowledge', {
        url: '/diseaseknowledge',
        templateUrl: "templates/learning/diseaseknowledge.html",
        controller: "DiseaseKnowledgeCtrl"
      })
      //生动化教育
      .state('main.vitalityeducation', {
        url: '/vitalityeducation',
        templateUrl: "templates/learning/vitalityeducation.html",
        controller: "VitalityEducationCtrl"
      })
      //辅导下属
      .state('main.tutorialindex', {
        url: '/tutorialindex',
        templateUrl: "templates/tutorial/tutorialindex.html",
        controller: "TutorialIndexCtrl"
      })
      //拜访流程
      .state('main.callprocedure', {
        url: '/callprocedure',
        templateUrl: "templates/tutorial/callprocedure.html",
        controller: "CallProcedureCtrl"
      })
      //拜访流程
      .state('main.callprocedurestep2', {
        url: '/callprocedurestep2',
        templateUrl: "templates/tutorial/callprocedurestep2.html",
        controller: "CallProcedureStep2Ctrl"
      })
      //辅导签到
      .state('main.coachingcall', {
        url: '/coachingcall',
        templateUrl: "templates/tutorial/coachingcall.html",
        controller: "CoachingCallCtrl"
      })
      //辅导签到签到
      .state('main.tutorialcheckin', {
        url: '/tutorialcheckin',
        templateUrl: "templates/tutorial/tutorialcheckin.html",
        controller: "TutorialCheckInCtrl"
      })
      //辅导记录
      .state('main.tutorialmgt', {
        url: '/tutorialmgt',
        templateUrl: "templates/tutorialmgt/tutorialmgt.html",
        controller: "TutorialMgtCtrl"
      })
      //系统设置
      .state('main.settings', {
        url: '/settings',
        templateUrl: "templates/settings/settings.html",
        controller: "SettingsCtrl"
      })
      //关于
      .state('main.about', {
        url: '/about',
        templateUrl: "templates/settings/about.html",
        controller: "AboutCtrl"
      })
      //修改登录密码
      .state('main.changepassword', {
        url: '/changepassword',
        templateUrl: "templates/settings/changepassword.html",
        controller: "ChangePasswordCtrl"
      })
      .state('carinfo', {
        url: '/carinfo',
        templateUrl: "templates/carinfo.html",
        controller: "CarCtrl"
      })
      //(拜访)签入
      .state('main.checkin', {
          url: '/checkin/:insId',
          templateUrl: "templates/callguide/checkin.html",
          controller: "CheckinCtrl"
        })
      //(拜访)签入机构后的拜访向导
      .state('main.calldetails', {
          url: '/calldetails/:insId',
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
      //资料详情
      .state('main.materialdetail', {
        url: '/materialdetail',
        templateUrl: "templates/callguide/materialdetail.html",
        controller: "MaterialDetailCtrl"
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
      //拜访概览
      .state('main.calloverview', {
        url: '/calloverview',
        templateUrl: "templates/callguide/calloverview.html",
        controller: "CalloverviewCtrl"
      })
      //(拜访)签出
      .state('main.checkout', {
        url: '/checkout/:insId',
        templateUrl: "templates/callguide/checkout.html",
        controller: "CheckoutCtrl"
      })
      //附近药店
      .state('main.storenearby', {
        url: '/storenearby',
        templateUrl: "templates/storenearby/storenearby.html",
        controller: "StorenearbyCtrl"
      })
      //(拜访)签入
      .state('main.aecheckin', {
        url: '/aecheckin',
        templateUrl: "templates/storenearby/checkin.html",
        controller: "aeCheckinCtrl"
      })
      //(拜访)签入机构后的拜访向导
      .state('main.aecalldetails', {
        url: '/aecalldetails',
        templateUrl: "templates/storenearby/calldetails.html",
        controller: "aeCalldetailsCtrl"
      })
      //进销存检查
      .state('main.aepurchasesellstockcheck', {
        url: '/aepurchasesellstockcheck',
        templateUrl: "templates/storenearby/purchasesellstockcheck.html",
        controller: "aePurchasesellstockcheckCtrl"
      })
      //生意回顾
      .state('main.aebusinessreview', {
        url: '/aebusinessreview',
        templateUrl: "templates/storenearby/businessreview.html",
        controller: "aeBusinessreviewCtrl"
      })
      //checklist
      .state('main.aechecklist', {
        url: '/aechecklist',
        templateUrl: "templates/storenearby/checklist.html",
        controller: "aeChecklistCtrl"
      })
      //疾病知识教育
      .state('main.aediseaseknwoledgeeducate', {
        url: '/aediseaseknwoledgeeducate',
        templateUrl: "templates/storenearby/diseaseknwoledgeeducate.html",
        controller: "aeDiseaseknwoledgeeducateCtrl"
      })
      //资料详情
      .state('main.aematerialdetail', {
        url: '/aematerialdetail',
        templateUrl: "templates/storenearby/materialdetail.html",
        controller: "aeMaterialDetailCtrl"
      })
      //培训记录
      .state('main.aetrainingrecord', {
        url: '/aetrainingrecord',
        templateUrl: "templates/storenearby/trainingrecord.html",
        controller: "aeTrainingrecordCtrl"
      })
      //待办事项
      .state('main.aetodolist', {
        url: '/aetodolist',
        templateUrl: "templates/storenearby/todolist.html",
        controller: "aeTodolistCtrl"
      })
      //拜访概览
      .state('main.aecalloverview', {
        url: '/aecalloverview',
        templateUrl: "templates/storenearby/calloverview.html",
        controller: "aeCalloverviewCtrl"
      })
      //(拜访)签出
      .state('main.aecheckout', {
        url: '/aecheckout',
        templateUrl: "templates/storenearby/checkout.html",
        controller: "aeCheckoutCtrl"
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

