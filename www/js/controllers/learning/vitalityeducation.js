angular.module('vitalityeducation.ctrl', [])
  .controller('VitalityEducationCtrl', function ($scope,$ionicPopup) {
    //随机颜色值
    $scope.randomColor = function () {
      var rgbColor = Math.floor(Math.random() * (255 - 199 + 1) + 199);
      return rgbColor;
    };
    //生成颜色
    $scope.generateColor = function () {
      return 'rgb(' + $scope.randomColor() + ',' + $scope.randomColor() + ',' + $scope.randomColor() + ')'
    };
    $scope.questionList = [
      {title: '请问糖尿病前期不会导致下列哪种情况请问糖尿病前期不会导致下列哪种情况？', color: $scope.generateColor()},
      {title: '请问糖尿病前期不会导致下列哪种情况？', color: $scope.generateColor()},
      {title: '请问糖尿病前期不会导致下列哪种情况？', color: $scope.generateColor()},
      {title: '请问糖尿病前期不会导致下列哪种情况？', color: $scope.generateColor()},
      {title: '请问糖尿病前期不会导致下列哪种情况？', color: $scope.generateColor()},
      {title: '请问糖尿病前期不会导致下列哪种情况？', color: $scope.generateColor()},
      {title: '请问糖尿病前期不会导致下列哪种情况？', color: $scope.generateColor()},
      {title: '请问糖尿病前期不会导致下列哪种情况？', color: $scope.generateColor()},
      {title: '请问糖尿病前期不会导致下列哪种情况？', color: $scope.generateColor()},
      {title: '请问糖尿病前期不会导致下列哪种情况？', color: $scope.generateColor()}
    ];
    $scope.answersList = [
      {content: '成为11型糖尿病患者的风险增加的风险增加'},
      {content: '成为12型糖尿病患者的风险增加的风险增加'},
      {content: '成为21型糖尿病患者的风险增加的风险增加'},
      {content: '成为31型糖尿病患者的风险增加的风险增加'},
      {content: '成为14型糖尿病患者的风险增加的风险增加'},
      {content: '成为15型糖尿病患者的风险增加的风险增加'},
      {content: '成为y1型糖尿病患者的风险增加的风险增加'},
      {content: '成为y1型糖尿病患者的风险增加的风险增加'},
      {content: '成为y1型糖尿病患者的风险增加的风险增加'},
      {content: '成为j1型糖尿病患者的风险增加的风险增加'}
    ];

    //提交结果弹框
    $scope.vdResult = function () {
      var resultPopup = $ionicPopup.show({
        cssClass: 'exercise-alert',
        templateUrl: 'templates/learning/vdresult.html',
        title: '',
        scope: $scope
      });
      resultPopup.then(function (res) {
        console.log('Tapped Actual!', res);
      });
      $scope.closeResult=function () {
        resultPopup.close();
      };
    };

    //拖动排序的回调函数，暂时没用
    $scope.moveAnswer = function (item, fromIndex, toIndex) {
      $scope.answersList.splice(fromIndex, 1);
      $scope.answersList.splice(toIndex, 0, item);
    };
    var ox, oy;
    $scope.onTouch = function ($event) {
      console.log('onTouch');
      ox = $event.target.offsetLeft;
      oy = $event.target.offsetTop;
    };
    $scope.onDrag = function ($event) {
      var el = $event.target,
        dx = $event.gesture.deltaX,
        dy = $event.gesture.deltaY;
      //el.style.left = ox + dx + "px";
      el.style.top = oy + dy + "px";
      console.log('x = ' + el.style.left + " ; y = " + el.style.top);
      console.log('dx = ' + dx + " ; dy = " + dy);

      $scope.imgStyle = {
        'position': 'absolute',
        'top': el.style.top,
      }
    };

  });
