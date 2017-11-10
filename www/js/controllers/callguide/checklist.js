angular.module('checklist.ctrl', ['guide.srv', 'client.srv'])
  .controller('ChecklistCtrl', function ($scope, guidesrv, clientsrv, $stateParams, $state) {
    //获取所有的KAItem
    guidesrv.getkaitems().then(function (items) {
      $scope.KAItems = items;
      //获取选中状态
      guidesrv.getactualdailykaitems(moment().format('YYYY-MM-DD'), $stateParams.insId).then(function (actualItems) {
        if (actualItems.length === 0) {
          guidesrv.getplandailykaitems(moment().format('YYYY-MM-DD'), $stateParams.insId).then(function (planItems) {
            for (var i = 0; i < items.length; i++) {
              $scope.KAItems[i].selected = false;
              for (var j = 0; j < planItems.length; j++) {
                if (items[i].ItemID === planItems[j].ItemID) {
                  $scope.KAItems[i].selected = true;
                }
              }
            }
          });
        }
        else {
          for (var p = 0; p < items.length; p++) {
            $scope.KAItems[p].selected = false;
            for (var q = 0; q < actualItems.length; q++) {
              if (items[p].ItemID === actualItems[q].ItemID) {
                $scope.KAItems[p].selected = true;
              }
            }
          }
        }
      });
    });

    $scope.saveChecklist = function () {
      var model = [];
      //将选中的push到model中
      for (var k = 0; k < $scope.KAItems.length; k++) {
        if ($scope.KAItems[k].selected === true) {
          model.push({
            StaffID: $stateParams.staffId,
            ActivityDate: moment().format('YYYY-MM-DD'),
            InstitutionID: $stateParams.insId,
            ItemID: $scope.KAItems[k].ItemID,
            ItemName: $scope.KAItems[k].ItemName
          });
        }
        //提交选中的item
        if (k === $scope.KAItems.length - 1) {
          // console.log(model);
          guidesrv.savekaactualitems(moment().format('YYYY-MM-DD'), $stateParams.insId, model).then(function () {
            $scope.popup("操作成功");
            $state.go("main.calldetails", {insId: $stateParams.insId});
          });
        }
      }
    };
  });
