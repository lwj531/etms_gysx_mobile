angular.module('materialdetail.ctrl', [])
  .controller('MaterialDetailCtrl', function($scope,$ionicPopup) {
//生动化教育弹出框
    $scope.showVitality = function () {
      $scope.vitalityList = [
        {name: '额我就', selected: false},
        {name: '士大夫', selected: false}
      ];
      var vitalityAlert = $ionicPopup.show({
        cssClass: 'vitality-alert',
        templateUrl: 'templates/callguide/vitalityedu.html',
        title: '',
        scope: $scope

      });
      vitalityAlert.then(function (res) {
        console.log('Tapped Actual!', res);
      });

      $scope.closeVitality = function () {
        vitalityAlert.close();
      };
    };
    //弹框中切换到选择医师列表
    $scope.childListShow=false;
    $scope.slideToChild=function () {
      $scope.childListShow=true;

    };
    //弹框切回资料页面
    $scope.backToParent = function () {
      $scope.childListShow = false;
    };
    //下方资料tab
    $scope.tabs=[
      {name:'按产品',code:'byprod'},
      {name:'按用途',code:'byuse'}
    ];
    $scope.currTab=$scope.tabs[0];
    $scope.SwitchTab=function (tab) {
      $scope.currTab=tab;
    };
    //选择医师
    $scope.drList=[];
    for(var i=0;i<20;i++){
      $scope.drList.push({name:'王王'});
    };
    $scope.currDr;
    $scope.selectedDr=function (idx) {
      $scope.currDr=idx;
    }

  });
