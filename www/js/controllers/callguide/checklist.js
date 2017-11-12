angular.module('checklist.ctrl', ['guide.srv', 'client.srv'])
  .controller('ChecklistCtrl', function ($scope, guidesrv, clientsrv, $stateParams, $state) {
    console.log($stateParams.insId);
    clientsrv.getcurrentstaff().then(function (staff) {
      //当前人员的信息
      $scope.staff = staff;
      console.log($scope.staff);
    });

    //获取所有的KAItem
    guidesrv.getkaitems().then(function (items) {
      $scope.KAItems = items;
      //获取实际选择过的
      guidesrv.getactualdailykaitems(moment().format('YYYY-MM-DD'), $stateParams.insId).then(function (actualItems) {
        console.log(actualItems);
        //标记出计划中的
        guidesrv.getplandailykaitems(moment().format('YYYY-MM-DD'), $stateParams.insId).then(function (planItems) {
          console.log(planItems);
          for (var i = 0; i < items.length; i++) {
            $scope.KAItems[i].isPlan = false;
            for (var j = 0; j < planItems.length; j++) {
              if (items[i].ItemID === planItems[j].ItemID) {
                $scope.KAItems[i].isPlan = true;
              }
            }
          }
        });
        console.log(actualItems);
        //获取实际选中状态
        for (var p = 0; p < items.length; p++) {
          $scope.KAItems[p].selected = false;
          for (var q = 0; q < actualItems.length; q++) {
            if (items[p].ItemID === actualItems[q].ItemID) {
              $scope.KAItems[p].selected = true;
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
            StaffID: $scope.staff.StaffId,
            ActivityDate: moment().format('YYYY-MM-DD'),
            InstitutionID: $stateParams.insId,
            ItemID: $scope.KAItems[k].ItemID,
            ItemName: $scope.KAItems[k].ItemName
          });
        }
        //提交选中的item
        if (k === $scope.KAItems.length - 1) {
          console.log(model);
          guidesrv.savekaactualitems(moment().format('YYYY-MM-DD'), $stateParams.insId, model).then(function () {
            $scope.popup("操作成功");
            $state.go("main.calldetails", {insId: $stateParams.insId});
          });
        }
      }
    };
  });
