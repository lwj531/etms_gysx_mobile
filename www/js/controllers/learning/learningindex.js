angular.module('learningindex.ctrl', [])
  .controller('LearningIndexCtrl', function ($scope, $ionicPopup) {

    //每日一题弹框
    $scope.dailyExercise = function () {
      $scope.exercise = {
        question: '请问糖尿病前期不会导致下列哪种情况？',
        answers: [
          {
            isCorrect:true,
            isSelected: false,
            content: 'A、成为2型糖尿病患者的风险增加的风险增加'
          },
          {
            isCorrect:false,
            isSelected: true,
            content: 'A、成为2型糖尿病患者的风险增加的风险增加'
          },
          {
            isCorrect:false,
            isSelected: false,
            content: 'A、成为2型糖尿病患者的风险增加的风险增加'
          },
          {
            isCorrect:false,
            isSelected: false,
            content: 'A、成为2型糖尿病患者的风险增加的风险增加'
          }]
      };
      //每日一题选择radio
      $scope.radioSelected=function (itemIdx) {
        $scope.idx=itemIdx;
      }
      var exercisePopup = $ionicPopup.show({
        cssClass: 'exercise-alert',
        templateUrl: 'templates/learning/dailyexercise.html',
        title: '',
        scope: $scope
      });
      exercisePopup.then(function (res) {
        console.log('Tapped Actual!', res);
      });
      $scope.closeExercise=function () {
        exercisePopup.close();
      };
    };
  });
