angular.module('purchasesellstockcheck.ctrl', ['guide.srv', 'client.srv'])

  .controller('PurchasesellstockcheckCtrl', function ($scope, guidesrv, clientsrv, $stateParams) {
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
    //获取库存
    guidesrv.getskus($stateParams.insId).then(function (data) {
      $scope.SKUList = data;
      console.log($scope.SKUList);

    });
    //获取当日填写过的进销存
    $scope.getDailyInventorys = function () {
      guidesrv.getdailyinventorys($stateParams.insId).then(function (data) {
        $scope.dailyInventorys = data;
        console.log($scope.dailyInventorys);
      });
    };

    //初始化
    $scope.init = function () {
      // $scope.getLatestInventorys();
      $scope.getDailyInventorys();
    };
    $scope.init();


    //保存库存
    $scope.SaveInventory = function () {
      console.log($scope.SKUList);

      var model=[];
      for (var i = 0; i < $scope.SKUList.length; i++) {
        $scope.SKUList[i].InstitutionID = $stateParams.insId;
        // $scope.SKUList[i].SkuID = $scope.SKUList[i].SkuID;
        // $scope.SKUList[i].SkuName = $scope.SKUList[i].SkuName;


        if (i === $scope.SKUList.length - 1) {
          // console.log($scope.SKUList);
          guidesrv.saveInventory($scope.SKUList).then(function () {
            $scope.popup("保存成功");
          });
        }
      }


    }


  });
