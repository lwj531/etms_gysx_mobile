angular.module('diseaseknwoledgeeducate.ctrl', [])

  .controller('DiseaseknwoledgeeducateCtrl', function($scope,$ionicPopup) {
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
//资料弹出框
    $scope.showMaterial = function () {
      $scope.materialList = [
        {name: '额我就', selected: false},
        {name: '士大夫', selected: false}
      ];
      var materialAlert = $ionicPopup.show({
        cssClass: 'vitality-alert',
        templateUrl: 'templates/callguide/materialalert.html',
        title: '',
        scope: $scope

      });
      materialAlert.then(function (res) {
        console.log('Tapped Actual!', res);
      });

      $scope.closematerial = function () {
        materialAlert.close();
      };
    };

    // $scope.selectaboutdoc = function(){
      //  $(".slt-doc-blackshadow").show();
      //  $(".slt-doc-tc-div").fadeIn(300);
      // };
      // $scope.closesltdoc = function(){
      //   $(".slt-doc-blackshadow").hide();
      //   $(".slt-doc-tc-div").fadeOut(300);
      // };
      // $scope.chooesinfobysku = function(){
      //   $(".classify-by-sku").addClass("info-classify-li-active");
      //   $(".classify-by-use").removeClass("info-classify-li-active");
      //   $(".all-zl-content-bysku").show();
      //   $(".all-zl-content-byuse").hide();
      // };
      // $scope.chooesinfobyuse = function(){
      //   $(".classify-by-use").addClass("info-classify-li-active");
      //   $(".classify-by-sku").removeClass("info-classify-li-active");
      //   $(".all-zl-content-bysku").hide();
      //   $(".all-zl-content-byuse").show();
      // };
      // $scope.vivideducate = function(){
      //   event.cancelBubble = true;
      //   $(".slt-doc-blackshadow").show();
      //   $(".slt-sdhdx-tc-div").fadeIn(300);
      // };
      // $scope.closesltdx = function(){
      //   $(".slt-doc-blackshadow").hide();
      //   $(".slt-sdhdx-tc-div").fadeOut(300);
      // }
  });
