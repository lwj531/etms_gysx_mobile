angular.module('toast.dt', [])
  .directive("toast", function ($rootScope) {
    return {
      restrict: "E",
      replace: true,
      template: "<div class='msdtoast animated' ng-show='showtoast' ng-class='{fadeIn:showtoast}' >" +
      "<div class='toast-inner'><span ng-bind='message'></span></div>" +
      "</div>"
    };
  })
