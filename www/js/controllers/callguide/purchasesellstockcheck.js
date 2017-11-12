angular.module('purchasesellstockcheck.ctrl', ['guide.srv', 'client.srv'])

  .controller('PurchasesellstockcheckCtrl', function ($scope, guidesrv, clientsrv, $state, $stateParams) {
    // clientsrv.getcurrentstaff().then(function (staff) {
    //   //当前人员的信息
    //   $scope.staff = staff;
    //  console.log($scope.staff)
    // });

    //获取最近的库存
    guidesrv.getlatestinventorys($stateParams.insId).then(function (data) {
      $scope.latestInventorys = data;
      console.log($scope.latestInventorys);
    });

    //判断当前角色
    clientsrv.getcurrentstaff().then(function (staff) {
      $scope.staff = staff;
      $scope.staff.IsAE = staff.Roles.indexOf('AE_REP') != -1;
      $scope.staff.IsCCR = !$scope.staff.IsAE;
      console.log($scope.staff);
    });
    //获取当日填写过的进销存
    guidesrv.getdailyinventorys($stateParams.insId).then(function (dailyData) {
      //获取全部库存
      guidesrv.getskus($stateParams.insId).then(function (allData) {
        //如果当天填写过则取当天数据
        if (dailyData.length > 0) {
          $scope.SKUList = allData;
          for (var m = 0; m < dailyData.length; m++) {
            for (var n = 0; n < allData.length; n++) {
              if (allData[n].SkuID === dailyData[m].SkuModel.SkuID) {
                $scope.SKUList[n].SKUPrice = dailyData[m].DailySkuContentModel.SkuPrice;
                $scope.SKUList[n].SaleIn = dailyData[m].DailySkuContentModel.SaleIn;
                $scope.SKUList[n].SaleOut = dailyData[m].DailySkuContentModel.SaleOut;
                $scope.SKUList[n].Stock = dailyData[m].DailySkuContentModel.Stock;
                $scope.SKUList[n].PositionCount = dailyData[m].DailySkuContentModel.PositionCount;
                $scope.SKUList[n].ProposalOrder = dailyData[m].DailySkuContentModel.ProposalOrder;
              }
            }
          }
        }
        else {
          $scope.SKUList = allData;
        }

        console.log($scope.SKUList);
      });

    });

    //初始化
    $scope.init = function () {
      // $scope.getLatestInventorys();
      // $scope.getDailyInventorys();
    };
    $scope.init();


    //保存库存
    $scope.SaveInventory = function () {
      console.log($scope.SKUList);

      var model = [];
      for (var i = 0; i < $scope.SKUList.length; i++) {
        $scope.SKUList[i].InstitutionID = $stateParams.insId;
        // $scope.SKUList[i].SkuID = $scope.SKUList[i].SkuID;
        // $scope.SKUList[i].SkuName = $scope.SKUList[i].SkuName;


        if (i === $scope.SKUList.length - 1) {
          // console.log($scope.SKUList);
          guidesrv.saveInventory($scope.SKUList).then(function () {
            $scope.popup("保存成功");
            $state.go("main.calldetails", {insId: $stateParams.insId});
          });
        }
      }


    }


  });
