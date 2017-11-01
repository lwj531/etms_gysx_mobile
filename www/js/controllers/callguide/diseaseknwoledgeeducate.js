angular.module('diseaseknwoledgeeducate.ctrl', [])

  .controller('DiseaseknwoledgeeducateCtrl', function($scope,$ionicPopup) {
      $scope.selectaboutdoc = function(){
       $(".slt-doc-blackshadow").show();
       $(".slt-doc-tc-div").fadeIn(300);
      };
      $scope.closesltdoc = function(){
        $(".slt-doc-blackshadow").hide();
        $(".slt-doc-tc-div").fadeOut(300);
      };
      $scope.chooesinfobysku = function(){
        $(".classify-by-sku").addClass("info-classify-li-active");
        $(".classify-by-use").removeClass("info-classify-li-active");
        $(".all-zl-content-bysku").show();
        $(".all-zl-content-byuse").hide();
      };
      $scope.chooesinfobyuse = function(){
        $(".classify-by-use").addClass("info-classify-li-active");
        $(".classify-by-sku").removeClass("info-classify-li-active");
        $(".all-zl-content-bysku").hide();
        $(".all-zl-content-byuse").show();
      };
      $scope.vivideducate = function(){
        event.cancelBubble = true;
        $(".slt-doc-blackshadow").show();
        $(".slt-sdhdx-tc-div").fadeIn(300);
      };
      $scope.closesltdx = function(){
        $(".slt-doc-blackshadow").hide();
        $(".slt-sdhdx-tc-div").fadeOut(300);
      }
  });
