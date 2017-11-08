angular.module('purchasesellstockcheck.ctrl', ['guide.srv','client.srv'])

  .controller('PurchasesellstockcheckCtrl', function($scope,guidesrv,clientsrv, $stateParams) {
    $scope.insID = $stateParams.insId;
    console.log($scope.insID);

    clientsrv.getcurrentstaff().then(function (staff) {
      //当前人员的信息
      $scope.staff = staff;
     console.log($scope.staff)
    });

    //获取最近的库存
    $scope.getLatestInventorys = function () {
      guidesrv.getlatestinventorys($scope.insID).then(function (data) {
        $scope.latestInventorys = data;
        console.log($scope.latestInventorys);
      });
    };
    //获取当日填写过的进销存
    $scope.getDailyInventorys = function () {
      guidesrv.getdailyinventorys($scope.insID).then(function (data) {
        $scope.dailyInventorys = data;
        console.log($scope.dailyInventorys);
      });
    };

    //初始化
    $scope.init = function () {
      $scope.getLatestInventorys();
      $scope.getDailyInventorys();
    };
    $scope.init();

    $scope.dateToday = moment();

    //保存库存
    $scope.SaveInventory=function () {

      var model=[];
      for(var i=0;i<$scope.latestInventorys,length;i++){
        model.push({
          "StaffID": $scope.staff.StaffID,
          "ActivityDate": $scope.dateToday.format('YYYY-MM-DD'),
          "InstitutionID": $scope.insID,
          "SkuID": $scope.latestInventorys[i].SkuID,
          "SkuName": $scope.latestInventorys[i].SkuName,
          "SaleIn": $scope.latestInventorys[i].SaleIn,
          "SaleOut": $scope.latestInventorys[i].SaleOut,
          "Stock": $scope.latestInventorys[i].Stock,
          "SKUPrice":$scope.latestInventorys[i].SKUPrice,
          "PositionCount": $scope.latestInventorys[i].PositionCount,
          "ProposalOrder": $scope.latestInventorys[i].ProposalOrder
        });
      }

      guidesrv.saveInventory(model).then(function () {
        $scope.popup("保存成功");
      });
    }


  });
